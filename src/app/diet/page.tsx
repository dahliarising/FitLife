'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { useDiet } from '@/contexts/DietContext';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS, MealType } from '@/types/diet';
import { getFoodById, calculateNutrition } from '@/data/foods';

const CALORIE_GOAL = 2300;
const PROTEIN_GOAL = 150;

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function DietPage() {
  const { getTodayMeals, getDailyNutrition, deleteMeal } = useDiet();
  const todayMeals = getTodayMeals();
  const today = new Date().toISOString().split('T')[0];
  const dailyNutrition = getDailyNutrition(today);

  const caloriePercent = Math.min(100, Math.round((dailyNutrition.calories / CALORIE_GOAL) * 100));
  const proteinPercent = Math.min(100, Math.round((dailyNutrition.protein / PROTEIN_GOAL) * 100));

  const getMealsByType = (type: MealType) =>
    todayMeals.filter((m) => m.mealType === type);

  return (
    <>
      <Header title="식단" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* 일일 영양 요약 */}
        <Card>
          <h2 className="text-sm font-semibold text-muted mb-3">오늘의 영양</h2>
          <div className="space-y-3">
            {/* 칼로리 바 */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium">칼로리</span>
                <span>
                  <span className="font-bold text-primary">{dailyNutrition.calories}</span>
                  <span className="text-muted"> / {CALORIE_GOAL} kcal</span>
                </span>
              </div>
              <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
            </div>

            {/* 매크로 */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-secondary">{dailyNutrition.protein}g</p>
                <p className="text-[10px] text-muted">단백질 ({proteinPercent}%)</p>
                <div className="h-1 bg-surface-hover rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-accent">{dailyNutrition.carbs}g</p>
                <p className="text-[10px] text-muted">탄수화물</p>
              </div>
              <div>
                <p className="text-lg font-bold">{dailyNutrition.fat}g</p>
                <p className="text-[10px] text-muted">지방</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 식사별 기록 */}
        {MEAL_ORDER.map((mealType) => {
          const mealsOfType = getMealsByType(mealType);
          return (
            <Card key={mealType} padding="none">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <span>{MEAL_TYPE_ICONS[mealType]}</span>
                  <h3 className="text-sm font-semibold">{MEAL_TYPE_LABELS[mealType]}</h3>
                </div>
                <Link href={`/diet/new?meal=${mealType}`}>
                  <Button variant="ghost" size="sm">+ 추가</Button>
                </Link>
              </div>

              {mealsOfType.length === 0 ? (
                <div className="px-4 pb-4">
                  <p className="text-xs text-muted">기록 없음</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {mealsOfType.map((meal) => {
                    const mealCals = meal.entries.reduce((sum, e) => {
                      const food = getFoodById(e.foodId);
                      if (!food) return sum;
                      return sum + calculateNutrition(food, e.amountG).calories;
                    }, 0);

                    return (
                      <div key={meal.id} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          {meal.entries.map((e) => {
                            const food = getFoodById(e.foodId);
                            return food ? (
                              <p key={e.foodId} className="text-sm">
                                {food.name} <span className="text-muted text-xs">{e.amountG}g</span>
                              </p>
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">{mealCals}kcal</span>
                          <button
                            onClick={() => deleteMeal(meal.id)}
                            className="p-1 text-muted hover:text-danger transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                              <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
