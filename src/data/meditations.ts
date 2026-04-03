import { BreathingPattern, MeditationPreset } from '@/types/meditation';

// === 호흡 패턴 ===
export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: '4-7-8',
    name: '4-7-8 호흡',
    description: '수면 유도에 효과적. 부교감신경 활성화',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    cycles: 4,
  },
  {
    id: 'box',
    name: '박스 브리딩',
    description: '네이비 씰이 사용하는 스트레스 관리법',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 6,
  },
  {
    id: 'calm',
    name: '차분한 호흡',
    description: '초보자에게 적합한 기본 호흡법',
    inhale: 4,
    hold1: 2,
    exhale: 6,
    hold2: 0,
    cycles: 8,
  },
  {
    id: 'energize',
    name: '활력 호흡',
    description: '에너지 충전. 아침에 추천',
    inhale: 3,
    hold1: 0,
    exhale: 3,
    hold2: 0,
    cycles: 10,
  },
];

// === 명상 프리셋 ===
export const MEDITATION_PRESETS: MeditationPreset[] = [
  {
    id: 'quick-calm',
    name: '1분 차분하기',
    category: 'stress',
    durationMinutes: 1,
    description: '바쁜 하루 중 빠른 리셋',
    guide: [
      '편안한 자세를 잡으세요',
      '눈을 감고 깊게 숨을 들이쉬세요',
      '몸의 긴장을 하나씩 풀어보세요',
      '이 순간에만 집중하세요',
    ],
  },
  {
    id: 'morning-focus',
    name: '아침 집중',
    category: 'focus',
    durationMinutes: 5,
    description: '하루를 명확하게 시작하기',
    guide: [
      '편안하게 앉아 눈을 감으세요',
      '호흡에 집중하세요',
      '오늘 달성하고 싶은 것을 떠올리세요',
      '그 목표에 대한 의지를 느끼세요',
      '천천히 눈을 뜨고 하루를 시작하세요',
    ],
  },
  {
    id: 'stress-relief',
    name: '스트레스 해소',
    category: 'stress',
    durationMinutes: 10,
    description: '긴장과 불안을 내려놓기',
    guide: [
      '편안한 자세를 잡으세요',
      '깊은 호흡을 3번 하세요',
      '머리부터 발끝까지 긴장을 찾아보세요',
      '각 부위의 긴장을 숨과 함께 내보내세요',
      '평온한 장소를 상상해보세요',
      '그 평온함을 온몸으로 느끼세요',
    ],
  },
  {
    id: 'sleep-prep',
    name: '수면 준비',
    category: 'sleep',
    durationMinutes: 15,
    description: '깊은 잠을 위한 이완',
    guide: [
      '편안하게 누워 눈을 감으세요',
      '오늘 하루에 감사한 3가지를 떠올리세요',
      '발끝부터 시작해 몸 전체를 이완하세요',
      '호흡이 점점 느려지는 것을 느끼세요',
      '구름 위에 떠있다고 상상해보세요',
      '모든 생각을 구름처럼 흘려보내세요',
    ],
  },
  {
    id: 'gratitude',
    name: '감사 명상',
    category: 'gratitude',
    durationMinutes: 5,
    description: '감사함으로 마음 채우기',
    guide: [
      '눈을 감고 마음을 열어보세요',
      '오늘 감사한 사람을 떠올리세요',
      '그 감사함을 가슴에서 느끼세요',
      '감사한 순간 3가지를 떠올리세요',
      '그 따뜻함을 간직하며 마무리하세요',
    ],
  },
  {
    id: 'body-scan-10',
    name: '바디스캔',
    category: 'body-scan',
    durationMinutes: 10,
    description: '몸 구석구석 알아차리기',
    guide: [
      '편안하게 누워 눈을 감으세요',
      '발끝에 주의를 기울이세요',
      '종아리, 무릎, 허벅지로 올라가세요',
      '복부와 가슴의 움직임을 느끼세요',
      '어깨, 팔, 손끝까지 관찰하세요',
      '목, 턱, 얼굴의 긴장을 풀어주세요',
      '전체 몸을 하나로 느끼세요',
    ],
  },
];

export const DURATION_OPTIONS = [1, 3, 5, 10, 15, 20, 30];

export function getBreathingPatternById(id: string): BreathingPattern | undefined {
  return BREATHING_PATTERNS.find((p) => p.id === id);
}

export function getPresetById(id: string): MeditationPreset | undefined {
  return MEDITATION_PRESETS.find((p) => p.id === id);
}

/** 호흡 패턴의 총 소요 시간 (초) */
export function getBreathingDuration(pattern: BreathingPattern): number {
  const cycleTime = pattern.inhale + pattern.hold1 + pattern.exhale + pattern.hold2;
  return cycleTime * pattern.cycles;
}
