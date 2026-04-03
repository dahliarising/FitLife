'use client';

import { useState, useEffect, useRef } from 'react';
import { AmbientSound, AMBIENT_LABELS } from '@/types/meditation';
import { startAmbientSound, stopAmbientSound } from '@/lib/ambient-sound';
import { Button } from '@/components/ui';

interface MeditationTimerProps {
  durationMinutes: number;
  guide?: string[];
  onComplete: (durationSeconds: number) => void;
  onCancel: () => void;
}

const AMBIENT_OPTIONS: AmbientSound[] = ['none', 'rain', 'ocean', 'forest', 'wind', 'white-noise'];

export default function MeditationTimer({
  durationMinutes,
  guide,
  onComplete,
  onCancel,
}: MeditationTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [guideIndex, setGuideIndex] = useState(0);
  const totalSeconds = durationMinutes * 60;
  const startTimeRef = useRef<number>(0);

  // Timer countdown
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          stopAmbientSound();
          const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
          onComplete(elapsed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  // Guide text progression
  useEffect(() => {
    if (!isActive || !guide || guide.length === 0) return;

    const intervalPerGuide = Math.floor(totalSeconds / guide.length);
    const elapsed = totalSeconds - secondsLeft;
    const newIndex = Math.min(Math.floor(elapsed / intervalPerGuide), guide.length - 1);
    setGuideIndex(newIndex);
  }, [isActive, secondsLeft, guide, totalSeconds]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setIsActive(true);
    startAmbientSound(ambientSound);
  };

  const handleStop = () => {
    setIsActive(false);
    stopAmbientSound();
    onCancel();
  };

  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // SVG circle dimensions
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Timer circle */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="currentColor"
            className="text-surface-hover"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="currentColor"
            className="text-primary transition-all duration-1000"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Center content */}
        <div className="relative z-10 text-center">
          <p className="text-4xl font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          {isActive && guide && guide[guideIndex] && (
            <p className="text-xs text-muted mt-2 max-w-[160px] leading-relaxed animate-pulse">
              {guide[guideIndex]}
            </p>
          )}
        </div>
      </div>

      {/* Ambient sound selector (before start) */}
      {!isActive && (
        <div className="w-full max-w-xs">
          <p className="text-xs text-muted mb-2 text-center">배경음</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {AMBIENT_OPTIONS.map((sound) => (
              <button
                key={sound}
                onClick={() => setAmbientSound(sound)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  ambientSound === sound
                    ? 'bg-primary text-white'
                    : 'bg-surface-hover text-muted hover:text-foreground'
                }`}
              >
                {AMBIENT_LABELS[sound]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-xs">
        {!isActive ? (
          <>
            <Button variant="outline" fullWidth onClick={onCancel}>
              뒤로
            </Button>
            <Button variant="primary" fullWidth onClick={handleStart}>
              시작
            </Button>
          </>
        ) : (
          <Button variant="outline" fullWidth onClick={handleStop}>
            중단
          </Button>
        )}
      </div>
    </div>
  );
}
