# S03: 분할 운동 추천 + Progressive Overload

**Goal:** 주간 운동 스케줄(R012) 표시 + 이전 세션 기반 progressive overload 추천(R004)
**Demo:** After this: 오늘 요일에 맞는 운동 추천(2/3/5분할), 가용 시간별 운동 구성, 이전 기록 기반 무게/렙 추천

## Tasks
- [x] T01: 분할 루틴 프리셋 데이터 (src/data/routines.ts) — 2/3/5분할 + 헬퍼 함수
- [x] T02: RoutineContext (src/contexts/RoutineContext.tsx) — splitType + availableMinutes 상태관리, localStorage 영속화
- [x] T03: Progressive Overload 로직 (src/lib/progressive-overload.ts) — Double Progression 알고리즘
- [x] T04: TodayRoutine 컴포넌트 (src/components/workout/TodayRoutine.tsx) — compact/full 모드
- [x] T05: 프로필 루틴 설정 UI (src/app/profile/page.tsx) — 분할 선택, 시간 설정, 주간 스케줄 미리보기
- [x] T06: 홈페이지 실제 데이터 연동 (src/app/page.tsx) — 오늘 요약, 주간 완료 상태, 추천 루틴
- [x] T07: NewWorkoutPage 추천 모드 (?recommended=true) — 자동 운동 구성 + progressive overload 기본값

## Files Changed
- `src/data/routines.ts` — NEW
- `src/contexts/RoutineContext.tsx` — NEW
- `src/lib/progressive-overload.ts` — NEW
- `src/components/workout/TodayRoutine.tsx` — NEW
- `src/app/layout.tsx` — RoutineProvider 추가
- `src/app/page.tsx` — 실제 데이터 연동으로 전면 개편
- `src/app/profile/page.tsx` — 분할 설정 UI 추가
- `src/app/workout/new/page.tsx` — 추천 기반 자동 구성 + Suspense
- `src/components/workout/SetLogger.tsx` — 이전 기록 힌트 개선
