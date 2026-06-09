import {
  CheckInAreaId,
  CHECK_IN_AREA_IDS,
  getCheckInAreasCovered,
  setCheckInAreasCovered,
} from '../services/checkIn';
import { completeCheckIn } from '../services/journey';
import { LyraChatResponse } from '../types';

function mergeAreas(existing: CheckInAreaId[], incoming: string[]): CheckInAreaId[] {
  const valid = incoming.filter((id): id is CheckInAreaId =>
    CHECK_IN_AREA_IDS.includes(id as CheckInAreaId),
  );
  return [...new Set([...existing, ...valid])];
}

export async function processCheckInResponse(
  response: LyraChatResponse,
  checkInMode: boolean,
  onComplete?: (isFirstCompletion: boolean) => void,
): Promise<void> {
  if (!checkInMode) return;

  if (response.areasCovered?.length) {
    const existing = await getCheckInAreasCovered();
    const merged = mergeAreas(existing, response.areasCovered);
    await setCheckInAreasCovered(merged);
  }

  if (response.checkInComplete) {
    const isFirst = await completeCheckIn();
    onComplete?.(isFirst);
  }
}
