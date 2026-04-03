import { WorkoutSession } from '@/types/workout';

const STORAGE_KEY = 'fitlife_workouts';

export function loadSessions(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WorkoutSession[];
  } catch (e) {
    console.error('Failed to load workout sessions:', e);
    return [];
  }
}

export function saveSessions(sessions: WorkoutSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save workout sessions:', e);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
