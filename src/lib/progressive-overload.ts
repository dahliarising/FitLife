import { WorkoutSet, WorkoutSession, SessionExercise } from '@/types/workout';

/** Progressive Overload 추천 결과 */
export interface OverloadSuggestion {
  weight: number;
  reps: number;
  message: string;
  type: 'increase_weight' | 'increase_reps' | 'maintain' | 'first_time';
}

// 무게 증가 단위 (kg)
const WEIGHT_INCREMENT = 2.5;
// 목표 렙 범위
const TARGET_REP_MIN = 8;
const TARGET_REP_MAX = 12;

/**
 * Double Progression 기반 Progressive Overload 추천
 *
 * 전략:
 * 1. 이전 기록 없음 → first_time (기본값 제안)
 * 2. 모든 세트가 목표 렙 상한(12렙) 이상 → 무게 +2.5kg, 렙을 하한(8)으로
 * 3. 모든 세트가 목표 렙 하한(8렙) 이상 → 같은 무게, 렙 +1
 * 4. 그 외 → 같은 무게/렙 유지
 */
export function suggestNextSet(
  exerciseId: string,
  sessions: ReadonlyArray<WorkoutSession>,
): OverloadSuggestion {
  const lastEntry = findLastExerciseEntry(exerciseId, sessions);

  if (!lastEntry || lastEntry.sets.length === 0) {
    return {
      weight: 20,
      reps: TARGET_REP_MAX,
      message: '첫 운동! 가볍게 시작하세요',
      type: 'first_time',
    };
  }

  const completedSets = lastEntry.sets.filter((s) => s.completed);
  if (completedSets.length === 0) {
    return {
      weight: lastEntry.sets[0].weight,
      reps: lastEntry.sets[0].reps,
      message: '지난번 미완료 — 같은 무게로 도전',
      type: 'maintain',
    };
  }

  const avgWeight = Math.round(average(completedSets.map((s) => s.weight)) * 10) / 10;
  const avgReps = Math.round(average(completedSets.map((s) => s.reps)));
  const allHitUpperBound = completedSets.every((s) => s.reps >= TARGET_REP_MAX);
  const allHitLowerBound = completedSets.every((s) => s.reps >= TARGET_REP_MIN);

  if (allHitUpperBound) {
    return {
      weight: avgWeight + WEIGHT_INCREMENT,
      reps: TARGET_REP_MIN,
      message: `무게 UP! ${avgWeight}→${avgWeight + WEIGHT_INCREMENT}kg`,
      type: 'increase_weight',
    };
  }

  if (allHitLowerBound) {
    return {
      weight: avgWeight,
      reps: Math.min(avgReps + 1, TARGET_REP_MAX),
      message: `렙 UP! ${avgReps}→${avgReps + 1}회`,
      type: 'increase_reps',
    };
  }

  return {
    weight: avgWeight,
    reps: avgReps,
    message: '같은 무게로 렙 채우기',
    type: 'maintain',
  };
}

/** 세션 히스토리에서 특정 운동의 가장 최근 기록 찾기 */
export function findLastExerciseEntry(
  exerciseId: string,
  sessions: ReadonlyArray<WorkoutSession>,
): SessionExercise | undefined {
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (entry) return entry;
  }
  return undefined;
}

/** 특정 운동의 총 볼륨(무게×렙) 트렌드 (최근 N세션) */
export function getVolumeTrend(
  exerciseId: string,
  sessions: ReadonlyArray<WorkoutSession>,
  limit: number = 5,
): number[] {
  const volumes: number[] = [];
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (entry) {
      const vol = entry.sets
        .filter((s) => s.completed)
        .reduce((sum, s) => sum + s.weight * s.reps, 0);
      volumes.push(vol);
      if (volumes.length >= limit) break;
    }
  }
  return volumes.reverse(); // 오래된 순 → 최신 순
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
