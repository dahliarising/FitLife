'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { useRoutine } from '@/contexts/RoutineContext';
import { useBody } from '@/contexts/BodyContext';
import { isFirebaseEnabled, signIn, backupToCloud, restoreFromCloud } from '@/lib/firebase';
import { ROUTINE_PRESETS, SPLIT_OPTIONS } from '@/data/routines';
import { MUSCLE_GROUP_LABELS } from '@/types/workout';

const TIME_OPTIONS = [30, 45, 60, 90];

export default function ProfilePage() {
  const { settings, setSplitType, setAvailableMinutes } = useRoutine();
  const { records, addRecord, getLatest, getRecent, goal, setGoal } = useBody();
  const preset = ROUTINE_PRESETS[settings.splitType];
  const latest = getLatest();
  const trend = getRecent(90);
  const maxWeight = Math.max(...trend.map(r => r.weight), 1);
  const minWeight = Math.min(...trend.map(r => r.weight), maxWeight);

  const [syncStatus, setSyncStatus] = useState<string>('');
  const [showBodyForm, setShowBodyForm] = useState(false);
  const [formWeight, setFormWeight] = useState(latest?.weight?.toString() ?? '75');
  const [formFat, setFormFat] = useState(latest?.bodyFatPercent?.toString() ?? '');
  const [formMuscle, setFormMuscle] = useState(latest?.muscleMass?.toString() ?? '');

  const handleSaveBody = () => {
    addRecord({
      date: new Date().toISOString().split('T')[0],
      weight: Number(formWeight) || 0,
      bodyFatPercent: formFat ? Number(formFat) : undefined,
      muscleMass: formMuscle ? Number(formMuscle) : undefined,
      notes: '',
    });
    setShowBodyForm(false);
  };

  return (
    <>
      <Header title="프로필" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* 프로필 카드 */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">F</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">FitLife 사용자</h2>
              <p className="text-sm text-muted">CrossFit + 10K 러너</p>
            </div>
          </div>
        </Card>

        {/* 체성분 */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted">체성분</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowBodyForm(!showBodyForm)}>
              {showBodyForm ? '닫기' : '+ 기록'}
            </Button>
          </div>

          {latest && (
            <div className="grid grid-cols-3 gap-3 text-center mb-3">
              <div>
                <p className="text-xl font-bold text-primary">{latest.weight}</p>
                <p className="text-[10px] text-muted">체중 (kg)</p>
              </div>
              <div>
                <p className="text-xl font-bold text-secondary">{latest.bodyFatPercent ?? '—'}</p>
                <p className="text-[10px] text-muted">체지방 (%)</p>
              </div>
              <div>
                <p className="text-xl font-bold text-accent">{latest.muscleMass ?? '—'}</p>
                <p className="text-[10px] text-muted">근육량 (kg)</p>
              </div>
            </div>
          )}

          {/* 체중 추이 미니 차트 */}
          {trend.length > 1 && (
            <div className="flex items-end gap-0.5 h-16 mt-2">
              {trend.map((r, i) => {
                const range = maxWeight - minWeight || 1;
                const h = ((r.weight - minWeight) / range) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-primary/20 rounded-t min-h-[2px]"
                      style={{ height: `${Math.max(8, h)}%` }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {!latest && !showBodyForm && (
            <p className="text-xs text-muted text-center py-2">체성분 기록을 시작하세요</p>
          )}
        </Card>

        {/* 체성분 입력 폼 */}
        {showBodyForm && (
          <Card>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted block mb-1">체중 (kg)</label>
                <input type="number" step="0.1" value={formWeight} onChange={e => setFormWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted block mb-1">체지방 (%)</label>
                  <input type="number" step="0.1" value={formFat} onChange={e => setFormFat(e.target.value)} placeholder="선택"
                    className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">근육량 (kg)</label>
                  <input type="number" step="0.1" value={formMuscle} onChange={e => setFormMuscle(e.target.value)} placeholder="선택"
                    className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <Button variant="primary" fullWidth onClick={handleSaveBody}>저장</Button>
            </div>
          </Card>
        )}

        {/* 분할 루틴 설정 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">운동 분할</h3>
          <div className="space-y-2">
            {SPLIT_OPTIONS.map((splitId) => {
              const p = ROUTINE_PRESETS[splitId];
              const isActive = settings.splitType === splitId;
              return (
                <button key={splitId} onClick={() => setSplitType(splitId)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? 'text-primary' : ''}`}>{p.name}</p>
                      <p className="text-xs text-muted mt-0.5">{p.description}</p>
                    </div>
                    <span className="text-xs text-muted">주 {p.daysPerWeek}회</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* 주간 스케줄 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">주간 스케줄</h3>
          <div className="space-y-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((dayLabel, dayIdx) => {
              const schedule = preset.schedule.find(d => d.dayOfWeek === dayIdx);
              if (!schedule) return null;
              return (
                <div key={dayIdx} className="flex items-center gap-3 py-1.5">
                  <span className={`w-6 text-xs font-semibold ${schedule.isRestDay ? 'text-muted' : 'text-primary'}`}>{dayLabel}</span>
                  <span className={`text-sm ${schedule.isRestDay ? 'text-muted' : ''}`}>{schedule.isRestDay ? '휴식' : schedule.label}</span>
                  {!schedule.isRestDay && <span className="text-xs text-muted ml-auto">{schedule.muscleGroups.map(mg => MUSCLE_GROUP_LABELS[mg]).join(', ')}</span>}
                </div>
              );
            })}
          </div>
        </Card>

        {/* 운동 시간 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">가용 운동 시간</h3>
          <div className="grid grid-cols-4 gap-2">
            {TIME_OPTIONS.map(min => {
              const isActive = settings.availableMinutes === min;
              return (
                <button key={min} onClick={() => setAvailableMinutes(min)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-colors ${isActive ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted hover:border-primary/30'}`}>
                  {min}분
                </button>
              );
            })}
          </div>
        </Card>

        {/* 클라우드 동기화 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">데이터 동기화</h3>
          {isFirebaseEnabled() ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button variant="primary" fullWidth onClick={async () => {
                  setSyncStatus('백업 중...');
                  const user = await signIn();
                  if (user) {
                    const ok = await backupToCloud(user.uid);
                    setSyncStatus(ok ? '백업 완료!' : '백업 실패');
                  } else { setSyncStatus('로그인 실패'); }
                }}>클라우드 백업</Button>
                <Button variant="outline" fullWidth onClick={async () => {
                  setSyncStatus('복원 중...');
                  const user = await signIn();
                  if (user) {
                    const ok = await restoreFromCloud(user.uid);
                    setSyncStatus(ok ? '복원 완료! 새로고침하세요' : '복원할 데이터 없음');
                  } else { setSyncStatus('로그인 실패'); }
                }}>복원</Button>
              </div>
              {syncStatus && <p className="text-xs text-muted text-center">{syncStatus}</p>}
            </div>
          ) : (
            <p className="text-xs text-muted">.env.local에 Firebase 설정을 추가하면 클라우드 동기화가 활성화됩니다</p>
          )}
        </Card>

        {/* 목표 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">나의 목표</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm">일일 칼로리 (운동일)</span><span className="text-sm font-semibold">2,300 kcal</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">일일 칼로리 (휴식일)</span><span className="text-sm font-semibold">1,900 kcal</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">단백질 목표</span><span className="text-sm font-semibold">150g / 일</span></div>
            <div className="flex items-center justify-between"><span className="text-sm">10K 목표 페이스</span><span className="text-sm font-semibold">40분대</span></div>
          </div>
        </Card>
      </div>
    </>
  );
}
