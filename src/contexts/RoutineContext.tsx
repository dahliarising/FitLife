'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { DaySchedule } from '@/types/workout';
import { SplitType, ROUTINE_PRESETS, getTodaySchedule } from '@/data/routines';

const STORAGE_KEY = 'fitlife_routine';

interface RoutineSettings {
  splitType: SplitType;
  availableMinutes: number; // 가용 운동 시간 (분)
}

interface RoutineContextType {
  settings: RoutineSettings;
  setSplitType: (split: SplitType) => void;
  setAvailableMinutes: (minutes: number) => void;
  todaySchedule: DaySchedule;
  isRestDay: boolean;
}

const DEFAULT_SETTINGS: RoutineSettings = {
  splitType: '3split',
  availableMinutes: 60,
};

const RoutineContext = createContext<RoutineContextType | null>(null);

function loadSettings(): RoutineSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: RoutineSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage full or unavailable
  }
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<RoutineSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveSettings(settings);
    }
  }, [settings, loaded]);

  const setSplitType = useCallback((splitType: SplitType) => {
    setSettings((prev) => ({ ...prev, splitType }));
  }, []);

  const setAvailableMinutes = useCallback((availableMinutes: number) => {
    setSettings((prev) => ({ ...prev, availableMinutes }));
  }, []);

  const preset = ROUTINE_PRESETS[settings.splitType];
  const todaySchedule = getTodaySchedule(preset);

  return (
    <RoutineContext.Provider
      value={{
        settings,
        setSplitType,
        setAvailableMinutes,
        todaySchedule,
        isRestDay: todaySchedule.isRestDay,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
}
