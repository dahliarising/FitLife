'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui';
import ExercisePicker from '@/components/workout/ExercisePicker';
import SetLogger from '@/components/workout/SetLogger';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useRoutine } from '@/contexts/RoutineContext';
import { Exercise, SessionExercise } from '@/types/workout';
import { exercises } from '@/data/exercises';
import { getRecommendedExerciseIds, getExerciseCountByTime, ROUTINE_PRESETS } from '@/data/routines';
import { getExerciseById } from '@/data/exercises';
import { suggestNextSet } from '@/lib/progressive-overload';
import { generateId } from '@/lib/storage';

function NewWorkoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRecommended = searchParams.get('recommended') === 'true';

  const { addSession, sessions } = useWorkout();
  const { settings, todaySchedule, isRestDay } = useRoutine();
  const [step, setStep] = useState<'pick' | 'log'>('pick');
  const [exerciseEntries, setExerciseEntries] = useState<SessionExercise[]>([]);
  const [initialized, setInitialized] = useState(false);

  // 추천 모드: 자동으로 운동 구성
  useEffect(() => {
    if (isRecommended && !initialized && !isRestDay) {
      const count = getExerciseCountByTime(settings.availableMinutes);
      const recommendedIds = getRecommendedExerciseIds(
        todaySchedule.muscleGroups,
        exercises,
        count,
      );

      const entries: SessionExercise[] = recommendedIds
        .map((id) => {
          const ex = getExerciseById(id);
          if (!ex) return null;
          const suggestion = suggestNextSet(id, sessions);
          // 기본 3세트, progressive overload 추천값으로 세팅
          const sets = Array.from({ length: 3 }, () => ({
            id: generateId(),
            reps: suggestion.reps,
            weight: suggestion.weight,
            restSeconds: 90,
            completed: false,
          }));
          return { exerciseId: id, sets, notes: '' };
        })
        .filter((e): e is SessionExercise => e !== null);

      setExerciseEntries(entries);
      setStep('log');
      setInitialized(true);
    }
  }, [isRecommended, initialized, isRestDay, settings, todaySchedule, sessions]);

  const handleSelectExercise = (exercise: Exercise) => {
    const suggestion = suggestNextSet(exercise.id, sessions);
    const entry: SessionExercise = {
      exerciseId: exercise.id,
      sets: [
        {
          id: generateId(),
          reps: suggestion.reps,
          weight: suggestion.weight,
          restSeconds: 90,
          completed: false,
        },
      ],
      notes: '',
    };
    setExerciseEntries((prev) => [...prev, entry]);
    setStep('log');
  };

  const handleUpdateExercise = (index: number, updated: SessionExercise) => {
    setExerciseEntries((prev) =>
      prev.map((e, i) => (i === index ? updated : e))
    );
  };

  const handleRemoveExercise = (index: number) => {
    setExerciseEntries((prev) => prev.filter((_, i) => i !== index));
    if (exerciseEntries.length <= 1) {
      setStep('pick');
    }
  };

  const getLastSessionSets = (exerciseId: string) => {
    for (const session of sessions) {
      const entry = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (entry) return entry.sets;
    }
    return undefined;
  };

  const handleSave = () => {
    if (exerciseEntries.length === 0) return;

    const now = new Date();
    addSession({
      date: now.toISOString().split('T')[0],
      startTime: now.toISOString(),
      endTime: new Date().toISOString(),
      exercises: exerciseEntries,
      notes: '',
      completed: true,
    });

    router.push('/workout');
  };

  return (
    <>
      <Header title={isRecommended ? todaySchedule.label : '새 운동'} />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {step === 'log' && exerciseEntries.length > 0 && (
          <>
            {/* 추천 모드 배지 */}
            {isRecommended && (
              <div className="text-xs text-muted bg-primary/5 rounded-lg px-3 py-2 flex items-center gap-2">
                <span>⚡</span>
                <span>
                  {ROUTINE_PRESETS[settings.splitType].name} — Progressive Overload 기반 추천
                </span>
              </div>
            )}

            {/* 운동별 세트 로거 */}
            {exerciseEntries.map((entry, i) => (
              <SetLogger
                key={`${entry.exerciseId}-${i}`}
                sessionExercise={entry}
                onUpdate={(updated) => handleUpdateExercise(i, updated)}
                onRemove={() => handleRemoveExercise(i)}
                lastSessionSets={getLastSessionSets(entry.exerciseId)}
              />
            ))}

            {/* 운동 추가 & 완료 버튼 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setStep('pick')}
              >
                + 운동 추가
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSave}
              >
                운동 완료
              </Button>
            </div>
          </>
        )}

        {step === 'pick' && (
          <>
            {exerciseEntries.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {exerciseEntries.length}개 운동 선택됨
                </p>
                <Button variant="ghost" size="sm" onClick={() => setStep('log')}>
                  돌아가기
                </Button>
              </div>
            )}
            <ExercisePicker
              onSelect={handleSelectExercise}
              selectedIds={exerciseEntries.map((e) => e.exerciseId)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default function NewWorkoutPage() {
  return (
    <Suspense>
      <NewWorkoutContent />
    </Suspense>
  );
}
