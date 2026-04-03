'use client';

import Header from '@/components/Header';
import { Card } from '@/components/ui';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useDiet } from '@/contexts/DietContext';
import { useSleep } from '@/contexts/SleepContext';
import { useMeditation } from '@/contexts/MeditationContext';
import { useRunning } from '@/contexts/RunningContext';
import { generateWeeklyReport } from '@/lib/weekly-report';
import { formatPace } from '@/types/running';

export default function ReportPage() {
  const { sessions } = useWorkout();
  const { meals } = useDiet();
  const { records: sleepRecords } = useSleep();
  const { sessions: medSessions } = useMeditation();
  const { sessions: runSessions } = useRunning();

  const report = generateWeeklyReport(sessions, meals, sleepRecords, medSessions, runSessions);

  return (
    <>
      <Header title="주간 리포트" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <p className="text-xs text-muted text-center">{report.weekLabel}</p>

        {/* 인사이트 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-2">인사이트</h3>
          <div className="space-y-2">
            {report.insights.map((msg, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-sm mt-0.5">💡</span>
                <p className="text-sm">{msg}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 운동 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">운동</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-xl font-bold text-primary">{report.workout.sessions}</p><p className="text-[10px] text-muted">세션</p></div>
            <div><p className="text-xl font-bold text-secondary">{report.workout.totalSets}</p><p className="text-[10px] text-muted">세트</p></div>
            <div><p className="text-xl font-bold text-accent">{report.workout.totalVolume > 1000 ? `${(report.workout.totalVolume/1000).toFixed(1)}t` : `${report.workout.totalVolume}kg`}</p><p className="text-[10px] text-muted">볼륨</p></div>
          </div>
        </Card>

        {/* 식단 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">식단</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-xl font-bold text-primary">{report.diet.avgCalories || '—'}</p><p className="text-[10px] text-muted">평균 칼로리</p></div>
            <div><p className="text-xl font-bold text-secondary">{report.diet.avgProtein || '—'}g</p><p className="text-[10px] text-muted">평균 단백질</p></div>
            <div><p className="text-xl font-bold text-accent">{report.diet.daysTracked}</p><p className="text-[10px] text-muted">기록일</p></div>
          </div>
        </Card>

        {/* 수면 + 명상 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">웰니스</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{report.sleep.avgHours || '—'}h</p>
              <p className="text-[10px] text-muted">평균 수면</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-secondary">{report.meditation.totalMinutes}분</p>
              <p className="text-[10px] text-muted">명상 시간</p>
            </div>
          </div>
        </Card>

        {/* 러닝 */}
        {report.running.sessions > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-muted mb-3">러닝</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-xl font-bold text-primary">{report.running.totalKm}km</p><p className="text-[10px] text-muted">총 거리</p></div>
              <div><p className="text-xl font-bold text-secondary">{report.running.sessions}</p><p className="text-[10px] text-muted">러닝 횟수</p></div>
              <div><p className="text-xl font-bold text-accent">{formatPace(report.running.bestPace)}</p><p className="text-[10px] text-muted">최고 페이스</p></div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
