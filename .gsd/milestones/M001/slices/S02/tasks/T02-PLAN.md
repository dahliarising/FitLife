---
estimated_steps: 5
estimated_files: 4
skills_used: []
---

# T02: 운동 세션 생성 UI

1. 운동 세션 생성 플로우 (근육군 선택 → 운동 선택 → 세트/렙/무게 입력)
2. 운동 선택 UI (근육군 필터 + 검색)
3. 세트 입력 UI (렙, 무게, 휴식시간)
4. 세션 저장 + 완료 처리
5. 홈 페이지에 오늘의 운동 요약 표시

## Inputs

- `src/types/workout.ts`
- `src/data/exercises.ts`
- `src/contexts/WorkoutContext.tsx`

## Expected Output

- `src/app/workout/page.tsx (updated)`
- `src/app/workout/new/page.tsx`
- `src/components/workout/ExercisePicker.tsx`
- `src/components/workout/SetLogger.tsx`

## Verification

npm run build 성공 + 브라우저에서 운동 세션 생성 흐름 동작
