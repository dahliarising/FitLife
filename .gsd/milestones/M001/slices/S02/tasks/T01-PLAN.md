---
estimated_steps: 4
estimated_files: 4
skills_used: []
---

# T01: 데이터 모델 + 운동 DB + 상태 관리

1. 운동 데이터 타입 정의 (Exercise, WorkoutSet, WorkoutSession)
2. 운동 데이터베이스 (근력 운동 50개+, 근육군별 분류)
3. localStorage 저장/로드 유틸리티
4. React Context로 전역 상태 관리

## Inputs

- None specified.

## Expected Output

- `src/types/workout.ts`
- `src/data/exercises.ts`
- `src/lib/storage.ts`
- `src/contexts/WorkoutContext.tsx`

## Verification

npm run build 성공, 타입 에러 없음
