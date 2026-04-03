import { WorkoutSession, MuscleGroup, MUSCLE_GROUP_LABELS } from '@/types/workout';
import { getExerciseById } from '@/data/exercises';
import { MealRecord } from '@/types/diet';
import { SleepRecord, calculateSleepHours } from '@/types/sleep';
import { MeditationSession } from '@/types/meditation';
import { BodyRecord } from '@/types/body';
import { RunSession } from '@/types/running';
import { getFoodById, calculateNutrition } from '@/data/foods';

export interface CoachInsight {
  id: string;
  icon: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: 'workout' | 'diet' | 'sleep' | 'meditation' | 'body' | 'running' | 'general';
}

export function generateCoachInsights(
  workouts: ReadonlyArray<WorkoutSession>,
  meals: ReadonlyArray<MealRecord>,
  sleepRecords: ReadonlyArray<SleepRecord>,
  meditations: ReadonlyArray<MeditationSession>,
  bodyRecords: ReadonlyArray<BodyRecord>,
  runs: ReadonlyArray<RunSession>,
): CoachInsight[] {
  const insights: CoachInsight[] = [];
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString().split('T')[0];

  // === WORKOUT INSIGHTS ===
  const recentWorkouts = workouts.filter(w => w.date >= weekStr);

  // 근육군 불균형 감지
  const muscleCount: Record<string, number> = {};
  for (const w of recentWorkouts) {
    for (const e of w.exercises) {
      const ex = getExerciseById(e.exerciseId);
      if (ex) muscleCount[ex.primaryMuscle] = (muscleCount[ex.primaryMuscle] ?? 0) + 1;
    }
  }
  const trainedMuscles = Object.keys(muscleCount);
  const neglected: MuscleGroup[] = ['chest', 'back', 'quads', 'shoulders']
    .filter(m => !trainedMuscles.includes(m)) as MuscleGroup[];

  if (neglected.length > 0 && recentWorkouts.length >= 2) {
    insights.push({
      id: 'neglected-muscles',
      icon: '⚠️',
      title: '근육 불균형 주의',
      message: `최근 7일간 ${neglected.map(m => MUSCLE_GROUP_LABELS[m]).join(', ')} 훈련이 없어요. 균형 잡힌 훈련을 추천합니다.`,
      priority: 'high',
      category: 'workout',
    });
  }

  // 오버트레이닝 경고
  if (recentWorkouts.length >= 6) {
    insights.push({
      id: 'overtraining',
      icon: '🔴',
      title: '충분히 쉬세요',
      message: '이번 주 6회 이상 운동했어요. 근육 회복을 위해 휴식일을 가지세요.',
      priority: 'high',
      category: 'workout',
    });
  }

  // === DIET INSIGHTS ===
  const todayMeals = meals.filter(m => m.date === today);
  let todayProtein = 0;
  for (const m of todayMeals) {
    for (const e of m.entries) {
      const food = getFoodById(e.foodId);
      if (food) todayProtein += calculateNutrition(food, e.amountG).protein;
    }
  }

  const hour = new Date().getHours();
  if (hour >= 12 && todayMeals.length === 0) {
    insights.push({
      id: 'no-meals',
      icon: '🍽️',
      title: '식사 기록을 시작하세요',
      message: '오늘 아직 식사 기록이 없어요. 정확한 영양 추적을 위해 기록해보세요.',
      priority: 'medium',
      category: 'diet',
    });
  }

  if (todayProtein > 0 && todayProtein < 100 && hour >= 18) {
    insights.push({
      id: 'low-protein',
      icon: '🥩',
      title: '단백질을 더 섭취하세요',
      message: `오늘 단백질 ${Math.round(todayProtein)}g — 목표(150g)까지 ${150 - Math.round(todayProtein)}g 부족합니다.`,
      priority: 'high',
      category: 'diet',
    });
  }

  // === SLEEP INSIGHTS ===
  const recentSleep = sleepRecords.filter(r => r.date >= weekStr);
  if (recentSleep.length >= 3) {
    const avgHours = recentSleep.reduce((a, r) => a + calculateSleepHours(r.bedTime, r.wakeTime), 0) / recentSleep.length;
    if (avgHours < 6.5) {
      insights.push({
        id: 'sleep-deficit',
        icon: '😴',
        title: '수면 부족',
        message: `최근 평균 수면 ${avgHours.toFixed(1)}시간. 7-8시간을 목표로 하세요. 수면 부족은 근회복과 체중 감량을 방해합니다.`,
        priority: 'high',
        category: 'sleep',
      });
    }
  }

  // === BODY INSIGHTS ===
  if (bodyRecords.length >= 2) {
    const sorted = [...bodyRecords].sort((a, b) => b.date.localeCompare(a.date));
    const recent = sorted[0];
    const prev = sorted[1];
    const diff = recent.weight - prev.weight;
    if (Math.abs(diff) > 0.5) {
      insights.push({
        id: 'weight-change',
        icon: diff > 0 ? '📈' : '📉',
        title: `체중 ${diff > 0 ? '증가' : '감소'}`,
        message: `${prev.date} 대비 ${diff > 0 ? '+' : ''}${diff.toFixed(1)}kg (${prev.weight}→${recent.weight}kg)`,
        priority: 'low',
        category: 'body',
      });
    }
  }

  // === MEDITATION ===
  const recentMed = meditations.filter(m => m.date >= weekStr);
  if (recentMed.length === 0 && recentWorkouts.length >= 3) {
    insights.push({
      id: 'add-meditation',
      icon: '🧘',
      title: '명상으로 회복력 UP',
      message: '운동을 열심히 하고 있지만 명상이 없어요. 5분 명상으로 스트레스를 줄이고 수면 질을 높여보세요.',
      priority: 'medium',
      category: 'meditation',
    });
  }

  // === GENERAL ===
  if (insights.length === 0) {
    insights.push({
      id: 'all-good',
      icon: '✨',
      title: '잘 하고 있어요!',
      message: '모든 영역이 균형 잡혀 있습니다. 이 페이스를 유지하세요!',
      priority: 'low',
      category: 'general',
    });
  }

  return insights.sort((a, b) => {
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });
}
