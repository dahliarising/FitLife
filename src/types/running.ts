export interface RunSession {
  id: string;
  date: string;
  distanceKm: number;
  durationSeconds: number;
  pacePerKm: number; // 초/km
  calories: number;
  notes: string;
}

/** 페이스를 "분:초/km" 형식으로 변환 */
export function formatPace(paceSeconds: number): string {
  const min = Math.floor(paceSeconds / 60);
  const sec = Math.round(paceSeconds % 60);
  return `${min}'${String(sec).padStart(2, '0')}"`;
}

/** 시간을 "HH:MM:SS" 형식으로 변환 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** 칼로리 추정 (METs 기반, 체중 70kg 기준) */
export function estimateCalories(distanceKm: number, durationSeconds: number): number {
  const hours = durationSeconds / 3600;
  const speedKmh = distanceKm / hours;
  const mets = speedKmh < 8 ? 8.3 : speedKmh < 10 ? 9.8 : speedKmh < 12 ? 11.0 : 12.8;
  return Math.round(mets * 70 * hours);
}
