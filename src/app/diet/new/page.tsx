'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui';
import FoodPicker from '@/components/diet/FoodPicker';
import MealLogger from '@/components/diet/MealLogger';
import { useDiet } from '@/contexts/DietContext';
import { Food, MealEntry, MealType, MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/types/diet';
import { getFoodById, calculateNutrition } from '@/data/foods';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

function NewMealContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetMeal = searchParams.get('meal') as MealType | null;

  const { addMeal } = useDiet();
  const [mealType, setMealType] = useState<MealType>(presetMeal ?? 'lunch');
  const [step, setStep] = useState<'type' | 'pick' | 'log'>(presetMeal ? 'pick' : 'type');
  const [entries, setEntries] = useState<MealEntry[]>([]);

  const handleSelectFood = (food: Food) => {
    const entry: MealEntry = {
      foodId: food.id,
      amountG: food.defaultServingG,
    };
    setEntries((prev) => [...prev, entry]);
    setStep('log');
  };

  const handleUpdateEntry = (index: number, updated: MealEntry) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? updated : e))
    );
  };

  const handleRemoveEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
    if (entries.length <= 1) {
      setStep('pick');
    }
  };

  const handleSave = () => {
    if (entries.length === 0) return;
    addMeal({
      date: new Date().toISOString().split('T')[0],
      mealType,
      entries,
      notes: '',
    });
    router.push('/diet');
  };

  // 총 영양소 계산
  const totalNutrition = entries.reduce(
    (acc, e) => {
      const food = getFoodById(e.foodId);
      if (!food) return acc;
      const n = calculateNutrition(food, e.amountG);
      return {
        calories: acc.calories + n.calories,
        protein: acc.protein + n.protein,
        carbs: acc.carbs + n.carbs,
        fat: acc.fat + n.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <>
      <Header title={`${MEAL_TYPE_ICONS[mealType]} ${MEAL_TYPE_LABELS[mealType]} 추가`} />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* 식사 타입 선택 (프리셋 없을 때) */}
        {!presetMeal && step === 'type' && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted">식사 종류 선택</p>
            {MEAL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setMealType(type);
                  setStep('pick');
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl">{MEAL_TYPE_ICONS[type]}</span>
                <span className="font-semibold text-sm">{MEAL_TYPE_LABELS[type]}</span>
              </button>
            ))}
          </div>
        )}

        {step === 'log' && entries.length > 0 && (
          <>
            {/* 총 영양 요약 */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-primary/5">
                <p className="text-lg font-bold text-primary">{totalNutrition.calories}</p>
                <p className="text-[10px] text-muted">kcal</p>
              </div>
              <div className="p-2 rounded-xl bg-secondary/5">
                <p className="text-lg font-bold text-secondary">{totalNutrition.protein.toFixed(1)}g</p>
                <p className="text-[10px] text-muted">단백질</p>
              </div>
              <div className="p-2 rounded-xl bg-accent/5">
                <p className="text-lg font-bold text-accent">{totalNutrition.carbs.toFixed(1)}g</p>
                <p className="text-[10px] text-muted">탄수화물</p>
              </div>
              <div className="p-2 rounded-xl bg-surface-hover">
                <p className="text-lg font-bold">{totalNutrition.fat.toFixed(1)}g</p>
                <p className="text-[10px] text-muted">지방</p>
              </div>
            </div>

            {/* 음식별 로거 */}
            {entries.map((entry, i) => (
              <MealLogger
                key={`${entry.foodId}-${i}`}
                entry={entry}
                onUpdate={(updated) => handleUpdateEntry(i, updated)}
                onRemove={() => handleRemoveEntry(i)}
              />
            ))}

            {/* 버튼 */}
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setStep('pick')}>
                + 음식 추가
              </Button>
              <Button variant="primary" fullWidth onClick={handleSave}>
                저장
              </Button>
            </div>
          </>
        )}

        {step === 'pick' && (
          <>
            {entries.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{entries.length}개 음식 추가됨</p>
                <Button variant="ghost" size="sm" onClick={() => setStep('log')}>
                  돌아가기
                </Button>
              </div>
            )}
            <FoodPicker
              onSelect={handleSelectFood}
              selectedIds={entries.map((e) => e.foodId)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default function NewMealPage() {
  return (
    <Suspense>
      <NewMealContent />
    </Suspense>
  );
}
