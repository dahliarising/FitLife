'use client';

import { useState, useEffect, useCallback } from 'react';

interface RestTimerProps {
  defaultSeconds?: number;
}

export default function RestTimer({ defaultSeconds = 90 }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    if (seconds <= 0) {
      setIsActive(false);
      // Vibrate if supported
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [isActive, seconds]);

  const start = useCallback((secs?: number) => {
    setSeconds(secs ?? defaultSeconds);
    setIsActive(true);
    setIsVisible(true);
  }, [defaultSeconds]);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsVisible(false);
  }, []);

  if (!isVisible) {
    return (
      <button onClick={() => start()}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
      </button>
    );
  }

  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  const progress = seconds / defaultSeconds;

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className="bg-surface border border-border rounded-2xl shadow-xl p-4 w-36">
        <div className="text-center">
          <p className="text-xs text-muted mb-1">휴식 타이머</p>
          <p className={`text-2xl font-bold tabular-nums ${seconds <= 10 ? 'text-danger' : 'text-primary'}`}>
            {min}:{String(sec).padStart(2, '0')}
          </p>
          <div className="h-1 bg-surface-hover rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[60, 90, 120].map(s => (
            <button key={s} onClick={() => start(s)}
              className="flex-1 py-1 rounded-lg bg-surface-hover text-[10px] font-medium text-muted hover:text-foreground">
              {s}s
            </button>
          ))}
        </div>
        <button onClick={stop} className="w-full mt-2 py-1 text-xs text-muted hover:text-danger transition-colors">닫기</button>
      </div>
    </div>
  );
}
