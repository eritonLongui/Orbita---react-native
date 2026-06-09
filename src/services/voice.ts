import {
  AudioModule,
  createAudioPlayer,
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioRecorder,
  type RecordingOptions,
} from 'expo-audio';
import {
  cacheDirectory,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

let recorder: AudioRecorder | null = null;
let player: AudioPlayer | null = null;
let silenceMonitor: ReturnType<typeof setInterval> | null = null;
let onSilenceStopCallback: (() => void) | null = null;

const SILENCE_POLL_MS = 100;
const POST_SPEECH_SILENCE_MS = 1000;
const CALIBRATION_MS = 400;
const SPEECH_ABOVE_NOISE_DB = 8;
const SILENCE_ABOVE_NOISE_DB = 4;
const PEAK_DROP_DB = 12;
const SPEECH_STREAK_MS = 200;
const MIN_SPEECH_MS = 400;
const MAX_RECORDING_MS = 45000;
const NOISE_FLOOR_MIN = -65;
const NOISE_FLOOR_MAX = -28;

/** Gravação otimizada para voz + Whisper (mono, metering para VAD). */
const LYRA_RECORDING_OPTIONS: RecordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
  numberOfChannels: 1,
  sampleRate: 44100,
  bitRate: 96000,
};

export async function requestMicrophonePermission(): Promise<boolean> {
  const { granted } = await requestRecordingPermissionsAsync();
  return granted;
}

export async function getMicrophonePermissionStatus(): Promise<string> {
  const { status } = await getRecordingPermissionsAsync();
  return status;
}

function clearSilenceMonitor() {
  if (silenceMonitor) {
    clearInterval(silenceMonitor);
    silenceMonitor = null;
  }
  onSilenceStopCallback = null;
}

function mimeForUri(uri: string): { mimeType: string; ext: string } {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.webm')) return { mimeType: 'audio/webm', ext: 'webm' };
  if (lower.endsWith('.wav')) return { mimeType: 'audio/wav', ext: 'wav' };
  if (lower.endsWith('.mp3')) return { mimeType: 'audio/mpeg', ext: 'mp3' };
  return { mimeType: 'audio/mp4', ext: 'm4a' };
}

export interface StartRecordingOptions {
  onSilenceAutoStop?: () => void;
}

export async function startRecording(options: StartRecordingOptions = {}): Promise<void> {
  const { onSilenceAutoStop } = options;

  clearSilenceMonitor();
  onSilenceStopCallback = onSilenceAutoStop ?? null;

  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    interruptionMode: 'doNotMix',
  });

  recorder = new AudioModule.AudioRecorder(LYRA_RECORDING_OPTIONS);
  await recorder.prepareToRecordAsync(LYRA_RECORDING_OPTIONS);
  recorder.record();

  if (!onSilenceStopCallback) return;

  let heardSpeech = false;
  let silenceSince: number | null = null;
  let speechStreakMs = 0;
  let peakLevel = -160;
  let noiseFloor = -48;
  let calibrated = false;
  const calibrationSamples: number[] = [];
  const startedAt = Date.now();

  const finishSilence = () => {
    const cb = onSilenceStopCallback;
    clearSilenceMonitor();
    cb?.();
  };

  silenceMonitor = setInterval(() => {
    if (!recorder?.isRecording) return;

    const status = recorder.getStatus();
    const level = status.metering ?? -160;
    const now = Date.now();
    const elapsed = now - startedAt;

    if (elapsed > MAX_RECORDING_MS) {
      finishSilence();
      return;
    }

    if (!calibrated) {
      calibrationSamples.push(level);
      if (elapsed < CALIBRATION_MS) return;

      const sorted = [...calibrationSamples].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] ?? -48;
      noiseFloor = Math.max(NOISE_FLOOR_MIN, Math.min(NOISE_FLOOR_MAX, median));
      calibrated = true;
    }

    const speechThreshold = noiseFloor + SPEECH_ABOVE_NOISE_DB;
    const silenceThreshold = noiseFloor + SILENCE_ABOVE_NOISE_DB;
    const isSpeaking = level >= speechThreshold;

    if (isSpeaking) {
      speechStreakMs += SILENCE_POLL_MS;
      if (speechStreakMs >= SPEECH_STREAK_MS) {
        heardSpeech = true;
        peakLevel = Math.max(peakLevel, level);
      }
      silenceSince = null;
    } else {
      speechStreakMs = 0;
    }

    if (!heardSpeech) return;

    if (status.durationMillis < MIN_SPEECH_MS) return;

    const belowNoiseSilence = level <= silenceThreshold;
    const belowPeakSilence = peakLevel > -100 && level <= peakLevel - PEAK_DROP_DB;
    const isSilent = belowNoiseSilence || belowPeakSilence;

    if (!isSilent) {
      silenceSince = null;
      return;
    }

    if (silenceSince === null) {
      silenceSince = now;
      return;
    }

    if (now - silenceSince >= POST_SPEECH_SILENCE_MS) {
      finishSilence();
    }
  }, SILENCE_POLL_MS);
}

export function cancelRecording(): void {
  clearSilenceMonitor();
  if (recorder) {
    void recorder.stop().finally(() => {
      recorder = null;
    });
  }
}

export async function stopRecording(): Promise<{ base64: string; mimeType: string; ext: string } | null> {
  clearSilenceMonitor();

  if (!recorder) return null;

  const duration = recorder.currentTime;
  await recorder.stop();

  // Aguarda o arquivo ser finalizado no disco
  await new Promise((r) => setTimeout(r, 250));

  const uri = recorder.uri;
  recorder = null;

  if (!uri || duration < 0.3) return null;

  const { mimeType, ext } = mimeForUri(uri);

  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    if (blob.size < 600) return null;
    const base64 = await blobToBase64Web(blob);
    return base64 ? { base64, mimeType, ext } : null;
  }

  const info = await getInfoAsync(uri);
  const fileSize = info.exists && 'size' in info ? info.size ?? 0 : 0;
  if (!info.exists || fileSize < 600) {
    console.warn('Recording file too small:', fileSize);
    return null;
  }

  const base64 = await readAsStringAsync(uri, { encoding: 'base64' });
  return base64 ? { base64, mimeType, ext } : null;
}

function blobToBase64Web(blob: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? null);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Som curto + haptic ao detectar fim da fala. */
export async function playReceivedFeedback(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // haptics opcional
  }

  try {
    await stopPlayback();
    const path = `${cacheDirectory}lyra-received-${Date.now()}.wav`;
    const wavBase64 = createShortBeepWavBase64();
    await writeAsStringAsync(path, wavBase64, { encoding: 'base64' });
    player = createAudioPlayer(path);
    player.volume = 0.35;
    player.play();
  } catch (e) {
    console.warn('playReceivedFeedback sound failed:', e);
  }
}

/** Beep suave ~0,15s para feedback de "mensagem recebida". */
function createShortBeepWavBase64(): string {
  const sampleRate = 8000;
  const durationSec = 0.15;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  const freq = 880;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.min(1, i / 200) * Math.max(0, 1 - (i - numSamples + 200) / 200);
    const sample = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
    view.setInt16(44 + i * 2, sample * 32767, true);
  }

  return bytesToBase64(new Uint8Array(buffer));
}

function bytesToBase64(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1] ?? 0;
    const c = bytes[i + 2] ?? 0;
    result += chars[a >> 2];
    result += chars[((a & 3) << 4) | (b >> 4)];
    result += i + 1 < bytes.length ? chars[((b & 15) << 2) | (c >> 6)] : '=';
    result += i + 2 < bytes.length ? chars[c & 63] : '=';
  }
  return result;
}

export async function playAudioBase64(base64: string, maxWaitMs = 90_000): Promise<void> {
  await stopPlayback();

  await setAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode: true,
  });

  const uri =
    Platform.OS === 'web'
      ? `data:audio/mpeg;base64,${base64}`
      : `${cacheDirectory}lyra-response-${Date.now()}.mp3`;

  if (Platform.OS !== 'web') {
    await writeAsStringAsync(uri, base64, { encoding: 'base64' });
  }

  player = createAudioPlayer(uri);
  player.play();

  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const timeout = setTimeout(finish, maxWaitMs);

    try {
      const subscription = player!.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          clearTimeout(timeout);
          subscription.remove();
          finish();
        }
      });
    } catch {
      clearTimeout(timeout);
      setTimeout(finish, 1500);
    }
  });
}

export async function stopPlayback(): Promise<void> {
  if (player) {
    player.pause();
    player.remove();
    player = null;
  }
}

export function speakText(text: string, rate = 0.95): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(text, {
      language: 'pt-BR',
      rate,
      onDone: () => resolve(),
      onStopped: () => resolve(),
    });
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}
