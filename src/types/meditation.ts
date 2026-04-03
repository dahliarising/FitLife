// 명상 카테고리
export type MeditationCategory =
  | 'stress'     // 스트레스 해소
  | 'sleep'      // 수면 유도
  | 'focus'      // 집중력
  | 'gratitude'  // 감사
  | 'breathing'  // 호흡 운동
  | 'body-scan'; // 바디스캔

// 호흡 패턴 (초 단위)
export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;   // 들숨 (초)
  hold1: number;    // 참기 (초)
  exhale: number;   // 날숨 (초)
  hold2: number;    // 참기 (초)
  cycles: number;   // 반복 횟수
}

// 앰비언트 사운드 타입
export type AmbientSound =
  | 'none'
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'wind'
  | 'white-noise';

// 명상 프리셋
export interface MeditationPreset {
  id: string;
  name: string;
  category: MeditationCategory;
  durationMinutes: number;
  description: string;
  guide: string[]; // 단계별 안내 문구
}

// 명상 세션 기록
export interface MeditationSession {
  id: string;
  date: string;        // YYYY-MM-DD
  type: 'timer' | 'breathing' | 'guided';
  durationSeconds: number;
  category?: MeditationCategory;
  breathingPatternId?: string;
  completedAt: string; // ISO datetime
}

export const CATEGORY_LABELS: Record<MeditationCategory, string> = {
  stress: '스트레스 해소',
  sleep: '수면 유도',
  focus: '집중력 향상',
  gratitude: '감사 명상',
  breathing: '호흡 운동',
  'body-scan': '바디스캔',
};

export const CATEGORY_ICONS: Record<MeditationCategory, string> = {
  stress: '🧘',
  sleep: '🌙',
  focus: '🎯',
  gratitude: '🙏',
  breathing: '💨',
  'body-scan': '🫁',
};

export const AMBIENT_LABELS: Record<AmbientSound, string> = {
  none: '없음',
  rain: '빗소리',
  ocean: '파도',
  forest: '숲',
  wind: '바람',
  'white-noise': '화이트노이즈',
};
