import { DaySchedule, MuscleGroup } from '@/types/workout';

// 분할 타입
export type SplitType = '2split' | '3split' | '5split';

export interface RoutinePreset {
  id: SplitType;
  name: string;
  description: string;
  daysPerWeek: number;
  schedule: DaySchedule[];
}

// 2분할: 상체/하체 (주 4회)
const TWO_SPLIT: RoutinePreset = {
  id: '2split',
  name: '2분할 (상/하체)',
  description: '초보~중급. 주 4회, 상체와 하체를 번갈아 훈련',
  daysPerWeek: 4,
  schedule: [
    { dayOfWeek: 1, label: '상체 A', muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'], isRestDay: false },
    { dayOfWeek: 2, label: '하체 A', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], isRestDay: false },
    { dayOfWeek: 3, label: '휴식', muscleGroups: [], isRestDay: true },
    { dayOfWeek: 4, label: '상체 B', muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'], isRestDay: false },
    { dayOfWeek: 5, label: '하체 B', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], isRestDay: false },
    { dayOfWeek: 6, label: '휴식', muscleGroups: [], isRestDay: true },
    { dayOfWeek: 0, label: '휴식', muscleGroups: [], isRestDay: true },
  ],
};

// 3분할: 밀/풀/하체 (주 6회 또는 주 3회)
const THREE_SPLIT: RoutinePreset = {
  id: '3split',
  name: '3분할 (밀/풀/하체)',
  description: '중급. Push-Pull-Legs, 주 3~6회',
  daysPerWeek: 6,
  schedule: [
    { dayOfWeek: 1, label: '밀 (Push)', muscleGroups: ['chest', 'shoulders', 'triceps'], isRestDay: false },
    { dayOfWeek: 2, label: '풀 (Pull)', muscleGroups: ['back', 'biceps', 'forearms'], isRestDay: false },
    { dayOfWeek: 3, label: '하체 (Legs)', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], isRestDay: false },
    { dayOfWeek: 4, label: '밀 (Push)', muscleGroups: ['chest', 'shoulders', 'triceps'], isRestDay: false },
    { dayOfWeek: 5, label: '풀 (Pull)', muscleGroups: ['back', 'biceps', 'forearms'], isRestDay: false },
    { dayOfWeek: 6, label: '하체 (Legs)', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], isRestDay: false },
    { dayOfWeek: 0, label: '휴식', muscleGroups: [], isRestDay: true },
  ],
};

// 5분할: 부위별 (주 5회)
const FIVE_SPLIT: RoutinePreset = {
  id: '5split',
  name: '5분할 (부위별)',
  description: '고급. 부위별 집중 훈련, 주 5회',
  daysPerWeek: 5,
  schedule: [
    { dayOfWeek: 1, label: '가슴', muscleGroups: ['chest'], isRestDay: false },
    { dayOfWeek: 2, label: '등', muscleGroups: ['back'], isRestDay: false },
    { dayOfWeek: 3, label: '어깨', muscleGroups: ['shoulders'], isRestDay: false },
    { dayOfWeek: 4, label: '팔', muscleGroups: ['biceps', 'triceps', 'forearms'], isRestDay: false },
    { dayOfWeek: 5, label: '하체', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'core'], isRestDay: false },
    { dayOfWeek: 6, label: '휴식', muscleGroups: [], isRestDay: true },
    { dayOfWeek: 0, label: '휴식', muscleGroups: [], isRestDay: true },
  ],
};

export const ROUTINE_PRESETS: Record<SplitType, RoutinePreset> = {
  '2split': TWO_SPLIT,
  '3split': THREE_SPLIT,
  '5split': FIVE_SPLIT,
};

export const SPLIT_OPTIONS: SplitType[] = ['2split', '3split', '5split'];

/** 오늘 요일에 해당하는 DaySchedule 반환 */
export function getTodaySchedule(preset: RoutinePreset): DaySchedule {
  const today = new Date().getDay(); // 0=일, 1=월, ...
  return preset.schedule.find((d) => d.dayOfWeek === today) ?? preset.schedule[0];
}

/** 특정 근육군에 대한 추천 운동 수 (시간 기반) */
export function getExerciseCountByTime(availableMinutes: number): number {
  if (availableMinutes <= 30) return 3;
  if (availableMinutes <= 45) return 4;
  if (availableMinutes <= 60) return 5;
  return 6;
}

/** 근육군에서 추천 운동 선택 (primary 기준, 컴파운드 우선) */
export function getRecommendedExerciseIds(
  muscleGroups: MuscleGroup[],
  allExercises: { id: string; primaryMuscle: MuscleGroup; type: string }[],
  count: number,
): string[] {
  const candidates = allExercises.filter(
    (e) => muscleGroups.includes(e.primaryMuscle) && e.type === 'strength',
  );

  // 근육군별 최소 1개씩 보장 후, 나머지 채우기
  const picked: string[] = [];
  for (const mg of muscleGroups) {
    const forGroup = candidates.filter((e) => e.primaryMuscle === mg && !picked.includes(e.id));
    if (forGroup.length > 0) {
      picked.push(forGroup[0].id);
    }
    if (picked.length >= count) break;
  }

  // 부족하면 남은 후보에서 추가
  for (const c of candidates) {
    if (picked.length >= count) break;
    if (!picked.includes(c.id)) {
      picked.push(c.id);
    }
  }

  return picked.slice(0, count);
}
