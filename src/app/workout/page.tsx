'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { Button, Card } from '@/components/ui';
import { useWorkout } from '@/contexts/WorkoutContext';
import { getExerciseById } from '@/data/exercises';
import { MUSCLE_GROUP_LABELS } from '@/types/workout';
import {
  getPersonalRecords,
  getMuscleFrequency,
  getWeeklyVolumeTrend,
  getOverallStats,
} from '@/lib/workout-stats';

type TabType = 'history' | 'stats';

export default function WorkoutPage() {
  const { sessions, deleteSession } = useWorkout();
  const [tab, setTab] = useState<TabType>('history');

  const todaySessions = sessions.filter(
    (s) => s.date === new Date().toISOString().split('T')[0]
  );
  const pastSessions = sessions.filter(
    (s) => s.date !== new Date().toISOString().split('T')[0]
  );

  return (
    <>
      <Header title="운동" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* 탭 전환 */}
        <div className="flex bg-surface-hover rounded-xl p-1">
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'history' ? 'bg-surface text-foreground shadow-sm' : 'text-muted'
            }`}
          >
            기록
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'stats' ? 'bg-surface text-foreground shadow-sm' : 'text-muted'
            }`}
          >
            통계
          </button>
        </div>

        {tab === 'history' && (
          <>
            {/* 새 운동 시작 버튼 */}
            <Link href="/workout/new">
              <Button variant="primary" size="lg" fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                새 운동 시작
              </Button>
            </Link>

            {/* 오늘의 운동 */}
            {todaySessions.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted mb-3">오늘의 운동</h2>
                <div className="space-y-3">
                  {todaySessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onDelete={() => deleteSession(session.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 운동 히스토리 */}
            {pastSessions.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted mb-3">운동 기록</h2>
                <div className="space-y-3">
                  {pastSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onDelete={() => deleteSession(session.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 빈 상태 */}
            {sessions.length === 0 && (
              <Card className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-1">운동 기록이 없어요</h3>
                <p className="text-sm text-muted">첫 번째 운동을 기록해보세요!</p>
              </Card>
            )}
          </>
        )}

        {tab === 'stats' && <StatsView sessions={sessions} />}
      </div>
    </>
  );
}

// 통계 뷰
function StatsView({
  sessions,
}: {
  sessions: ReadonlyArray<ReturnType<typeof import('@/contexts/WorkoutContext').useWorkout>['sessions'][0]>;
}) {
  const overall = getOverallStats(sessions);
  const weeklyTrend = getWeeklyVolumeTrend(sessions, 8);
  const muscleFreq = getMuscleFrequency(sessions, 30);
  const prs = getPersonalRecords(sessions);
  const maxVolume = Math.max(...weeklyTrend.map((w) => w.volume), 1);
  const maxFreq = Math.max(...muscleFreq.map((m) => m.count), 1);

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className="text-sm text-muted">운동 기록이 쌓이면 통계가 표시됩니다</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 전체 요약 */}
      <Card>
        <h3 className="text-sm font-semibold text-muted mb-3">전체 요약</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{overall.totalSessions}</p>
            <p className="text-xs text-muted">세션</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">{overall.totalSets}</p>
            <p className="text-xs text-muted">세트</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              {overall.totalVolume > 1000
                ? `${(overall.totalVolume / 1000).toFixed(1)}t`
                : `${overall.totalVolume}kg`}
            </p>
            <p className="text-xs text-muted">총 볼륨</p>
          </div>
        </div>
      </Card>

      {/* 주간 볼륨 추이 (바 차트) */}
      <Card>
        <h3 className="text-sm font-semibold text-muted mb-3">주간 볼륨 추이</h3>
        <div className="flex items-end gap-1 h-32">
          {weeklyTrend.map((week, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end h-24">
                <div
                  className="w-full bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                  style={{
                    height: `${week.volume > 0 ? Math.max(4, (week.volume / maxVolume) * 100) : 0}%`,
                  }}
                />
              </div>
              <span className="text-[9px] text-muted">{week.weekLabel}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 근육군별 빈도 (최근 30일) */}
      {muscleFreq.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">근육군별 빈도 (30일)</h3>
          <div className="space-y-2">
            {muscleFreq.map(({ muscle, label, count }) => (
              <div key={muscle} className="flex items-center gap-3">
                <span className="text-xs w-12 text-right text-muted">{label}</span>
                <div className="flex-1 h-5 bg-surface-hover rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all"
                    style={{ width: `${(count / maxFreq) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold w-6">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 개인 기록 (PR) */}
      {prs.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">개인 기록 (PR)</h3>
          <div className="space-y-2">
            {prs.slice(0, 10).map((pr) => (
              <div key={pr.exerciseId} className="flex items-center justify-between py-1.5">
                <div>
                  <p className="text-sm font-medium">{pr.exerciseName}</p>
                  <p className="text-xs text-muted">{pr.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{pr.maxWeight}kg</p>
                  <p className="text-[10px] text-muted">볼륨 {pr.maxVolume}kg</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// 세션 카드 컴포넌트
function SessionCard({
  session,
  onDelete,
}: {
  session: ReturnType<typeof import('@/contexts/WorkoutContext').useWorkout>['sessions'][0];
  onDelete: () => void;
}) {
  const exerciseNames = session.exercises
    .map((e) => getExerciseById(e.exerciseId)?.name ?? e.exerciseId)
    .join(', ');

  const totalSets = session.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const totalVolume = session.exercises.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

  const muscles = [
    ...new Set(
      session.exercises
        .map((e) => getExerciseById(e.exerciseId)?.primaryMuscle)
        .filter(Boolean)
    ),
  ];

  const dateObj = new Date(session.date + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <Link href={`/workout/${session.id}`}>
      <Card>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-muted">{dateStr}</p>
          <p className="font-semibold text-sm mt-0.5">{exerciseNames}</p>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
          className="p-1 text-muted hover:text-danger transition-colors"
          title="삭제"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex gap-4 text-xs text-muted">
        <span>{totalSets}세트</span>
        <span>{totalVolume.toLocaleString()}kg 볼륨</span>
        <span>
          {muscles.map((m) => MUSCLE_GROUP_LABELS[m!]).join(', ')}
        </span>
      </div>
    </Card>
    </Link>
  );
}
