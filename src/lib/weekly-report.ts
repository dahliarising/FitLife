import { WorkoutSession } from '@/types/workout';
import { MealRecord } from '@/types/diet';
import { SleepRecord, calculateSleepHours } from '@/types/sleep';
import { MeditationSession } from '@/types/meditation';
import { RunSession } from '@/types/running';
import { getFoodById, calculateNutrition } from '@/data/foods';

export interface WeeklyReport {
  weekLabel: string;
  workout: { sessions: number; totalSets: number; totalVolume: number };
  diet: { avgCalories: number; avgProtein: number; daysTracked: number };
  sleep: { avgHours: number; avgQuality: number; daysTracked: number };
  meditation: { sessions: number; totalMinutes: number; streak: number };
  running: { sessions: number; totalKm: number; bestPace: number };
  insights: string[];
}

export function generateWeeklyReport(
  workoutSessions: ReadonlyArray<WorkoutSession>,
  meals: ReadonlyArray<MealRecord>,
  sleepRecords: ReadonlyArray<SleepRecord>,
  meditationSessions: ReadonlyArray<MeditationSession>,
  runningSessions: ReadonlyArray<RunSession>,
): WeeklyReport {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const startStr = weekAgo.toISOString().split('T')[0];
  const endStr = now.toISOString().split('T')[0];
  const weekLabel = `${weekAgo.getMonth()+1}/${weekAgo.getDate()} ~ ${now.getMonth()+1}/${now.getDate()}`;

  // Workout
  const weekWorkouts = workoutSessions.filter(s => s.date >= startStr && s.date <= endStr);
  let totalSets = 0, totalVolume = 0;
  for (const s of weekWorkouts) {
    for (const e of s.exercises) {
      for (const set of e.sets) {
        if (set.completed) { totalSets++; totalVolume += set.weight * set.reps; }
      }
    }
  }

  // Diet
  const weekMeals = meals.filter(m => m.date >= startStr && m.date <= endStr);
  const mealDates = [...new Set(weekMeals.map(m => m.date))];
  let totalCals = 0, totalProtein = 0;
  for (const m of weekMeals) {
    for (const e of m.entries) {
      const food = getFoodById(e.foodId);
      if (food) {
        const n = calculateNutrition(food, e.amountG);
        totalCals += n.calories;
        totalProtein += n.protein;
      }
    }
  }
  const avgCals = mealDates.length > 0 ? Math.round(totalCals / mealDates.length) : 0;
  const avgProtein = mealDates.length > 0 ? Math.round(totalProtein / mealDates.length) : 0;

  // Sleep
  const weekSleep = sleepRecords.filter(r => r.date >= startStr && r.date <= endStr);
  const sleepHours = weekSleep.map(r => calculateSleepHours(r.bedTime, r.wakeTime));
  const avgSleepHours = sleepHours.length > 0 ? Math.round(sleepHours.reduce((a,b) => a+b, 0) / sleepHours.length * 10) / 10 : 0;
  const avgQuality = weekSleep.length > 0 ? Math.round(weekSleep.reduce((a,r) => a+r.quality, 0) / weekSleep.length * 10) / 10 : 0;

  // Meditation
  const weekMed = meditationSessions.filter(s => s.date >= startStr && s.date <= endStr);
  const medMinutes = Math.round(weekMed.reduce((a,s) => a+s.durationSeconds, 0) / 60);

  // Running
  const weekRuns = runningSessions.filter(s => s.date >= startStr && s.date <= endStr);
  const totalKm = Math.round(weekRuns.reduce((a,s) => a+s.distanceKm, 0) * 10) / 10;
  const bestPace = weekRuns.length > 0 ? Math.min(...weekRuns.map(s => s.pacePerKm)) : 0;

  // Insights
  const insights: string[] = [];
  if (weekWorkouts.length >= 4) insights.push('이번 주 운동 4회 이상 달성! 꾸준히 하고 있어요');
  else if (weekWorkouts.length === 0) insights.push('이번 주 운동 기록이 없어요. 오늘 시작해볼까요?');
  if (avgProtein > 0 && avgProtein < 120) insights.push(`단백질 섭취(${avgProtein}g)가 목표(150g)보다 부족해요`);
  if (avgProtein >= 150) insights.push('단백질 목표 달성! 근성장에 도움이 됩니다');
  if (avgSleepHours > 0 && avgSleepHours < 7) insights.push(`평균 수면 ${avgSleepHours}시간 — 7시간 이상을 권장합니다`);
  if (avgSleepHours >= 7.5) insights.push('수면이 충분합니다. 회복에 큰 도움이 돼요');
  if (weekMed.length >= 5) insights.push('명상 습관이 잡혀가고 있어요!');
  if (totalKm >= 20) insights.push(`이번 주 ${totalKm}km 달성! 좋은 러닝 볼륨입니다`);
  if (insights.length === 0) insights.push('데이터가 쌓이면 더 정확한 인사이트를 제공합니다');

  return {
    weekLabel,
    workout: { sessions: weekWorkouts.length, totalSets, totalVolume },
    diet: { avgCalories: avgCals, avgProtein, daysTracked: mealDates.length },
    sleep: { avgHours: avgSleepHours, avgQuality, daysTracked: weekSleep.length },
    meditation: { sessions: weekMed.length, totalMinutes: medMinutes, streak: 0 },
    running: { sessions: weekRuns.length, totalKm, bestPace },
    insights,
  };
}
