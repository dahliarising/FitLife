'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { SleepRecord, calculateSleepHours } from '@/types/sleep';
import { generateId } from '@/lib/storage';

const STORAGE_KEY = 'fitlife_sleep';

interface SleepContextType {
  records: SleepRecord[];
  addRecord: (record: Omit<SleepRecord, 'id'>) => string;
  deleteRecord: (id: string) => void;
  getTodayRecord: () => SleepRecord | undefined;
  getRecordByDate: (date: string) => SleepRecord | undefined;
  getWeekRecords: () => SleepRecord[];
  getAverageSleep: (days: number) => number;
}

const SleepContext = createContext<SleepContextType | null>(null);

function loadRecords(): SleepRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SleepRecord[];
  } catch {
    return [];
  }
}

function saveRecords(records: SleepRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage full
  }
}

export function SleepProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveRecords(records);
    }
  }, [records, loaded]);

  const addRecord = useCallback((record: Omit<SleepRecord, 'id'>): string => {
    const id = generateId();
    const newRecord: SleepRecord = { ...record, id };
    // 같은 날짜 기존 기록 교체
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== record.date);
      return [newRecord, ...filtered];
    });
    return id;
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getTodayRecord = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return records.find((r) => r.date === today);
  }, [records]);

  const getRecordByDate = useCallback(
    (date: string) => records.find((r) => r.date === date),
    [records],
  );

  const getWeekRecords = useCallback(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const cutoff = weekAgo.toISOString().split('T')[0];
    return records
      .filter((r) => r.date >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [records]);

  const getAverageSleep = useCallback(
    (days: number): number => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      const recent = records.filter((r) => r.date >= cutoffStr);
      if (recent.length === 0) return 0;
      const total = recent.reduce(
        (sum, r) => sum + calculateSleepHours(r.bedTime, r.wakeTime),
        0,
      );
      return Math.round((total / recent.length) * 10) / 10;
    },
    [records],
  );

  return (
    <SleepContext.Provider
      value={{
        records,
        addRecord,
        deleteRecord,
        getTodayRecord,
        getRecordByDate,
        getWeekRecords,
        getAverageSleep,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export function useSleep() {
  const context = useContext(SleepContext);
  if (!context) {
    throw new Error('useSleep must be used within a SleepProvider');
  }
  return context;
}
