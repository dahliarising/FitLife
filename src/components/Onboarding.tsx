'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { useRoutine } from '@/contexts/RoutineContext';
import { ROUTINE_PRESETS, SPLIT_OPTIONS } from '@/data/routines';
import { SplitType } from '@/data/routines';

interface OnboardingProps {
  onComplete: () => void;
}

const GOALS = ['근력 향상', '체중 감량', '체력 증진', '유연성', '스트레스 관리'];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { setSplitType, setAvailableMinutes } = useRoutine();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [split, setSplit] = useState<SplitType>('3split');
  const [time, setTime] = useState(60);

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleFinish = () => {
    setSplitType(split);
    setAvailableMinutes(time);
    if (name) localStorage.setItem('fitlife_username', name);
    if (selectedGoals.length > 0) localStorage.setItem('fitlife_goals', JSON.stringify(selectedGoals));
    localStorage.setItem('fitlife_onboarded', 'true');
    onComplete();
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="text-center space-y-6 py-8">
      <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-4xl">💪</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold">FitLife에 오신 걸 환영합니다</h1>
        <p className="text-sm text-muted mt-2">운동, 식단, 수면, 명상을 한곳에서</p>
      </div>
      <Button variant="primary" size="lg" fullWidth onClick={() => setStep(1)}>시작하기</Button>
    </div>,

    // Step 1: Name
    <div key="name" className="space-y-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold">이름을 알려주세요</h2>
        <p className="text-sm text-muted mt-1">앱에서 사용할 이름이에요</p>
      </div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력"
        className="w-full px-4 py-3 rounded-xl bg-surface-hover border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
      <Button variant="primary" fullWidth onClick={() => setStep(2)}>다음</Button>
    </div>,

    // Step 2: Goals
    <div key="goals" className="space-y-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold">목표를 선택하세요</h2>
        <p className="text-sm text-muted mt-1">여러 개 선택 가능</p>
      </div>
      <div className="space-y-2">
        {GOALS.map(g => (
          <button key={g} onClick={() => toggleGoal(g)}
            className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-colors ${
              selectedGoals.includes(g) ? 'border-primary bg-primary/5 text-primary' : 'border-border'
            }`}>{g}</button>
        ))}
      </div>
      <Button variant="primary" fullWidth onClick={() => setStep(3)}>다음</Button>
    </div>,

    // Step 3: Split
    <div key="split" className="space-y-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold">운동 분할을 선택하세요</h2>
      </div>
      <div className="space-y-2">
        {SPLIT_OPTIONS.map(s => {
          const p = ROUTINE_PRESETS[s];
          return (
            <button key={s} onClick={() => setSplit(s)}
              className={`w-full p-3 rounded-xl border text-left transition-colors ${
                split === s ? 'border-primary bg-primary/5' : 'border-border'
              }`}>
              <p className={`text-sm font-semibold ${split === s ? 'text-primary' : ''}`}>{p.name}</p>
              <p className="text-xs text-muted">{p.description}</p>
            </button>
          );
        })}
      </div>
      <Button variant="primary" fullWidth onClick={() => setStep(4)}>다음</Button>
    </div>,

    // Step 4: Time + Finish
    <div key="time" className="space-y-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold">운동 가능 시간은?</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[30, 45, 60, 90].map(m => (
          <button key={m} onClick={() => setTime(m)}
            className={`py-4 rounded-xl border text-lg font-bold transition-colors ${
              time === m ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted'
            }`}>{m}분</button>
        ))}
      </div>
      <Button variant="primary" size="lg" fullWidth onClick={handleFinish}>FitLife 시작!</Button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-surface-hover'}`} />
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  );
}
