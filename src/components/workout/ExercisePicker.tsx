'use client';

import { useState } from 'react';
import { Exercise, MuscleGroup, MUSCLE_GROUP_LABELS } from '@/types/workout';
import { exercises } from '@/data/exercises';

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void;
  selectedIds: string[];
}

const muscleGroups: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quads', 'hamstrings', 'glutes', 'calves', 'core',
];

export default function ExercisePicker({ onSelect, selectedIds }: ExercisePickerProps) {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = exercises.filter((e) => {
    if (selectedMuscle !== 'all' && e.primaryMuscle !== selectedMuscle) return false;
    if (search && !e.name.includes(search) && !e.nameEn.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <input
        type="text"
        placeholder="운동 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      {/* 근육군 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedMuscle('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selectedMuscle === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-hover text-muted'
          }`}
        >
          전체
        </button>
        {muscleGroups.map((mg) => (
          <button
            key={mg}
            onClick={() => setSelectedMuscle(mg)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedMuscle === mg
                ? 'bg-primary text-white'
                : 'bg-surface-hover text-muted'
            }`}
          >
            {MUSCLE_GROUP_LABELS[mg]}
          </button>
        ))}
      </div>

      {/* 운동 리스트 */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filtered.map((exercise) => {
          const isSelected = selectedIds.includes(exercise.id);
          return (
            <button
              key={exercise.id}
              onClick={() => !isSelected && onSelect(exercise)}
              disabled={isSelected}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                isSelected
                  ? 'bg-primary/10 border border-primary/30 opacity-60'
                  : 'bg-surface hover:bg-surface-hover border border-border'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{exercise.name}</p>
                <p className="text-xs text-muted">
                  {MUSCLE_GROUP_LABELS[exercise.primaryMuscle]} · {exercise.equipment}
                </p>
              </div>
              {isSelected && (
                <span className="text-xs text-primary font-medium">추가됨</span>
              )}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-8">검색 결과가 없습니다</p>
        )}
      </div>
    </div>
  );
}
