'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { useSleep } from '@/contexts/SleepContext';
import { useMeditation } from '@/contexts/MeditationContext';
import {
  SleepQuality,
  QUALITY_LABELS,
  QUALITY_EMOJIS,
  calculateSleepHours,
} from '@/types/sleep';
import {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  MeditationCategory,
} from '@/types/meditation';
import {
  BREATHING_PATTERNS,
  MEDITATION_PRESETS,
  DURATION_OPTIONS,
  getBreathingDuration,
} from '@/data/meditations';
import BreathingExercise from '@/components/meditation/BreathingExercise';
import MeditationTimer from '@/components/meditation/MeditationTimer';

type TabType = 'sleep' | 'meditate';
type MeditateView = 'menu' | 'breathing' | 'timer' | 'guided';

const QUALITY_OPTIONS: SleepQuality[] = [1, 2, 3, 4, 5];

export default function WellnessPage() {
  const [tab, setTab] = useState<TabType>('meditate');

  return (
    <>
      <Header title="웰니스" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Tab switcher */}
        <div className="flex bg-surface-hover rounded-xl p-1">
          <button
            onClick={() => setTab('meditate')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'meditate' ? 'bg-surface text-foreground shadow-sm' : 'text-muted'
            }`}
          >
            명상
          </button>
          <button
            onClick={() => setTab('sleep')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'sleep' ? 'bg-surface text-foreground shadow-sm' : 'text-muted'
            }`}
          >
            수면
          </button>
        </div>

        {tab === 'meditate' && <MeditateTab />}
        {tab === 'sleep' && <SleepTab />}
      </div>
    </>
  );
}

// ====== Meditate Tab ======
function MeditateTab() {
  const { addSession, getStreak, getTodayMinutes, getTotalSessions, getTotalMinutes } = useMeditation();
  const [view, setView] = useState<MeditateView>('menu');
  const [selectedBreathing, setSelectedBreathing] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const streak = getStreak();
  const todayMin = getTodayMinutes();

  const handleComplete = (type: 'timer' | 'breathing' | 'guided', durationSeconds: number, category?: MeditationCategory, patternId?: string) => {
    addSession({
      date: new Date().toISOString().split('T')[0],
      type,
      durationSeconds,
      category,
      breathingPatternId: patternId,
    });
    setView('menu');
  };

  if (view === 'breathing' && selectedBreathing) {
    const pattern = BREATHING_PATTERNS.find((p) => p.id === selectedBreathing)!;
    return (
      <BreathingExercise
        pattern={pattern}
        onComplete={(dur) => handleComplete('breathing', dur, 'breathing', pattern.id)}
        onCancel={() => setView('menu')}
      />
    );
  }

  if (view === 'guided' && selectedPreset) {
    const preset = MEDITATION_PRESETS.find((p) => p.id === selectedPreset)!;
    return (
      <MeditationTimer
        durationMinutes={preset.durationMinutes}
        guide={preset.guide}
        onComplete={(dur) => handleComplete('guided', dur, preset.category)}
        onCancel={() => setView('menu')}
      />
    );
  }

  if (view === 'timer') {
    return (
      <MeditationTimer
        durationMinutes={selectedDuration}
        onComplete={(dur) => handleComplete('timer', dur)}
        onCancel={() => setView('menu')}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <Card>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{streak}</p>
            <p className="text-xs text-muted">연속일</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">{todayMin}</p>
            <p className="text-xs text-muted">오늘 (분)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{getTotalSessions()}</p>
            <p className="text-xs text-muted">총 세션</p>
          </div>
        </div>
      </Card>

      {/* Quick timer */}
      <Card>
        <h3 className="text-sm font-semibold text-muted mb-3">자유 명상</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {DURATION_OPTIONS.map((min) => (
            <button
              key={min}
              onClick={() => setSelectedDuration(min)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedDuration === min
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-muted'
              }`}
            >
              {min}분
            </button>
          ))}
        </div>
        <Button variant="primary" fullWidth onClick={() => setView('timer')}>
          {selectedDuration}분 명상 시작
        </Button>
      </Card>

      {/* Breathing exercises */}
      <Card padding="none">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-muted">호흡 운동</h3>
        </div>
        <div className="divide-y divide-border">
          {BREATHING_PATTERNS.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => {
                setSelectedBreathing(pattern.id);
                setView('breathing');
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium">{pattern.name}</p>
                <p className="text-xs text-muted">{pattern.description}</p>
              </div>
              <span className="text-xs text-muted shrink-0 ml-2">
                {Math.round(getBreathingDuration(pattern) / 60)}분
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Guided meditations */}
      <Card padding="none">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-muted">가이드 명상</h3>
        </div>
        <div className="divide-y divide-border">
          {MEDITATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset.id);
                setView('guided');
              }}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-hover transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{CATEGORY_ICONS[preset.category]}</span>
                <div>
                  <p className="text-sm font-medium">{preset.name}</p>
                  <p className="text-xs text-muted">{preset.description}</p>
                </div>
              </div>
              <span className="text-xs text-muted shrink-0 ml-2">
                {preset.durationMinutes}분
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ====== Sleep Tab ======
function SleepTab() {
  const {
    getTodayRecord,
    getWeekRecords,
    getAverageSleep,
    addRecord,
    deleteRecord,
  } = useSleep();

  const todayRecord = getTodayRecord();
  const weekRecords = getWeekRecords();
  const avgSleep = getAverageSleep(7);

  const [showForm, setShowForm] = useState(false);
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState<SleepQuality>(4);

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    addRecord({ date: today, bedTime, wakeTime, quality, notes: '' });
    setShowForm(false);
  };

  const sleepHoursToday = todayRecord
    ? calculateSleepHours(todayRecord.bedTime, todayRecord.wakeTime)
    : 0;

  return (
    <div className="space-y-4">
      {/* 오늘의 수면 */}
      <Card>
        <h2 className="text-sm font-semibold text-muted mb-3">오늘의 수면</h2>
        {todayRecord ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{QUALITY_EMOJIS[todayRecord.quality]}</span>
              <div>
                <p className="text-2xl font-bold text-primary">{sleepHoursToday}시간</p>
                <p className="text-xs text-muted">{todayRecord.bedTime} → {todayRecord.wakeTime}</p>
              </div>
            </div>
            <button
              onClick={() => deleteRecord(todayRecord.id)}
              className="text-xs text-muted hover:text-danger transition-colors"
            >
              삭제
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            {!showForm && (
              <>
                <p className="text-sm text-muted mb-3">수면 기록이 없습니다</p>
                <Button variant="primary" onClick={() => setShowForm(true)}>수면 기록하기</Button>
              </>
            )}
          </div>
        )}
      </Card>

      {/* 수면 입력 폼 */}
      {showForm && (
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">수면 기록</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1">취침</label>
                <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">기상</label>
                <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-primary">{calculateSleepHours(bedTime, wakeTime)}시간</p>
            </div>
            <div>
              <label className="text-xs text-muted block mb-2">수면 품질</label>
              <div className="flex justify-between">
                {QUALITY_OPTIONS.map((q) => (
                  <button key={q} onClick={() => setQuality(q)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                      quality === q ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-surface-hover'
                    }`}>
                    <span className="text-xl">{QUALITY_EMOJIS[q]}</span>
                    <span className="text-[10px] text-muted">{QUALITY_LABELS[q]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setShowForm(false)}>취소</Button>
              <Button variant="primary" fullWidth onClick={handleSave}>저장</Button>
            </div>
          </div>
        </Card>
      )}

      {/* 주간 수면 패턴 */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted">주간 수면 패턴</h3>
          <span className="text-xs text-muted">평균 {avgSleep}시간</span>
        </div>
        {weekRecords.length > 0 ? (
          <div className="flex items-end gap-1 h-24">
            {weekRecords.map((record) => {
              const hours = calculateSleepHours(record.bedTime, record.wakeTime);
              const height = Math.min(100, (hours / 10) * 100);
              const dateObj = new Date(record.date + 'T00:00:00');
              const dayLabel = dateObj.toLocaleDateString('ko-KR', { weekday: 'narrow' });
              return (
                <div key={record.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted">{hours}h</span>
                  <div className="w-full flex flex-col justify-end h-16">
                    <div className={`w-full rounded-t transition-all ${
                      record.quality >= 4 ? 'bg-secondary/30' : record.quality >= 3 ? 'bg-accent/30' : 'bg-danger/30'
                    }`} style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-[9px] text-muted">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted text-center py-4">기록이 쌓이면 패턴이 표시됩니다</p>
        )}
      </Card>
    </div>
  );
}
