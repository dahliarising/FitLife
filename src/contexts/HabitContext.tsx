'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Habit, HabitLog, DEFAULT_HABITS } from '@/types/habits';
import { generateId } from '@/lib/storage';

const STORAGE_HABITS = 'fitlife_habits';
const STORAGE_LOGS = 'fitlife_habit_logs';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (name: string, icon: string, target: number) => void;
  removeHabit: (id: string) => void;
  increment: (habitId: string) => void;
  decrement: (habitId: string) => void;
  getTodayCount: (habitId: string) => number;
  getTodayCompletionRate: () => number;
}

const HabitContext = createContext<HabitContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function save(key: string, data: unknown) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHabits(load(STORAGE_HABITS, DEFAULT_HABITS));
    setLogs(load(STORAGE_LOGS, []));
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) save(STORAGE_HABITS, habits); }, [habits, loaded]);
  useEffect(() => { if (loaded) save(STORAGE_LOGS, logs); }, [logs, loaded]);

  const today = () => new Date().toISOString().split('T')[0];

  const addHabit = useCallback((name: string, icon: string, target: number) => {
    setHabits(prev => [...prev, { id: generateId(), name, icon, targetPerDay: target }]);
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const increment = useCallback((habitId: string) => {
    const d = today();
    setLogs(prev => {
      const existing = prev.find(l => l.date === d && l.habitId === habitId);
      if (existing) {
        return prev.map(l => l.date === d && l.habitId === habitId ? { ...l, count: l.count + 1 } : l);
      }
      return [...prev, { date: d, habitId, count: 1 }];
    });
  }, []);

  const decrement = useCallback((habitId: string) => {
    const d = today();
    setLogs(prev =>
      prev.map(l => l.date === d && l.habitId === habitId ? { ...l, count: Math.max(0, l.count - 1) } : l)
    );
  }, []);

  const getTodayCount = useCallback((habitId: string) => {
    const d = today();
    return logs.find(l => l.date === d && l.habitId === habitId)?.count ?? 0;
  }, [logs]);

  const getTodayCompletionRate = useCallback(() => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => getTodayCount(h.id) >= h.targetPerDay).length;
    return Math.round((completed / habits.length) * 100);
  }, [habits, getTodayCount]);

  return (
    <HabitContext.Provider value={{ habits, logs, addHabit, removeHabit, increment, decrement, getTodayCount, getTodayCompletionRate }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
