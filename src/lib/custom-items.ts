import { Exercise } from '@/types/workout';
import { Food } from '@/types/diet';
import { generateId } from '@/lib/storage';

const CUSTOM_EXERCISES_KEY = 'fitlife_custom_exercises';
const CUSTOM_FOODS_KEY = 'fitlife_custom_foods';

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save<T>(key: string, items: T[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(items)); } catch {}
}

// === Custom Exercises ===
export function getCustomExercises(): Exercise[] {
  return load<Exercise>(CUSTOM_EXERCISES_KEY);
}

export function addCustomExercise(exercise: Omit<Exercise, 'id'>): Exercise {
  const items = getCustomExercises();
  const newItem: Exercise = { ...exercise, id: `custom-${generateId()}` };
  save(CUSTOM_EXERCISES_KEY, [...items, newItem]);
  return newItem;
}

export function removeCustomExercise(id: string) {
  const items = getCustomExercises().filter(e => e.id !== id);
  save(CUSTOM_EXERCISES_KEY, items);
}

// === Custom Foods ===
export function getCustomFoods(): Food[] {
  return load<Food>(CUSTOM_FOODS_KEY);
}

export function addCustomFood(food: Omit<Food, 'id'>): Food {
  const items = getCustomFoods();
  const newItem: Food = { ...food, id: `custom-${generateId()}` };
  save(CUSTOM_FOODS_KEY, [...items, newItem]);
  return newItem;
}

export function removeCustomFood(id: string) {
  const items = getCustomFoods().filter(f => f.id !== id);
  save(CUSTOM_FOODS_KEY, items);
}
