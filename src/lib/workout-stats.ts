import { WorkoutSession, MuscleGroup, MUSCLE_GROUP_LABELS } from '@/types/workout';
import { getExerciseById } from '@/data/exercises';

/** 개인 기록 (PR) */
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxVolume: number; // 1세트 최대 볼륨 (weight × reps)
  date: string;
}

/** 주간 요약 */
export interface WeeklySummary {
  weekLabel: string; // "3/24~3/30"
  totalSessions: number;
  totalSets: number;
  totalVolume: number;
  totalExercises: number;
}

/** 운동별 PR 추출 */
export function getPersonalRecords(sessions: ReadonlyArray<WorkoutSession>): PersonalRecord[] {
  const prMap = new Map<string, PersonalRecord>();

  for (const session of sessions) {
    for (const ex of session.exercises) {
      const exercise = getExerciseById(ex.exerciseId);
      if (!exercise) continue;

      for (const set of ex.sets) {
        if (!set.completed) continue;
        const volume = set.weight * set.reps;
        const existing = prMap.get(ex.exerciseId);

        if (!existing || set.weight > existing.maxWeight || volume > existing.maxVolume) {
          prMap.set(ex.exerciseId, {
            exerciseId: ex.exerciseId,
            exerciseName: exercise.name,
            maxWeight: Math.max(existing?.maxWeight ?? 0, set.weight),
            maxVolume: Math.max(existing?.maxVolume ?? 0, volume),
            date: session.date,
          });
        }
      }
    }
  }

  return Array.from(prMap.values()).sort((a, b) => b.maxVolume - a.maxVolume);
}

/** 근육군별 세션 빈도 (최근 N일) */
export function getMuscleFrequency(
  sessions: ReadonlyArray<WorkoutSession>,
  days: number = 30,
): { muscle: MuscleGroup; label: string; count: number }[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const countMap: Record<string, number> = {};

  for (const session of sessions) {
    if (session.date < cutoffStr) continue;
    const seen = new Set<string>();
    for (const ex of session.exercises) {
      const exercise = getExerciseById(ex.exerciseId);
      if (!exercise || seen.has(exercise.primaryMuscle)) continue;
      seen.add(exercise.primaryMuscle);
      countMap[exercise.primaryMuscle] = (countMap[exercise.primaryMuscle] ?? 0) + 1;
    }
  }

  return Object.entries(countMap)
    .map(([muscle, count]) => ({
      muscle: muscle as MuscleGroup,
      label: MUSCLE_GROUP_LABELS[muscle as MuscleGroup],
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/** 주간별 볼륨 추이 (최근 N주) */
export function getWeeklyVolumeTrend(
  sessions: ReadonlyArray<WorkoutSession>,
  weeks: number = 8,
): { weekLabel: string; volume: number; sets: number }[] {
  const result: { weekLabel: string; volume: number; sets: number }[] = [];
  const now = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    let volume = 0;
    let sets = 0;

    for (const session of sessions) {
      if (session.date >= startStr && session.date <= endStr) {
        for (const ex of session.exercises) {
          for (const set of ex.sets) {
            if (set.completed) {
              volume += set.weight * set.reps;
              sets += 1;
            }
          }
        }
      }
    }

    const startLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    result.push({ weekLabel: startLabel, volume, sets });
  }

  return result;
}

/** 전체 통계 요약 */
export function getOverallStats(sessions: ReadonlyArray<WorkoutSession>) {
  let totalSessions = 0;
  let totalSets = 0;
  let totalVolume = 0;

  for (const session of sessions) {
    if (!session.completed) continue;
    totalSessions += 1;
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (set.completed) {
          totalSets += 1;
          totalVolume += set.weight * set.reps;
        }
      }
    }
  }

  return { totalSessions, totalSets, totalVolume };
}
