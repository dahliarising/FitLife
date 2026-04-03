/**
 * Apple Watch ↔ iPhone 동기화 리스너
 * Watch에서 운동 완료 시 CustomEvent로 데이터 수신
 */

export interface WatchWorkoutData {
  sets: Array<{
    exercise: string;
    exerciseId: string;
    weight: number;
    reps: number;
    setIndex: number;
    timestamp: number;
  }>;
  totalSets: number;
  totalVolume: number;
  date: string;
}

type WatchWorkoutHandler = (data: WatchWorkoutData) => void;

/** Watch 운동 완료 이벤트 리스너 등록 */
export function onWatchWorkoutCompleted(handler: WatchWorkoutHandler): () => void {
  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<WatchWorkoutData>;
    handler(customEvent.detail);
  };

  window.addEventListener('watchWorkoutCompleted', listener);
  return () => window.removeEventListener('watchWorkoutCompleted', listener);
}

/** Watch에 오늘 추천 운동 데이터 캐시 (WatchConnectivity에서 읽을 수 있도록) */
export function cacheExercisesForWatch(exercises: Array<{
  id: string;
  name: string;
  weight: number;
  reps: number;
  sets: number;
  equipment: string;
}>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('fitlife_exercises_cache', JSON.stringify(exercises));
  } catch {
    // storage full
  }
}
