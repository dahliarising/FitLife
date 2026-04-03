export interface Habit {
  id: string;
  name: string;
  icon: string;
  targetPerDay: number; // 하루 목표 횟수
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  habitId: string;
  count: number;
}

export const DEFAULT_HABITS: Habit[] = [
  { id: 'water', name: '물 마시기', icon: '💧', targetPerDay: 8 },
  { id: 'stretch', name: '스트레칭', icon: '🧘', targetPerDay: 1 },
  { id: 'supplement', name: '보충제', icon: '💊', targetPerDay: 1 },
  { id: 'posture', name: '자세 교정', icon: '🪑', targetPerDay: 3 },
  { id: 'walk', name: '10분 걷기', icon: '🚶', targetPerDay: 1 },
];
