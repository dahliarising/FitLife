'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Card, Button } from '@/components/ui';
import { useWorkout } from '@/contexts/WorkoutContext';
import { useMeditation } from '@/contexts/MeditationContext';
import { useRunning } from '@/contexts/RunningContext';
import { useDiet } from '@/contexts/DietContext';
import { getUnlockedAchievements, getLockedAchievements, ACHIEVEMENTS } from '@/lib/achievements';
import {
  CHALLENGES, getActiveChallenges, joinChallenge, completeChallengeDay, getChallengeById,
} from '@/lib/challenges';

type Tab = 'achievements' | 'challenges';

export default function AchievementsPage() {
  const { sessions } = useWorkout();
  const { sessions: medSessions, getStreak } = useMeditation();
  const { sessions: runSessions } = useRunning();
  const { meals } = useDiet();
  const [tab, setTab] = useState<Tab>('achievements');
  const [, forceUpdate] = useState(0);

  const mealDays = new Set(meals.map(m => m.date)).size;
  const data = { workouts: sessions, meditations: medSessions, runs: runSessions, mealDays, meditationStreak: getStreak() };
  const unlocked = getUnlockedAchievements(data);
  const locked = getLockedAchievements(data);
  const activeChallenges = getActiveChallenges();

  return (
    <>
      <Header title="업적 & 챌린지" />
      <div className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <div className="flex bg-surface-hover rounded-xl p-1">
          <button onClick={() => setTab('achievements')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'achievements' ? 'bg-surface text-foreground shadow-sm' : 'text-muted'}`}>
            업적 ({unlocked.length}/{ACHIEVEMENTS.length})
          </button>
          <button onClick={() => setTab('challenges')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'challenges' ? 'bg-surface text-foreground shadow-sm' : 'text-muted'}`}>
            챌린지
          </button>
        </div>

        {tab === 'achievements' && (
          <div className="space-y-3">
            {unlocked.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted mb-2">달성 완료</h3>
                <div className="grid grid-cols-3 gap-2">
                  {unlocked.map(a => (
                    <Card key={a.id} className="text-center py-4">
                      <span className="text-2xl">{a.icon}</span>
                      <p className="text-xs font-semibold mt-1">{a.name}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {locked.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted mb-2">미달성</h3>
                <div className="space-y-2">
                  {locked.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover opacity-50">
                      <span className="text-xl grayscale">{a.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'challenges' && (
          <div className="space-y-4">
            {/* Active challenges */}
            {activeChallenges.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted mb-2">참여 중</h3>
                <div className="space-y-2">
                  {activeChallenges.map(cp => {
                    const ch = getChallengeById(cp.challengeId);
                    if (!ch) return null;
                    const progress = Math.round((cp.completedDays.length / ch.durationDays) * 100);
                    const todayDone = cp.completedDays.includes(new Date().toISOString().split('T')[0]);
                    return (
                      <Card key={cp.challengeId}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{ch.icon}</span>
                            <div>
                              <p className="text-sm font-semibold">{ch.name}</p>
                              <p className="text-xs text-muted">{cp.completedDays.length}/{ch.durationDays}일</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="h-2 bg-surface-hover rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        {!todayDone && (
                          <Button variant="primary" size="sm" fullWidth onClick={() => {
                            completeChallengeDay(cp.challengeId);
                            forceUpdate(n => n + 1);
                          }}>오늘 완료!</Button>
                        )}
                        {todayDone && <p className="text-xs text-secondary text-center">오늘 완료 ✓</p>}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available challenges */}
            <div>
              <h3 className="text-sm font-semibold text-muted mb-2">참여 가능</h3>
              <div className="space-y-2">
                {CHALLENGES.filter(c => !activeChallenges.some(ac => ac.challengeId === c.id)).map(ch => (
                  <div key={ch.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{ch.icon}</span>
                      <div>
                        <p className="text-sm font-semibold">{ch.name}</p>
                        <p className="text-xs text-muted">{ch.description} · {ch.durationDays}일</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      joinChallenge(ch.id);
                      forceUpdate(n => n + 1);
                    }}>참여</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
