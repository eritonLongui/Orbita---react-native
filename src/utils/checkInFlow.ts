import {
  buildCheckInOpening,
  buildCheckInStepAfterAnswer,
  getAreasCompletedAfterAnsweredCount,
  getCheckInFlowStep,
  getCheckInStepIndex,
  setCheckInAreasCovered,
  setCheckInStepIndex,
} from '../services/checkIn';
import { sendToLyra } from '../services/conversation';
import { LyraChatResponse, LyraVoiceAccent, LyraVoiceStyle } from '../types';

async function synthesizeCheckInSpeech(
  text: string,
  voiceStyle: LyraVoiceStyle,
  voiceAccent: LyraVoiceAccent,
): Promise<string | undefined> {
  const res = await sendToLyra({
    text,
    structuredCheckIn: 'tts',
    voiceEnabled: true,
    voiceStyle,
    voiceAccent,
  });
  return res.audioBase64;
}

export async function fetchCheckInOpening(
  voiceEnabled: boolean,
  voiceStyle: LyraVoiceStyle,
  voiceAccent: LyraVoiceAccent,
): Promise<LyraChatResponse> {
  const opening = buildCheckInOpening();

  if (!voiceEnabled) {
    return opening;
  }

  const audioBase64 = await synthesizeCheckInSpeech(opening.reply, voiceStyle, voiceAccent);
  if (!audioBase64) {
    throw new Error('Não foi possível gerar a voz da Lyra.');
  }

  return { ...opening, audioBase64 };
}

export async function processStructuredCheckInTurn(params: {
  text?: string;
  audioBase64?: string;
  audioMimeType?: string;
  audioExt?: string;
  voiceEnabled?: boolean;
  voiceStyle: LyraVoiceStyle;
  voiceAccent: LyraVoiceAccent;
}): Promise<LyraChatResponse> {
  const stepIndex = await getCheckInStepIndex();
  const currentStep = getCheckInFlowStep(stepIndex);

  if (!currentStep) {
    throw new Error('Check-in já está completo para hoje.');
  }

  const nextStep = getCheckInFlowStep(stepIndex + 1);
  const isLastQuestion = !nextStep;

  const result = await sendToLyra({
    text: params.text,
    audioBase64: params.audioBase64,
    audioMimeType: params.audioMimeType,
    audioExt: params.audioExt,
    structuredCheckIn: 'answer',
    answerArea: `${currentStep.area}:${stepIndex}`,
    voiceEnabled: false,
    voiceStyle: params.voiceStyle,
    voiceAccent: params.voiceAccent,
    currentQuestion: currentStep.question,
    nextQuestion: nextStep?.question,
    isLastQuestion,
  });

  if (result.repeat) {
    const reply = result.reply !== 'ok' ? result.reply : `Sem problema. ${currentStep.question}`;
    const areasCovered = getAreasCompletedAfterAnsweredCount(stepIndex);

    if (!params.voiceEnabled) {
      return { reply, checkInComplete: false, areasCovered };
    }
    const audioBase64 = await synthesizeCheckInSpeech(reply, params.voiceStyle, params.voiceAccent);
    return { reply, checkInComplete: false, areasCovered, audioBase64 };
  }

  const nextStepIndex = stepIndex + 1;
  await setCheckInStepIndex(nextStepIndex);

  const areasCovered = getAreasCompletedAfterAnsweredCount(nextStepIndex);
  await setCheckInAreasCovered(areasCovered);

  const hasAdaptiveReply = result.reply && result.reply !== 'ok';
  const reply = hasAdaptiveReply
    ? result.reply
    : buildCheckInStepAfterAnswer(currentStep, nextStepIndex, areasCovered).reply;

  const checkInComplete = isLastQuestion;

  if (!params.voiceEnabled) {
    return { reply, checkInComplete, areasCovered };
  }

  const audioBase64 = await synthesizeCheckInSpeech(reply, params.voiceStyle, params.voiceAccent);
  if (!audioBase64) {
    throw new Error('Não foi possível gerar a voz da Lyra.');
  }

  return { reply, checkInComplete, areasCovered, audioBase64 };
}
