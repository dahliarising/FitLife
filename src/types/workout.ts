// 근육군
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

// 운동 유형
export type ExerciseType = 'strength' | 'cardio' | 'crossfit';

// 운동 정의
export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  type: ExerciseType;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: string;
}

// 개별 세트
export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number; // kg
  restSeconds: number;
  completed: boolean;
}

// 세션 내 운동 항목
export interface SessionExercise {
  exerciseId: string;
  sets: WorkoutSet[];
  notes: string;
}

// 운동 세션
export interface WorkoutSession {
  id: string;
  date: string; // ISO date string
  startTime: string; // ISO datetime
  endTime?: string;
  exercises: SessionExercise[];
  notes: string;
  completed: boolean;
}

// 주간 스케줄 정의
export interface DaySchedule {
  dayOfWeek: number; // 0=일, 1=월, ..., 6=토
  label: string;
  muscleGroups: MuscleGroup[];
  isRestDay: boolean;
}

// 근육군 한국어 맵
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: '가슴',
  back: '등',
  shoulders: '어깨',
  biceps: '이두',
  triceps: '삼두',
  forearms: '전완',
  core: '코어',
  quads: '대퇴사두',
  hamstrings: '햄스트링',
  glutes: '둔근',
  calves: '종아리',
};
