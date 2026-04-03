'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { BodyRecord, BodyGoal } from '@/types/body';
import { generateId } from '@/lib/storage';

const STORAGE_KEY = 'fitlife_body';
const GOAL_KEY = 'fitlife_body_goal';

interface BodyContextType {
  records: BodyRecord[];
  goal: BodyGoal;
  addRecord: (r: Omit<BodyRecord, 'id'>) => string;
  deleteRecord: (id: string) => void;
  getLatest: () => BodyRecord | undefined;
  getRecent: (days: number) => BodyRecord[];
  setGoal: (g: BodyGoal) => void;
}

const BodyContext = createContext<BodyContextType | null>(null);

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

export function BodyProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BodyRecord[]>([]);
  const [goal, setGoalState] = useState<BodyGoal>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(load(STORAGE_KEY, []));
    setGoalState(load(GOAL_KEY, {}));
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) save(STORAGE_KEY, records); }, [records, loaded]);
  useEffect(() => { if (loaded) save(GOAL_KEY, goal); }, [goal, loaded]);

  const addRecord = useCallback((r: Omit<BodyRecord, 'id'>): string => {
    const id = generateId();
    setRecords(prev => [{ ...r, id }, ...prev]);
    return id;
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const getLatest = useCallback(() => records[0], [records]);

  const getRecent = useCallback((days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return records.filter(r => r.date >= cutoffStr).sort((a, b) => a.date.localeCompare(b.date));
  }, [records]);

  const setGoal = useCallback((g: BodyGoal) => setGoalState(g), []);

  return (
    <BodyContext.Provider value={{ records, goal, addRecord, deleteRecord, getLatest, getRecent, setGoal }}>
      {children}
    </BodyContext.Provider>
  );
}

export function useBody() {
  const ctx = useContext(BodyContext);
  if (!ctx) throw new Error('useBody must be used within BodyProvider');
  return ctx;
}
