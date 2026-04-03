'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { WorkoutSession } from '@/types/workout';
import { loadSessions, saveSessions, generateId } from '@/lib/storage';

interface WorkoutContextType {
  sessions: WorkoutSession[];
  addSession: (session: Omit<WorkoutSession, 'id'>) => string;
  updateSession: (id: string, updates: Partial<WorkoutSession>) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => WorkoutSession | undefined;
  getTodaySessions: () => WorkoutSession[];
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setSessions(loadSessions());
    setLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) {
      saveSessions(sessions);
    }
  }, [sessions, loaded]);

  const addSession = useCallback((session: Omit<WorkoutSession, 'id'>): string => {
    const id = generateId();
    const newSession: WorkoutSession = { ...session, id };
    setSessions((prev) => [newSession, ...prev]);
    return id;
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<WorkoutSession>) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSession = useCallback(
    (id: string) => sessions.find((s) => s.id === id),
    [sessions]
  );

  const getTodaySessions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter((s) => s.date === today);
  }, [sessions]);

  return (
    <WorkoutContext.Provider
      value={{
        sessions,
        addSession,
        updateSession,
        deleteSession,
        getSession,
        getTodaySessions,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
