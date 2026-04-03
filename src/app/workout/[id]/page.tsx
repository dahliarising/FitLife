'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { useWorkout } from '@/contexts/WorkoutContext';
import { getExerciseById } from '@/data/exercises';
import { MUSCLE_GROUP_LABELS } from '@/types/workout';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getSession, deleteSession } = useWorkout();

  const session = getSession(params.id as string);

  if (!session) {
    return (
      <>
        <Header title="운동 기록" />
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <p className="text-muted">세션을 찾을 수 없습니다</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push('/workout')}>
            ← 돌아가기
          </Button>
        </div>
      </>
    );
  }

  const dateObj = new Date(session.date + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const totalSets = session.exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const totalVolume = session.exercises.reduce(
    (sum, e) => sum + e.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

  const handleDelete = () => {
    deleteSession(session.id);
    router.push('/workout');
  };

  return (
    <>
      <Header title="운동 기록" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* 요약 */}
        <Card>
          <p className="text-xs text-muted mb-1">{dateStr}</p>
          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-2xl font-bold text-primary">{totalSets}</p>
              <p className="text-xs text-muted">총 세트</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{totalVolume.toLocaleString()}</p>
              <p className="text-xs text-muted">총 볼륨 (kg)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{session.exercises.length}</p>
              <p className="text-xs text-muted">운동 종류</p>
            </div>
          </div>
        </Card>

        {/* 운동별 상세 */}
        {session.exercises.map((entry, i) => {
          const exercise = getExerciseById(entry.exerciseId);
          if (!exercise) return null;
          return (
            <Card key={i}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm">{exercise.name}</p>
                  <p className="text-xs text-muted">
                    {MUSCLE_GROUP_LABELS[exercise.primaryMuscle]} · {exercise.equipment}
                  </p>
                </div>
              </div>

              {/* 세트 테이블 */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-3 gap-2 text-xs text-muted font-medium px-1">
                  <span>세트</span>
                  <span className="text-center">무게 (kg)</span>
                  <span className="text-center">렙</span>
                </div>
                {entry.sets.map((set, si) => (
                  <div
                    key={set.id}
                    className={`grid grid-cols-3 gap-2 text-sm px-1 py-1.5 rounded-lg ${
                      set.completed ? 'bg-secondary/5' : ''
                    }`}
                  >
                    <span className="text-muted">{si + 1}</span>
                    <span className="text-center font-medium">{set.weight}</span>
                    <span className="text-center font-medium">{set.reps}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => router.push('/workout')}>
            ← 돌아가기
          </Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>
            삭제
          </Button>
        </div>
      </div>
    </>
  );
}
