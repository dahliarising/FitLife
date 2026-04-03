'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { MealRecord, MealEntry } from '@/types/diet';
import { getFoodById, calculateNutrition } from '@/data/foods';
import { generateId } from '@/lib/storage';

const STORAGE_KEY = 'fitlife_meals';

interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DietContextType {
  meals: MealRecord[];
  addMeal: (meal: Omit<MealRecord, 'id' | 'createdAt'>) => string;
  deleteMeal: (id: string) => void;
  getMeal: (id: string) => MealRecord | undefined;
  getTodayMeals: () => MealRecord[];
  getMealsByDate: (date: string) => MealRecord[];
  getDailyNutrition: (date: string) => DailyNutrition;
}

const DietContext = createContext<DietContextType | null>(null);

function loadMeals(): MealRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MealRecord[];
  } catch {
    return [];
  }
}

function saveMeals(meals: MealRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  } catch {
    // storage full
  }
}

function calcEntryNutrition(entries: MealEntry[]): DailyNutrition {
  return entries.reduce(
    (acc, entry) => {
      const food = getFoodById(entry.foodId);
      if (!food) return acc;
      const n = calculateNutrition(food, entry.amountG);
      return {
        calories: acc.calories + n.calories,
        protein: acc.protein + n.protein,
        carbs: acc.carbs + n.carbs,
        fat: acc.fat + n.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function DietProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMeals(loadMeals());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveMeals(meals);
    }
  }, [meals, loaded]);

  const addMeal = useCallback((meal: Omit<MealRecord, 'id' | 'createdAt'>): string => {
    const id = generateId();
    const newMeal: MealRecord = {
      ...meal,
      id,
      createdAt: new Date().toISOString(),
    };
    setMeals((prev) => [newMeal, ...prev]);
    return id;
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getMeal = useCallback(
    (id: string) => meals.find((m) => m.id === id),
    [meals],
  );

  const getTodayMeals = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter((m) => m.date === today);
  }, [meals]);

  const getMealsByDate = useCallback(
    (date: string) => meals.filter((m) => m.date === date),
    [meals],
  );

  const getDailyNutrition = useCallback(
    (date: string): DailyNutrition => {
      const dayMeals = meals.filter((m) => m.date === date);
      return dayMeals.reduce(
        (acc, meal) => {
          const n = calcEntryNutrition(meal.entries);
          return {
            calories: acc.calories + n.calories,
            protein: Math.round((acc.protein + n.protein) * 10) / 10,
            carbs: Math.round((acc.carbs + n.carbs) * 10) / 10,
            fat: Math.round((acc.fat + n.fat) * 10) / 10,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );
    },
    [meals],
  );

  return (
    <DietContext.Provider
      value={{
        meals,
        addMeal,
        deleteMeal,
        getMeal,
        getTodayMeals,
        getMealsByDate,
        getDailyNutrition,
      }}
    >
      {children}
    </DietContext.Provider>
  );
}

export function useDiet() {
  const context = useContext(DietContext);
  if (!context) {
    throw new Error('useDiet must be used within a DietProvider');
  }
  return context;
}
