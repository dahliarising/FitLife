export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  durationDays: number;
  dailyTarget: string;
  category: 'workout' | 'meditation' | 'running' | 'habit';
}

export interface ChallengeProgress {
  challengeId: string;
  startDate: string;
  completedDays: string[]; // YYYY-MM-DD[]
}

export const CHALLENGES: Challenge[] = [
  { id: '30-plank', name: '30일 플랭크', description: '매일 플랭크 1분씩 증가', icon: '🏋️', durationDays: 30, dailyTarget: '플랭크', category: 'workout' },
  { id: '7-meditation', name: '7일 명상', description: '매일 5분 이상 명상', icon: '🧘', durationDays: 7, dailyTarget: '5분 명상', category: 'meditation' },
  { id: '30-run', name: '한 달 러닝', description: '30일간 총 100km 달성', icon: '🏃', durationDays: 30, dailyTarget: '3.3km/일', category: 'running' },
  { id: '21-water', name: '21일 물 챌린지', description: '매일 물 8잔 마시기', icon: '💧', durationDays: 21, dailyTarget: '물 8잔', category: 'habit' },
  { id: '14-stretch', name: '2주 스트레칭', description: '매일 아침 스트레칭', icon: '🤸', durationDays: 14, dailyTarget: '스트레칭', category: 'workout' },
  { id: '30-gratitude', name: '30일 감사', description: '매일 감사 명상 3분', icon: '🙏', durationDays: 30, dailyTarget: '감사 명상', category: 'meditation' },
];

const STORAGE_KEY = 'fitlife_challenges';

export function getActiveChallenges(): ChallengeProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function joinChallenge(challengeId: string): void {
  const active = getActiveChallenges();
  if (active.some(c => c.challengeId === challengeId)) return;
  active.push({ challengeId, startDate: new Date().toISOString().split('T')[0], completedDays: [] });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
}

export function completeChallengeDay(challengeId: string): void {
  const today = new Date().toISOString().split('T')[0];
  const active = getActiveChallenges();
  const challenge = active.find(c => c.challengeId === challengeId);
  if (challenge && !challenge.completedDays.includes(today)) {
    challenge.completedDays.push(today);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
  }
}

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find(c => c.id === id);
}
