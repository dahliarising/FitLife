'use client';

import Header from '@/components/Header';
import { Card } from '@/components/ui';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useRoutine } from '@/contexts/RoutineContext';
import { useDiet } from '@/contexts/DietContext';
import { useSleep } from '@/contexts/SleepContext';
import { calculateSleepHours } from '@/types/sleep';
import { ROUTINE_PRESETS } from '@/data/routines';
import TodayRoutine from '@/components/workout/TodayRoutine';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function HomePage() {
  const { sessions, getTodaySessions } = useWorkout();
  const { settings } = useRoutine();
  const { getDailyNutrition } = useDiet();
  const { getTodayRecord } = useSleep();
  const preset = ROUTINE_PRESETS[settings.splitType];
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
