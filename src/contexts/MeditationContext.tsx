'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { MeditationSession } from '@/types/meditation';
import { generateId } from '@/lib/storage';

const STORAGE_KEY = 'fitlife_meditation';

interface MeditationContextType {
  sessions: MeditationSession[];
  addSession: (session: Omit<MeditationSession, 'id' | 'completedAt'>) => string;
  getTodaySessions: () => MeditationSession[];
  getTodayMinutes: () => number;
  getStreak: () => number;
  getTotalSessions: () => number;
  getTotalMinutes: () => number;
}

const MeditationContext = createContext<MeditationContextType | null>(null);

function loadSessions(): MeditationSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MeditationSession[];
  } catch {
    return [];
  }
}

function saveSessions(sessions: MeditationSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // storage full
  }
}

export function MeditationProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveSessions(sessions);
    }
  }, [sessions, loaded]);

  const addSession = useCallback(
    (session: Omit<MeditationSession, 'id' | 'completedAt'>): string => {
      const id = generateId();
      const newSession: MeditationSession = {
        ...session,
        id,
        completedAt: new Date().toISOString(),
      };
      setSessions((prev) => [newSession, ...prev]);
      return id;
    },
    [],
  );

  const getTodaySessions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter((s) => s.date === today);
  }, [sessions]);

  const getTodayMinutes = useCallback(() => {
    const today = getTodaySessions();
    return Math.round(today.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
  }, [getTodaySessions]);

  const getStreak = useCallback((): number => {
    const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];

      if (dates.includes(expectedStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [sessions]);

  const getTotalSessions = useCallback(() => sessions.length, [sessions]);

  const getTotalMinutes = useCallback(
    () => Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60),
    [sessions],
  );

  return (
    <MeditationContext.Provider
      value={{
        sessions,
        addSession,
        getTodaySessions,
        getTodayMinutes,
        getStreak,
        getTotalSessions,
        getTotalMinutes,
      }}
    >
      {children}
    </MeditationContext.Provider>
  );
}

export function useMeditation() {
  const context = useContext(MeditationContext);
  if (!context) {
    throw new Error('useMeditation must be used within a MeditationProvider');
  }
  return context;
}
