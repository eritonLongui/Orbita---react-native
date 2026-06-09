import { setCheckInAreasCovered } from '../services/checkIn';
import { completeCheckIn } from '../services/journey';
import { LyraChatResponse } from '../types';

export async function processCheckInResponse(
  response: LyraChatResponse,
  checkInMode: boolean,
  onComplete?: (isFirstCompletion: boolean) => void,
): Promise<void> {
  if (!checkInMode) return;

  if (response.areasCovered?.length) {
    await setCheckInAreasCovered(response.areasCovered);
  }

  if (response.checkInComplete) {
    const isFirst = await completeCheckIn();
    onComplete?.(isFirst);
  }
}
