// 수면 품질
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

// 수면 기록
export interface SleepRecord {
  id: string;
  date: string;         // 기상 날짜 (YYYY-MM-DD)
  bedTime: string;       // 취침 시각 (HH:mm)
  wakeTime: string;      // 기상 시각 (HH:mm)
  quality: SleepQuality;
  notes: string;
}

export const QUALITY_LABELS: Record<SleepQuality, string> = {
  1: '매우 나쁨',
  2: '나쁨',
  3: '보통',
  4: '좋음',
  5: '매우 좋음',
};

export const QUALITY_EMOJIS: Record<SleepQuality, string> = {
  1: '😫',
  2: '😴',
  3: '😐',
  4: '😊',
  5: '🤩',
};

/** 취침-기상 시간으로 수면 시간(시) 계산 */
export function calculateSleepHours(bedTime: string, wakeTime: string): number {
  const [bedH, bedM] = bedTime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);

  let bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;

  // 자정 넘김 처리 (예: 23:30 → 07:00)
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10;
}
