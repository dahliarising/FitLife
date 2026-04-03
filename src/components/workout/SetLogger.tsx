'use client';

import { useState } from 'react';
import { WorkoutSet, SessionExercise } from '@/types/workout';
import { getExerciseById } from '@/data/exercises';
import { generateId } from '@/lib/storage';
import { Button } from '@/components/ui';

interface SetLoggerProps {
  sessionExercise: SessionExercise;
  onUpdate: (updated: SessionExercise) => void;
  onRemove: () => void;
  lastSessionSets?: WorkoutSet[]; // 이전 세션 데이터 (progressive overload)
}

export default function SetLogger({
  sessionExercise,
  onUpdate,
  onRemove,
  lastSessionSets,
}: SetLoggerProps) {
  const exercise = getExerciseById(sessionExercise.exerciseId);
  const [collapsed, setCollapsed] = useState(false);

  if (!exercise) return null;

  const addSet = () => {
    const lastSet = sessionExercise.sets[sessionExercise.sets.length - 1];
    const newSet: WorkoutSet = {
      id: generateId(),
      reps: lastSet?.reps ?? 10,
      weight: lastSet?.weight ?? 0,
      restSeconds: 90,
      completed: false,
    };
    onUpdate({
      ...sessionExercise,
      sets: [...sessionExercise.sets, newSet],
    });
  };

  const updateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    onUpdate({
      ...sessionExercise,
      sets: sessionExercise.sets.map((s) =>
        s.id === setId ? { ...s, ...updates } : s
      ),
    });
  };

  const removeSet = (setId: string) => {
    onUpdate({
      ...sessionExercise,
      sets: sessionExercise.sets.filter((s) => s.id !== setId),
    });
  };

  const toggleSetComplete = (setId: string) => {
    const set = sessionExercise.sets.find((s) => s.id === setId);
    if (set) {
      updateSet(setId, { completed: !set.completed });
    }
  };

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-1 text-left"
        >
          <p className="font-semibold text-sm">{exercise.name}</p>
          <p className="text-xs text-muted">
            {sessionExercise.sets.length}세트 · {exercise.equipment}
          </p>
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 text-muted hover:text-danger transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 space-y-3">
          {/* Previous session hint + progressive overload */}
          {lastSessionSets && lastSessionSets.length > 0 && (
            <div className="text-xs bg-primary/5 rounded-lg px-3 py-2 space-y-1">
              <p className="text-muted">
                💡 지난번: {lastSessionSets.filter((s) => s.completed).map((s) => `${s.weight}kg×${s.reps}`).join(', ')}
              </p>
            </div>
          )}

          {/* Column headers */}
          <div className="grid grid-cols-[2rem_1fr_1fr_2rem_2rem] gap-2 text-xs text-muted font-medium px-1">
            <span>세트</span>
            <span className="text-center">무게(kg)</span>
            <span className="text-center">렙</span>
            <span></span>
            <span></span>
          </div>

          {/* Sets */}
          {sessionExercise.sets.map((set, index) => (
            <div
              key={set.id}
              className={`grid grid-cols-[2rem_1fr_1fr_2rem_2rem] gap-2 items-center ${
                set.completed ? 'opacity-60' : ''
              }`}
            >
              <span className="text-xs text-muted font-medium text-center">
                {index + 1}
              </span>
              <input
                type="number"
                value={set.weight || ''}
                onChange={(e) => updateSet(set.id, { weight: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-2 py-2 rounded-lg bg-surface-hover border border-border text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                value={set.reps || ''}
                onChange={(e) => updateSet(set.id, { reps: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-2 py-2 rounded-lg bg-surface-hover border border-border text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={() => toggleSetComplete(set.id)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  set.completed
                    ? 'bg-secondary text-white'
                    : 'bg-surface-hover text-muted hover:bg-secondary/20'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => removeSet(set.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}

          {/* Add set button */}
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={addSet}
          >
            + 세트 추가
          </Button>
        </div>
      )}
    </div>
  );
}
