'use client';

import Header from '@/components/Header';
import { Card } from '@/components/ui';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useRoutine } from '@/contexts/RoutineContext';
import { useDiet } from '@/contexts/DietContext';
import { useSleep } from '@/contexts/SleepContext';
import { useMeditation } from '@/contexts/MeditationContext';
import { useHabits } from '@/contexts/HabitContext';
import { useBody } from '@/contexts/BodyContext';
import { useRunning } from '@/contexts/RunningContext';
import { generateCoachInsights } from '@/lib/ai-coach';
import { calculateSleepHours } from '@/types/sleep';
import { ROUTINE_PRESETS } from '@/data/routines';
import TodayRoutine from '@/components/workout/TodayRoutine';
import Link from 'next/link';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function HomePage() {
  const { sessions, getTodaySessions } = useWorkout();
  const { settings } = useRoutine();
  const { getDailyNutrition } = useDiet();
  const { getTodayRecord } = useSleep();
  const { getStreak, getTodayMinutes } = useMeditation();
  const preset = ROUTINE_PRESETS[settings.splitType];
  const meditationStreak = getStreak();
  const meditationMinutes = getTodayMinutes();
  const { habits, getTodayCount, increment, getTodayCompletionRate } = useHabits();
  const habitCompletion = getTodayCompletionRate();
  const { records: bodyRecords } = useBody();
  const { sessions: runSessions } = useRunning();
  const { meals } = useDiet();
  const { records: sleepRecords } = useSleep();
  const { sessions: medSessions } = useMeditation();
  const coachInsights = generateCoachInsights(sessions, meals, sleepRecords, medSessions, bodyRecords, runSessions);
  const today = new Date().toISOString().split('T')[0];
  const dailyNutrition = getDailyNutrition(today);
  const sleepRecord = getTodayRecord();
  const sleepHours = sleepRecord
    ? calculateSleepHours(sleepRecord.bedTime, sleepRecord.wakeTime)
    : 0;

  const todaySessions = getTodaySessions();

  // 오늘의 요약 계산
  const todayStats = todaySessions.reduce(
    (acc, session) => {
      // 운동 시간 (분)
      if (session.startTime && session.endTime) {
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        acc.minutes += Math.round((end - start) / 60000);
      }
      // 총 볼륨 (kg)
      for (const ex of session.exercises) {
        for (const set of ex.sets) {
          if (set.completed) {
            acc.volume += set.weight * set.reps;
            acc.sets += 1;
          }
        }
      }
      return acc;
    },
    { minutes: 0, volume: 0, sets: 0 },
  );

  // 이번 주 운동 완료 여부 (월~일)
  const weekStart = getWeekStart(new Date());
  const weekDayCompletion = DAY_LABELS.map((_, dayIdx) => {
    // dayIdx: 0=일, 1=월, ..., 6=토
    const targetDate = new Date(weekStart);
    // weekStart는 월요일 기준이므로: 월=0, 화=1, ..., 일=6
    const offset = dayIdx === 0 ? 6 : dayIdx - 1;
    targetDate.setDate(targetDate.getDate() + offset);
    const dateStr = targetDate.toISOString().split('T')[0];
    return sessions.some((s) => s.date === dateStr && s.completed);
  });

  const todayDow = new Date().getDay(); // 0=일

  return (
    <>
      <Header />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* 오늘의 요약 카드 */}
        <Card>
          <h2 className="text-sm font-semibold text-muted mb-3">오늘의 요약</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {todayStats.sets || '—'}
              </p>
              <p className="text-xs text-muted">완료 세트</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {dailyNutrition.calories || '—'}
              </p>
              <p className="text-xs text-muted">칼로리</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">
                {sleepHours > 0 ? `${sleepHours}h` : '—'}
              </p>
              <p className="text-xs text-muted">수면</p>
            </div>
          </div>
        </Card>

        {/* AI 코치 인사이트 */}
        {coachInsights.length > 0 && coachInsights[0].id !== 'all-good' && (
          <Card>
            <h2 className="text-sm font-semibold text-muted mb-2">AI 코치</h2>
            <div className="space-y-2">
              {coachInsights.slice(0, 3).map(insight => (
                <div key={insight.id} className={`flex gap-2.5 items-start p-2.5 rounded-xl ${
                  insight.priority === 'high' ? 'bg-danger/5' : 'bg-surface-hover'
                }`}>
                  <span className="text-sm mt-0.5 shrink-0">{insight.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted mt-0.5">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 오늘의 운동 */}
        <Card padding="none">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted">오늘의 운동</h2>
            <span className="text-xs text-muted">{preset.name}</span>
          </div>
          <div className="px-4 pb-4">
            <TodayRoutine compact />
          </div>
        </Card>

        {/* 명상 & 웰니스 */}
        <Link href="/sleep">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-lg">
                  🧘
                </div>
                <div>
                  <p className="font-semibold text-sm">마음 챙김</p>
                  <p className="text-xs text-muted">
                    {meditationMinutes > 0
                      ? `오늘 ${meditationMinutes}분 명상`
                      : '오늘 아직 명상하지 않았어요'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {meditationStreak > 0 && (
                  <p className="text-sm font-bold text-primary">{meditationStreak}일 연속</p>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-muted ml-auto">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Card>
        </Link>

        {/* 습관 체크리스트 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted">오늘의 습관</h2>
            <span className="text-xs text-primary font-medium">{habitCompletion}%</span>
          </div>
          <div className="space-y-2">
            {habits.map(habit => {
              const count = getTodayCount(habit.id);
              const done = count >= habit.targetPerDay;
              return (
                <button key={habit.id} onClick={() => increment(habit.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors ${done ? 'bg-secondary/10' : 'bg-surface-hover'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{habit.icon}</span>
                    <span className={`text-sm ${done ? 'line-through text-muted' : ''}`}>{habit.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${done ? 'text-secondary' : 'text-muted'}`}>
                    {count}/{habit.targetPerDay}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* 주간 스트릭 */}
        <Card>
          <h2 className="text-sm font-semibold text-muted mb-3">이번 주</h2>
          <div className="flex justify-between">
            {DAY_LABELS.map((day, i) => {
              const done = weekDayCompletion[i];
              const isToday = i === todayDow;
              const schedule = preset.schedule.find((d) => d.dayOfWeek === i);
              const isScheduledRest = schedule?.isRestDay ?? false;

              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      done
                        ? 'bg-secondary text-white'
                        : isToday
                        ? 'bg-primary text-white'
                        : isScheduledRest
                        ? 'bg-surface-hover text-muted/50'
                        : 'bg-surface-hover text-muted'
                    }`}
                  >
                    {done ? '✓' : day}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

/** 현재 주의 월요일 날짜 반환 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 일요일이면 -6, 그 외 1-day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
