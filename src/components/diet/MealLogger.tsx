'use client';

import { useState } from 'react';
import { MealEntry } from '@/types/diet';
import { getFoodById, calculateNutrition } from '@/data/foods';
import { Button } from '@/components/ui';

interface MealLoggerProps {
  entry: MealEntry;
  onUpdate: (updated: MealEntry) => void;
  onRemove: () => void;
}

export default function MealLogger({ entry, onUpdate, onRemove }: MealLoggerProps) {
  const food = getFoodById(entry.foodId);
  const [showDetail, setShowDetail] = useState(false);

  if (!food) return null;

  const nutrition = calculateNutrition(food, entry.amountG);

  const handleAmountChange = (value: string) => {
    const amount = Number(value) || 0;
    onUpdate({ ...entry, amountG: amount });
  };

  const setToServing = () => {
    onUpdate({ ...entry, amountG: food.defaultServingG });
  };

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="flex-1 text-left"
        >
          <p className="font-semibold text-sm">{food.name}</p>
          <p className="text-xs text-muted">
            {entry.amountG}g · {nutrition.calories}kcal
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

      {showDetail && (
        <div className="px-4 pb-4 space-y-3">
          {/* 양 입력 */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={entry.amountG || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 rounded-lg bg-surface-hover border border-border text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span className="text-sm text-muted">g</span>
            <Button variant="ghost" size="sm" onClick={setToServing}>
              1인분 ({food.defaultServingG}g)
            </Button>
          </div>

          {/* 영양소 표시 */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-primary/5">
              <p className="text-sm font-bold text-primary">{nutrition.calories}</p>
              <p className="text-[10px] text-muted">kcal</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/5">
              <p className="text-sm font-bold text-secondary">{nutrition.protein}g</p>
              <p className="text-[10px] text-muted">단백질</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/5">
              <p className="text-sm font-bold text-accent">{nutrition.carbs}g</p>
              <p className="text-[10px] text-muted">탄수화물</p>
            </div>
            <div className="p-2 rounded-lg bg-surface-hover">
              <p className="text-sm font-bold">{nutrition.fat}g</p>
              <p className="text-[10px] text-muted">지방</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
