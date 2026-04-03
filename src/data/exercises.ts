import { Exercise } from '@/types/workout';

export const exercises: Exercise[] = [
  // === 가슴 ===
  { id: 'bench-press', name: '벤치프레스', nameEn: 'Bench Press', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: '바벨' },
  { id: 'incline-bench-press', name: '인클라인 벤치프레스', nameEn: 'Incline Bench Press', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: '바벨' },
  { id: 'dumbbell-fly', name: '덤벨 플라이', nameEn: 'Dumbbell Fly', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['shoulders'], equipment: '덤벨' },
  { id: 'cable-crossover', name: '케이블 크로스오버', nameEn: 'Cable Crossover', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: [], equipment: '케이블' },
  { id: 'chest-dip', name: '딥스 (가슴)', nameEn: 'Chest Dip', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: '딥스바' },
  { id: 'push-up', name: '푸쉬업', nameEn: 'Push Up', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders', 'core'], equipment: '맨몸' },
  { id: 'dumbbell-bench-press', name: '덤벨 벤치프레스', nameEn: 'Dumbbell Bench Press', type: 'strength', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], equipment: '덤벨' },

  // === 등 ===
  { id: 'deadlift', name: '데드리프트', nameEn: 'Deadlift', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes', 'core'], equipment: '바벨' },
  { id: 'pull-up', name: '풀업', nameEn: 'Pull Up', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: '풀업바' },
  { id: 'lat-pulldown', name: '랫풀다운', nameEn: 'Lat Pulldown', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: '머신' },
  { id: 'barbell-row', name: '바벨로우', nameEn: 'Barbell Row', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'core'], equipment: '바벨' },
  { id: 'seated-row', name: '시티드 로우', nameEn: 'Seated Row', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: '머신' },
  { id: 'dumbbell-row', name: '덤벨 로우', nameEn: 'Dumbbell Row', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['biceps'], equipment: '덤벨' },
  { id: 'face-pull', name: '페이스풀', nameEn: 'Face Pull', type: 'strength', primaryMuscle: 'back', secondaryMuscles: ['shoulders'], equipment: '케이블' },

  // === 어깨 ===
  { id: 'overhead-press', name: '오버헤드 프레스', nameEn: 'Overhead Press', type: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps', 'core'], equipment: '바벨' },
  { id: 'dumbbell-shoulder-press', name: '덤벨 숄더프레스', nameEn: 'Dumbbell Shoulder Press', type: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], equipment: '덤벨' },
  { id: 'lateral-raise', name: '사이드 레터럴 레이즈', nameEn: 'Lateral Raise', type: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: [], equipment: '덤벨' },
  { id: 'front-raise', name: '프론트 레이즈', nameEn: 'Front Raise', type: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: [], equipment: '덤벨' },
  { id: 'reverse-fly', name: '리버스 플라이', nameEn: 'Reverse Fly', type: 'strength', primaryMuscle: 'shoulders', secondaryMuscles: ['back'], equipment: '덤벨' },

  // === 이두 ===
  { id: 'barbell-curl', name: '바벨 컬', nameEn: 'Barbell Curl', type: 'strength', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: '바벨' },
  { id: 'dumbbell-curl', name: '덤벨 컬', nameEn: 'Dumbbell Curl', type: 'strength', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: '덤벨' },
  { id: 'hammer-curl', name: '해머 컬', nameEn: 'Hammer Curl', type: 'strength', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], equipment: '덤벨' },
  { id: 'preacher-curl', name: '프리처 컬', nameEn: 'Preacher Curl', type: 'strength', primaryMuscle: 'biceps', secondaryMuscles: [], equipment: '바벨' },

  // === 삼두 ===
  { id: 'tricep-pushdown', name: '트라이셉 푸쉬다운', nameEn: 'Tricep Pushdown', type: 'strength', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: '케이블' },
  { id: 'overhead-tricep-extension', name: '오버헤드 트라이셉 익스텐션', nameEn: 'Overhead Tricep Extension', type: 'strength', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: '덤벨' },
  { id: 'skull-crusher', name: '스컬크러셔', nameEn: 'Skull Crusher', type: 'strength', primaryMuscle: 'triceps', secondaryMuscles: [], equipment: '바벨' },
  { id: 'close-grip-bench', name: '클로즈그립 벤치프레스', nameEn: 'Close Grip Bench Press', type: 'strength', primaryMuscle: 'triceps', secondaryMuscles: ['chest'], equipment: '바벨' },

  // === 하체: 대퇴사두 ===
  { id: 'squat', name: '스쿼트', nameEn: 'Squat', type: 'strength', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings', 'core'], equipment: '바벨' },
  { id: 'front-squat', name: '프론트 스쿼트', nameEn: 'Front Squat', type: 'strength', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'core'], equipment: '바벨' },
  { id: 'leg-press', name: '레그프레스', nameEn: 'Leg Press', type: 'strength', primaryMuscle: 'quads', secondaryMuscles: ['glutes'], equipment: '머신' },
  { id: 'leg-extension', name: '레그 익스텐션', nameEn: 'Leg Extension', type: 'strength', primaryMuscle: 'quads', secondaryMuscles: [], equipment: '머신' },
  { id: 'lunge', name: '런지', nameEn: 'Lunge', type: 'strength', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], equipment: '덤벨' },
  { id: 'goblet-squat', name: '고블릿 스쿼트', nameEn: 'Goblet Squat', type: 'strength', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'core'], equipment: '케틀벨' },

  // === 하체: 햄스트링 ===
  { id: 'romanian-deadlift', name: '루마니안 데드리프트', nameEn: 'Romanian Deadlift', type: 'strength', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], equipment: '바벨' },
  { id: 'leg-curl', name: '레그컬', nameEn: 'Leg Curl', type: 'strength', primaryMuscle: 'hamstrings', secondaryMuscles: [], equipment: '머신' },

  // === 하체: 둔근 ===
  { id: 'hip-thrust', name: '힙 쓰러스트', nameEn: 'Hip Thrust', type: 'strength', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], equipment: '바벨' },
  { id: 'glute-bridge', name: '글루트 브릿지', nameEn: 'Glute Bridge', type: 'strength', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], equipment: '맨몸' },
  { id: 'cable-kickback', name: '케이블 킥백', nameEn: 'Cable Kickback', type: 'strength', primaryMuscle: 'glutes', secondaryMuscles: [], equipment: '케이블' },

  // === 하체: 종아리 ===
  { id: 'calf-raise', name: '카프레이즈', nameEn: 'Calf Raise', type: 'strength', primaryMuscle: 'calves', secondaryMuscles: [], equipment: '머신' },

  // === 코어 ===
  { id: 'plank', name: '플랭크', nameEn: 'Plank', type: 'strength', primaryMuscle: 'core', secondaryMuscles: ['shoulders'], equipment: '맨몸' },
  { id: 'ab-wheel', name: '에브롤러', nameEn: 'Ab Wheel Rollout', type: 'strength', primaryMuscle: 'core', secondaryMuscles: ['shoulders'], equipment: 'Ab Wheel' },
  { id: 'hanging-leg-raise', name: '행잉 레그 레이즈', nameEn: 'Hanging Leg Raise', type: 'strength', primaryMuscle: 'core', secondaryMuscles: [], equipment: '풀업바' },
  { id: 'cable-crunch', name: '케이블 크런치', nameEn: 'Cable Crunch', type: 'strength', primaryMuscle: 'core', secondaryMuscles: [], equipment: '케이블' },
  { id: 'russian-twist', name: '러시안 트위스트', nameEn: 'Russian Twist', type: 'strength', primaryMuscle: 'core', secondaryMuscles: [], equipment: '맨몸' },
  { id: 'side-plank', name: '사이드 플랭크', nameEn: 'Side Plank', type: 'strength', primaryMuscle: 'core', secondaryMuscles: [], equipment: '맨몸' },
  { id: 'mountain-climber', name: '마운틴 클라이머', nameEn: 'Mountain Climber', type: 'strength', primaryMuscle: 'core', secondaryMuscles: ['shoulders', 'quads'], equipment: '맨몸' },

  // === CrossFit ===
  { id: 'clean-and-jerk', name: '클린 앤 저크', nameEn: 'Clean and Jerk', type: 'crossfit', primaryMuscle: 'shoulders', secondaryMuscles: ['quads', 'back', 'core'], equipment: '바벨' },
  { id: 'snatch', name: '스내치', nameEn: 'Snatch', type: 'crossfit', primaryMuscle: 'shoulders', secondaryMuscles: ['quads', 'back', 'core'], equipment: '바벨' },
  { id: 'thruster', name: '쓰러스터', nameEn: 'Thruster', type: 'crossfit', primaryMuscle: 'quads', secondaryMuscles: ['shoulders', 'core'], equipment: '바벨' },
  { id: 'burpee', name: '버피', nameEn: 'Burpee', type: 'crossfit', primaryMuscle: 'core', secondaryMuscles: ['chest', 'quads'], equipment: '맨몸' },
  { id: 'box-jump', name: '박스 점프', nameEn: 'Box Jump', type: 'crossfit', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'calves'], equipment: '박스' },
  { id: 'wall-ball', name: '월볼', nameEn: 'Wall Ball', type: 'crossfit', primaryMuscle: 'quads', secondaryMuscles: ['shoulders', 'core'], equipment: '메디신볼' },
  { id: 'kettlebell-swing', name: '케틀벨 스윙', nameEn: 'Kettlebell Swing', type: 'crossfit', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings', 'core', 'shoulders'], equipment: '케틀벨' },
  { id: 'double-under', name: '더블 언더', nameEn: 'Double Under', type: 'crossfit', primaryMuscle: 'calves', secondaryMuscles: ['core', 'shoulders'], equipment: '줄넘기' },
];

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByMuscle(muscle: string): Exercise[] {
  return exercises.filter(
    (e) => e.primaryMuscle === muscle || e.secondaryMuscles.includes(muscle as Exercise['primaryMuscle'])
  );
}
