/**
 * HealthKit 연동 — NRC 러닝 데이터 읽기 + 운동 데이터 기록
 *
 * Nike Run Club → HealthKit에 HKWorkout으로 기록
 * → 이 앱이 HealthKit에서 읽어와서 RunSession으로 변환
 *
 * Capacitor 환경에서만 동작. 웹에서는 graceful fallback.
 */

export interface HealthKitRunData {
  startDate: string;
  endDate: string;
  distanceKm: number;
  durationSeconds: number;
  calories: number;
  sourceName: string; // "Nike Run Club", "Apple Watch" 등
}

export interface HealthKitDayStats {
  steps: number;
  activeCalories: number;
  restingHeartRate: number;
}

/** Capacitor 네이티브 브릿지 호출 헬퍼 */
async function callNative<T>(method: string, args?: Record<string, unknown>): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  const cap = (window as unknown as Record<string, unknown>).Capacitor as { Plugins?: Record<string, Record<string, (args?: unknown) => Promise<T>>> } | undefined;
  if (!cap?.Plugins?.FitLifeHealth) return null;
  try {
    return await cap.Plugins.FitLifeHealth[method](args);
  } catch {
    return null;
  }
}

/** HealthKit 사용 가능 여부 */
export function isHealthKitAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as Record<string, unknown>).Capacitor as { isNativePlatform?: () => boolean } | undefined;
  return cap?.isNativePlatform?.() ?? false;
}

/** HealthKit 권한 요청 */
export async function requestHealthKitPermission(): Promise<boolean> {
  const result = await callNative<{ granted: boolean }>('requestPermission');
  return result?.granted ?? false;
}

/**
 * HealthKit에서 러닝 데이터 가져오기 (NRC 포함)
 * startDate 이후의 모든 러닝 워크아웃을 반환
 */
export async function fetchRunningWorkouts(
  startDate: string,
): Promise<HealthKitRunData[]> {
  const result = await callNative<{ workouts: HealthKitRunData[] }>(
    'fetchRunningWorkouts',
    { startDate },
  );
  return result?.workouts ?? [];
}

/** 오늘의 걸음 수 + 활동 칼로리 + 안정시 심박수 */
export async function fetchTodayStats(): Promise<HealthKitDayStats | null> {
  return callNative<HealthKitDayStats>('fetchTodayStats');
}

/** 운동 세션을 HealthKit에 기록 */
export async function writeWorkout(data: {
  startDate: string;
  endDate: string;
  calories: number;
  activityType: 'strength' | 'running';
}): Promise<boolean> {
  const result = await callNative<{ success: boolean }>('writeWorkout', data);
  return result?.success ?? false;
}
