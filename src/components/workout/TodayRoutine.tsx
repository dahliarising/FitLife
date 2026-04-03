'use client';

import Link from 'next/link';
import { useRoutine } from '@/contexts/RoutineContext';
import { useWorkout } from '@/contexts/WorkoutContext';
import { exercises } from '@/data/exercises';
import { getRecommendedExerciseIds, getExerciseCountByTime, ROUTINE_PRESETS } from '@/data/routines';
import { getExerciseById } from '@/data/exercises';
import { MUSCLE_GROUP_LABELS } from '@/types/workout';
import { suggestNextSet } from '@/lib/progressive-overload';
import { Button } from '@/components/ui';

interface TodayRoutineProps {
  compact?: boolean; // 홈페이지용 간략 모드
}

export default function TodayRoutine({ compact = false }: TodayRoutineProps) {
  const { settings, todaySchedule, isRestDay } = useRoutine();
  const { sessions } = useWorkout();
  const preset = ROUTINE_PRESETS[settings.splitType];

  if (isRestDay) {
    return (
      <div className="rounded-2xl bg-surface border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-lg">
            😴
          </div>
          <div>
            <p className="font-semibold text-sm">오늘은 휴식일</p>
            <p className="text-xs text-muted">
              {preset.name} — 충분히 쉬고 내일 다시!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const count = getExerciseCountByTime(settings.availableMinutes);
  const recommendedIds = getRecommendedExerciseIds(
    todaySchedule.muscleGroups,
    exercises,
    count,
  );

  const muscleLabels = todaySchedule.muscleGroups
    .map((mg) => MUSCLE_GROUP_LABELS[mg])
    .join(' · ');

  if (compact) {
    return (
      <Link href="/workout/new?recommended=true" className="block">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{todaySchedule.label}</p>
            <p className="text-xs text-muted">{muscleLabels} · {count}가지 운동</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-muted">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{todaySchedule.label}</h3>
            <p className="text-xs text-muted mt-0.5">{muscleLabels}</p>
          </div>
          <span className="text-xs text-muted bg-surface-hover px-2 py-1 rounded-full">
            {settings.availableMinutes}분 · {count}가지
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {recommendedIds.map((id) => {
          const ex = getExerciseById(id);
          if (!ex) return null;
          const suggestion = suggestNextSet(id, sessions);

          return (
            <div key={id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{ex.name}</p>
                <p className="text-xs text-muted">{ex.equipment}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">
                  {suggestion.weight}kg × {suggestion.reps}
                </p>
                <p className={`text-[10px] ${
                  suggestion.type === 'increase_weight' ? 'text-secondary' :
                  suggestion.type === 'increase_reps' ? 'text-accent' :
                  'text-muted'
                }`}>
                  {suggestion.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4">
        <Link href="/workout/new?recommended=true">
          <Button variant="primary" fullWidth>
            추천 운동 시작
          </Button>
        </Link>
      </div>
    </div>
  );
}
