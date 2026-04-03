import { WorkoutSession } from '@/types/workout';
import { MeditationSession } from '@/types/meditation';
import { RunSession } from '@/types/running';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'diet' | 'meditation' | 'running' | 'streak';
  check: (data: AchievementData) => boolean;
}

interface AchievementData {
  workouts: ReadonlyArray<WorkoutSession>;
  meditations: ReadonlyArray<MeditationSession>;
  runs: ReadonlyArray<RunSession>;
  mealDays: number;
  meditationStreak: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Workout
  { id: 'first-workout', name: '첫 발걸음', description: '첫 운동 세션 완료', icon: '🎉', category: 'workout',
    check: d => d.workouts.length >= 1 },
  { id: '10-workouts', name: '10회 달성', description: '운동 세션 10회 완료', icon: '🔥', category: 'workout',
    check: d => d.workouts.length >= 10 },
  { id: '50-workouts', name: '반백', description: '운동 세션 50회 완료', icon: '⭐', category: 'workout',
    check: d => d.workouts.length >= 50 },
  { id: '100kg-bench', name: '100kg 벤치', description: '벤치프레스 100kg 달성', icon: '🏆', category: 'workout',
    check: d => d.workouts.some(w => w.exercises.some(e => e.exerciseId === 'bench-press' && e.sets.some(s => s.weight >= 100 && s.completed))) },
  { id: 'volume-10t', name: '10톤 클럽', description: '단일 세션 총 볼륨 10,000kg', icon: '💪', category: 'workout',
    check: d => d.workouts.some(w => {
      const vol = w.exercises.reduce((a, e) => a + e.sets.reduce((b, s) => b + (s.completed ? s.weight * s.reps : 0), 0), 0);
      return vol >= 10000;
    }) },

  // Running
  { id: 'first-run', name: '첫 러닝', description: '첫 러닝 완료', icon: '🏃', category: 'running',
    check: d => d.runs.length >= 1 },
  { id: '5k-run', name: '5K 달성', description: '5km 이상 러닝', icon: '🥉', category: 'running',
    check: d => d.runs.some(r => r.distanceKm >= 5) },
  { id: '10k-run', name: '10K 달성', description: '10km 이상 러닝', icon: '🥈', category: 'running',
    check: d => d.runs.some(r => r.distanceKm >= 10) },
  { id: 'total-100k', name: '100km 돌파', description: '누적 러닝 100km', icon: '🥇', category: 'running',
    check: d => d.runs.reduce((a, r) => a + r.distanceKm, 0) >= 100 },

  // Meditation
  { id: 'first-meditation', name: '첫 명상', description: '첫 명상 완료', icon: '🧘', category: 'meditation',
    check: d => d.meditations.length >= 1 },
  { id: '7-day-meditation', name: '7일 명상', description: '7일 연속 명상', icon: '🌟', category: 'streak',
    check: d => d.meditationStreak >= 7 },
  { id: '30-day-meditation', name: '30일 명상', description: '30일 연속 명상', icon: '👑', category: 'streak',
    check: d => d.meditationStreak >= 30 },

  // Diet
  { id: 'diet-7days', name: '일주일 기록', description: '7일 식단 기록', icon: '📝', category: 'diet',
    check: d => d.mealDays >= 7 },
  { id: 'diet-30days', name: '한 달 기록', description: '30일 식단 기록', icon: '📚', category: 'diet',
    check: d => d.mealDays >= 30 },
];

export function getUnlockedAchievements(data: AchievementData): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.check(data));
}

export function getLockedAchievements(data: AchievementData): Achievement[] {
  return ACHIEVEMENTS.filter(a => !a.check(data));
}
