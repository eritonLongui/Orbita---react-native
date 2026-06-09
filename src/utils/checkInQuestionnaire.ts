import { getLyraVoiceConfigFromProfile } from '../constants/lyraVoice';
import { completeCheckIn } from '../services/journey';
import { saveTodayTasks } from '../services/dailyTasks';
import { sendToLyra } from '../services/conversation';
import { CheckInAnswers, LyraChatResponse, Profile } from '../types';

export async function submitCheckInQuestionnaire(
  answers: CheckInAnswers,
  profile?: Profile | null,
): Promise<LyraChatResponse> {
  const voiceConfig = getLyraVoiceConfigFromProfile(profile);

  const response = await sendToLyra({
    structuredCheckIn: 'questionnaire',
    questionnaireAnswers: answers,
    voiceEnabled: true,
    voiceStyle: voiceConfig.style,
    voiceAccent: voiceConfig.accent,
  });

  if (response.dailyTasks?.length) {
    await saveTodayTasks(response.dailyTasks);
  }

  await completeCheckIn();

  return response;
}
