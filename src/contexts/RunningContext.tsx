'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RunSession } from '@/types/running';
import { generateId } from '@/lib/storage';

const STORAGE_KEY = 'fitlife_running';

interface RunningContextType {
  sessions: RunSession[];
  addSession: (s: Omit<RunSession, 'id'>) => string;
  deleteSession: (id: string) => void;
  getTotalDistance: () => number;
  getBestPace: () => number;
  getRecent: (count: number) => RunSession[];
}

const RunningContext = createContext<RunningContextType | null>(null);

export function RunningProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<RunSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSessions(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); } catch {}
    }
  }, [sessions, loaded]);

  const addSession = useCallback((s: Omit<RunSession, 'id'>): string => {
    const id = generateId();
    setSessions(prev => [{ ...s, id }, ...prev]);
    return id;
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  const getTotalDistance = useCallback(() =>
    Math.round(sessions.reduce((sum, s) => sum + s.distanceKm, 0) * 10) / 10,
  [sessions]);

  const getBestPace = useCallback(() => {
    if (sessions.length === 0) return 0;
    return Math.min(...sessions.map(s => s.pacePerKm));
  }, [sessions]);

  const getRecent = useCallback((count: number) =>
    sessions.slice(0, count),
  [sessions]);

  return (
    <RunningContext.Provider value={{ sessions, addSession, deleteSession, getTotalDistance, getBestPace, getRecent }}>
      {children}
    </RunningContext.Provider>
  );
}

export function useRunning() {
  const ctx = useContext(RunningContext);
  if (!ctx) throw new Error('useRunning must be used within RunningProvider');
  return ctx;
}
