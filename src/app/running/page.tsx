'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { useRunning } from '@/contexts/RunningContext';
import { formatPace, formatDuration, estimateCalories } from '@/types/running';

type View = 'list' | 'active' | 'manual';

export default function RunningPage() {
  const { sessions, addSession, deleteSession, getTotalDistance, getBestPace } = useRunning();
  const [view, setView] = useState<View>('list');

  // Active run state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const watchIdRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Manual entry
  const [manualDist, setManualDist] = useState('5');
  const [manualMin, setManualMin] = useState('25');
  const [manualSec, setManualSec] = useState('0');

  // GPS tracking
  const startRun = () => {
    setIsRunning(true);
    setElapsed(0);
    setDistance(0);
    lastPosRef.current = null;

    timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);

    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (lastPosRef.current) {
            const d = haversine(lastPosRef.current.lat, lastPosRef.current.lng, latitude, longitude);
            if (d > 0.005) { // 5m 이상 이동 시만 카운트
              setDistance(prev => prev + d);
              lastPosRef.current = { lat: latitude, lng: longitude };
            }
          } else {
            lastPosRef.current = { lat: latitude, lng: longitude };
          }
        },
        undefined,
        { enableHighAccuracy: true, maximumAge: 3000 }
      );
    }
  };

  const stopRun = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);

    if (distance > 0.01 && elapsed > 10) {
      const pace = elapsed / distance;
      addSession({
        date: new Date().toISOString().split('T')[0],
        distanceKm: Math.round(distance * 100) / 100,
        durationSeconds: elapsed,
        pacePerKm: Math.round(pace),
        calories: estimateCalories(distance, elapsed),
        notes: '',
      });
    }
    setView('list');
  };

  const handleManualSave = () => {
    const dist = Number(manualDist) || 0;
    const dur = (Number(manualMin) || 0) * 60 + (Number(manualSec) || 0);
    if (dist <= 0 || dur <= 0) return;
    const pace = dur / dist;
    addSession({
      date: new Date().toISOString().split('T')[0],
      distanceKm: dist,
      durationSeconds: dur,
      pacePerKm: Math.round(pace),
      calories: estimateCalories(dist, dur),
      notes: '',
    });
    setView('list');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  const currentPace = distance > 0.01 ? elapsed / distance : 0;

  if (view === 'active') {
    return (
      <>
        <Header title="러닝 중" />
        <div className="mx-auto max-w-lg px-4 py-6 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-6xl font-bold tabular-nums text-primary">
              {(distance).toFixed(2)}
            </p>
            <p className="text-sm text-muted">km</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold tabular-nums">{formatDuration(elapsed)}</p>
              <p className="text-xs text-muted">시간</p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{currentPace > 0 ? formatPace(currentPace) : '--'}</p>
              <p className="text-xs text-muted">페이스</p>
            </div>
          </div>
          {!isRunning ? (
            <Button variant="primary" size="lg" fullWidth onClick={startRun}>
              시작
            </Button>
          ) : (
            <Button variant="danger" size="lg" fullWidth onClick={stopRun}>
              정지 & 저장
            </Button>
          )}
        </div>
      </>
    );
  }

  if (view === 'manual') {
    return (
      <>
        <Header title="수동 입력" />
        <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
          <Card>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted block mb-1">거리 (km)</label>
                <input type="number" step="0.1" value={manualDist} onChange={e => setManualDist(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted block mb-1">분</label>
                  <input type="number" value={manualMin} onChange={e => setManualMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">초</label>
                  <input type="number" value={manualSec} onChange={e => setManualSec(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setView('list')}>취소</Button>
                <Button variant="primary" fullWidth onClick={handleManualSave}>저장</Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  const totalDist = getTotalDistance();
  const bestPace = getBestPace();

  return (
    <>
      <Header title="러닝" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        {/* Stats */}
        <Card>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-2xl font-bold ${totalDist ? 'text-primary' : 'text-foreground/30'}`}>{totalDist}</p>
              <p className="text-xs text-muted">총 거리 (km)</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${sessions.length ? 'text-secondary' : 'text-foreground/30'}`}>{sessions.length}</p>
              <p className="text-xs text-muted">러닝 횟수</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${bestPace > 0 ? 'text-accent' : 'text-foreground/30'}`}>{bestPace > 0 ? formatPace(bestPace) : '0'}</p>
              <p className="text-xs text-muted">최고 페이스</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="primary" fullWidth onClick={() => setView('active')}>
            GPS 러닝 시작
          </Button>
          <Button variant="outline" fullWidth onClick={() => setView('manual')}>
            수동 입력
          </Button>
        </div>

        {/* History */}
        {sessions.length > 0 && (
          <Card padding="none">
            <div className="px-4 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-muted">러닝 기록</h3>
            </div>
            <div className="divide-y divide-border">
              {sessions.slice(0, 20).map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{s.distanceKm}km · {formatDuration(s.durationSeconds)}</p>
                    <p className="text-xs text-muted">{s.date} · {formatPace(s.pacePerKm)}/km · {s.calories}kcal</p>
                  </div>
                  <button onClick={() => deleteSession(s.id)} className="p-1 text-muted hover:text-danger transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {sessions.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-sm text-muted">첫 러닝을 기록해보세요!</p>
          </Card>
        )}
      </div>
    </>
  );
}

/** Haversine distance (km) */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
