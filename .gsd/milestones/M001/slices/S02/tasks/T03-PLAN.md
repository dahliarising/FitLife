---
estimated_steps: 5
estimated_files: 3
skills_used: []
---

# T03: 히스토리 조회 + 삭제

1. 운동 히스토리 리스트 (날짜별 그룹핑)
2. 세션 상세 보기 (운동별 세트/렙/무게)
3. 세션 삭제 기능
4. 새로고침 후 데이터 유지 확인
5. 운동 탭에 히스토리/새 세션 전환 통합

## Inputs

- `src/contexts/WorkoutContext.tsx`
- `src/components/workout/ExercisePicker.tsx`

## Expected Output

- `src/app/workout/page.tsx (updated)`
- `src/app/workout/[id]/page.tsx`
- `src/components/workout/SessionCard.tsx`

## Verification

npm run build 성공 + 브라우저에서 생성/조회/삭제 흐름 동작
