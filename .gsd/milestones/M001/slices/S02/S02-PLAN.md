# S02: 운동 데이터 모델 + 세션 CRUD

**Goal:** 운동 데이터 모델 설계, 세션 CRUD(생성/조회/수정/삭제), localStorage 영속화
**Demo:** After this: 브라우저에서 운동 세션 생성 → 운동 선택 → 세트/렙/무게 입력 → 저장 → 기록 조회

## Tasks
- [x] **T01: 운동 타입, 53개 운동 DB, localStorage 스토리지, WorkoutContext 구현** — 1. 운동 데이터 타입 정의 (Exercise, WorkoutSet, WorkoutSession)
2. 운동 데이터베이스 (근력 운동 50개+, 근육군별 분류)
3. localStorage 저장/로드 유틸리티
4. React Context로 전역 상태 관리
  - Estimate: 25min
  - Files: src/types/workout.ts, src/data/exercises.ts, src/lib/storage.ts, src/contexts/WorkoutContext.tsx
  - Verify: npm run build 성공, 타입 에러 없음
- [x] **T02: 운동 세션 생성 UI — 운동 선택, 세트 로거, 저장 흐름 전체 구현** — 1. 운동 세션 생성 플로우 (근육군 선택 → 운동 선택 → 세트/렙/무게 입력)
2. 운동 선택 UI (근육군 필터 + 검색)
3. 세트 입력 UI (렙, 무게, 휴식시간)
4. 세션 저장 + 완료 처리
5. 홈 페이지에 오늘의 운동 요약 표시
  - Estimate: 40min
  - Files: src/app/workout/page.tsx, src/app/workout/new/page.tsx, src/components/workout/ExercisePicker.tsx, src/components/workout/SetLogger.tsx
  - Verify: npm run build 성공 + 브라우저에서 운동 세션 생성 흐름 동작
- [x] **T03: 세션 상세 보기 페이지 + 히스토리 링크 + 삭제 + 새로고침 영속성 확인** — 1. 운동 히스토리 리스트 (날짜별 그룹핑)
2. 세션 상세 보기 (운동별 세트/렙/무게)
3. 세션 삭제 기능
4. 새로고침 후 데이터 유지 확인
5. 운동 탭에 히스토리/새 세션 전환 통합
  - Estimate: 30min
  - Files: src/app/workout/page.tsx, src/app/workout/[id]/page.tsx, src/components/workout/SessionCard.tsx
  - Verify: npm run build 성공 + 브라우저에서 생성/조회/삭제 흐름 동작
