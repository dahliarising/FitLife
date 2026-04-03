/**
 * HealthKit 연동 레이어
 * Capacitor 환경에서만 동작. 웹에서는 graceful fallback.
 */

interface HealthData {
  steps: number;
  heartRate: number;
  activeCalories: number;
}

/** HealthKit 사용 가능 여부 */
export function isHealthKitAvailable(): boolean {
  return typeof window !== 'undefined' && 'Capacitor' in window;
}

/** 오늘의 건강 데이터 조회 (Capacitor 플러그인 필요) */
export async function getTodayHealthData(): Promise<HealthData | null> {
  if (!isHealthKitAvailable()) return null;

  try {
    // @capacitor-community/health 플러그인 사용 시
    // const { Health } = await import('@capacitor-community/health');
    // const steps = await Health.queryAggregated({ ... });

    // 현재는 Capacitor 플러그인 미설치 → null 반환
    return null;
  } catch {
    return null;
  }
}

/** HealthKit에 운동 데이터 기록 */
export async function writeWorkoutToHealthKit(data: {
  startDate: string;
  endDate: string;
  calories: number;
  activityType: string;
}): Promise<boolean> {
  if (!isHealthKitAvailable()) return false;

  try {
    // Capacitor HealthKit 플러그인으로 기록
    // 플러그인 설치 후 구현
    return false;
  } catch {
    return false;
  }
}

/**
 * HealthKit 설정 가이드
 *
 * 1. npm install @capacitor-community/health
 * 2. iOS: Info.plist에 Privacy 키 추가
 *    - NSHealthShareUsageDescription
 *    - NSHealthUpdateUsageDescription
 * 3. Xcode에서 HealthKit capability 활성화
 * 4. 위 함수들의 실제 구현 활성화
 */
