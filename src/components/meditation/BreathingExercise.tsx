'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BreathingPattern } from '@/types/meditation';
import { Button } from '@/components/ui';

interface BreathingExerciseProps {
  pattern: BreathingPattern;
  onComplete: (durationSeconds: number) => void;
  onCancel: () => void;
}

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';

const PHASE_LABELS: Record<Phase, string> = {
  inhale: '들이쉬기',
  hold1: '참기',
  exhale: '내쉬기',
  hold2: '참기',
  idle: '준비',
};

const PHASE_COLORS: Record<Phase, string> = {
  inhale: 'text-blue-400',
  hold1: 'text-amber-400',
  exhale: 'text-emerald-400',
  hold2: 'text-amber-400',
  idle: 'text-muted',
};

export default function BreathingExercise({
  pattern,
  onComplete,
  onCancel,
}: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [scale, setScale] = useState(0.6);
  const startTimeRef = useRef<number>(0);

  const phaseDuration = useCallback(
    (p: Phase): number => {
      switch (p) {
        case 'inhale': return pattern.inhale;
        case 'hold1': return pattern.hold1;
        case 'exhale': return pattern.exhale;
        case 'hold2': return pattern.hold2;
        default: return 0;
      }
    },
    [pattern],
  );

  const getNextPhase = useCallback(
    (current: Phase, cycle: number): { phase: Phase; cycle: number; done: boolean } => {
      const phases: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
      const idx = phases.indexOf(current);
      const next = idx + 1;

      if (next < phases.length) {
        const nextPhase = phases[next];
        // skip phases with 0 duration
        if (phaseDuration(nextPhase) === 0) {
          return getNextPhase(nextPhase, cycle);
        }
        return { phase: nextPhase, cycle, done: false };
      }

      // End of cycle
      const newCycle = cycle + 1;
      if (newCycle >= pattern.cycles) {
        return { phase: 'idle', cycle: newCycle, done: true };
      }
      return { phase: 'inhale', cycle: newCycle, done: false };
    },
    [pattern, phaseDuration],
  );

  useEffect(() => {
    if (!isActive || phase === 'idle') return;

    const duration = phaseDuration(phase);
    if (duration === 0) return;

    // Animate scale based on phase
    if (phase === 'inhale') setScale(1);
    else if (phase === 'exhale') setScale(0.6);
    // hold phases keep current scale

    setPhaseTimer(duration);

    const interval = setInterval(() => {
      setPhaseTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const next = getNextPhase(phase, currentCycle);
          if (next.done) {
            const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
            onComplete(elapsed);
            setIsActive(false);
            setPhase('idle');
          } else {
            setPhase(next.phase);
            setCurrentCycle(next.cycle);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, currentCycle, phaseDuration, getNextPhase, onComplete]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setCurrentCycle(0);
    setPhase('inhale');
    setIsActive(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Breathing circle */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-primary/20 transition-transform"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: `${phaseDuration(phase)}s`,
            transitionTimingFunction: phase === 'inhale' ? 'ease-in' : 'ease-out',
          }}
        />
        {/* Inner glow */}
        <div
          className="absolute rounded-full bg-primary/10 transition-all"
          style={{
            width: '80%',
            height: '80%',
            transform: `scale(${scale})`,
            transitionDuration: `${phaseDuration(phase)}s`,
            transitionTimingFunction: phase === 'inhale' ? 'ease-in' : 'ease-out',
          }}
        />
        {/* Center content */}
        <div className="relative z-10 text-center">
          <p className={`text-lg font-semibold ${PHASE_COLORS[phase]}`}>
            {PHASE_LABELS[phase]}
          </p>
          {isActive && (
            <p className="text-4xl font-bold mt-1">{phaseTimer}</p>
          )}
          {!isActive && phase === 'idle' && (
            <p className="text-sm text-muted mt-1">{pattern.name}</p>
          )}
        </div>
      </div>

      {/* Cycle progress */}
      {isActive && (
        <div className="flex gap-1.5">
          {Array.from({ length: pattern.cycles }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < currentCycle
                  ? 'bg-primary'
                  : i === currentCycle
                  ? 'bg-primary/50'
                  : 'bg-surface-hover'
              }`}
            />
          ))}
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
          <Button variant="outline" fullWidth onClick={() => {
            setIsActive(false);
            setPhase('idle');
            onCancel();
          }}>
            중단
          </Button>
        )}
      </div>

      {/* Info */}
      {!isActive && (
        <p className="text-xs text-muted text-center max-w-xs">
          {pattern.description} · {pattern.cycles}회 반복
        </p>
      )}
    </div>
  );
}
