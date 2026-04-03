'use client';

import Header from '@/components/Header';
import { Card } from '@/components/ui';
import { useRoutine } from '@/contexts/RoutineContext';
import { ROUTINE_PRESETS, SPLIT_OPTIONS, SplitType } from '@/data/routines';
import { MUSCLE_GROUP_LABELS } from '@/types/workout';

const TIME_OPTIONS = [30, 45, 60, 90];

export default function ProfilePage() {
  const { settings, setSplitType, setAvailableMinutes } = useRoutine();
  const preset = ROUTINE_PRESETS[settings.splitType];

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

        {/* 분할 루틴 설정 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">운동 분할</h3>
          <div className="space-y-2">
            {SPLIT_OPTIONS.map((splitId) => {
              const p = ROUTINE_PRESETS[splitId];
              const isActive = settings.splitType === splitId;
              return (
                <button
                  key={splitId}
                  onClick={() => setSplitType(splitId)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${isActive ? 'text-primary' : ''}`}>
                        {p.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{p.description}</p>
                    </div>
                    <span className="text-xs text-muted">주 {p.daysPerWeek}회</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* 주간 스케줄 미리보기 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">주간 스케줄</h3>
          <div className="space-y-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((dayLabel, dayIdx) => {
              const schedule = preset.schedule.find((d) => d.dayOfWeek === dayIdx);
              if (!schedule) return null;
              return (
                <div key={dayIdx} className="flex items-center gap-3 py-1.5">
                  <span className={`w-6 text-xs font-semibold ${
                    schedule.isRestDay ? 'text-muted' : 'text-primary'
                  }`}>
                    {dayLabel}
                  </span>
                  <span className={`text-sm ${schedule.isRestDay ? 'text-muted' : ''}`}>
                    {schedule.isRestDay
                      ? '휴식'
                      : schedule.label}
                  </span>
                  {!schedule.isRestDay && (
                    <span className="text-xs text-muted ml-auto">
                      {schedule.muscleGroups.map((mg) => MUSCLE_GROUP_LABELS[mg]).join(', ')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* 운동 시간 설정 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">가용 운동 시간</h3>
          <div className="grid grid-cols-4 gap-2">
            {TIME_OPTIONS.map((min) => {
              const isActive = settings.availableMinutes === min;
              return (
                <button
                  key={min}
                  onClick={() => setAvailableMinutes(min)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted hover:border-primary/30'
                  }`}
                >
                  {min}분
                </button>
              );
            })}
          </div>
        </Card>

        {/* 목표 */}
        <Card>
          <h3 className="text-sm font-semibold text-muted mb-3">나의 목표</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">일일 칼로리 (운동일)</span>
              <span className="text-sm font-semibold">2,300 kcal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">일일 칼로리 (휴식일)</span>
              <span className="text-sm font-semibold">1,900 kcal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">단백질 목표</span>
              <span className="text-sm font-semibold">150g / 일</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">10K 목표 페이스</span>
              <span className="text-sm font-semibold">40분대</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
