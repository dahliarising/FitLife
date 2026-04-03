---
id: S01
parent: M001
milestone: M001
provides:
  - 앱 셸 레이아웃 (BottomNav, Header)
  - 페이지 라우팅 구조
  - UI 컴포넌트 (Button, Card)
  - CSS 변수 테마
requires:
  []
affects:
  - S02
  - S03
key_files:
  - src/app/layout.tsx
  - src/components/BottomNav.tsx
  - src/components/Header.tsx
  - src/components/ui/Button.tsx
  - src/components/ui/Card.tsx
key_decisions:
  - Next.js 16.2.2 + Tailwind 4 + App Router
  - CSS 변수 기반 테마 (light/dark auto)
  - 5탭 바텀 네비: 홈/운동/식단/수면/프로필
  - 모바일 퍼스트 max-w-lg 컨테이너
patterns_established:
  - App Router 페이지 패턴: Header + max-w-lg 컨테이너
  - UI 컴포넌트 패턴: src/components/ui/ barrel export
  - CSS 변수 테마 패턴: globals.css :root 변수
observability_surfaces:
  - npm run build 성공 확인
drill_down_paths:
  - .gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-02T23:13:02.537Z
blocker_discovered: false
---

# S01: Next.js 프로젝트 기초 + 앱 셸

**Next.js 앱 셸 완성 — 5탭 네비, 5개 라우트, 디자인 시스템 기초**

## What Happened

Next.js 16 + Tailwind 4 프로젝트를 세우고, 모바일 퍼스트 앱 셸을 구현했다. 5탭 바텀 네비게이션, 헤더, 5개 페이지 라우트, CSS 변수 기반 light/dark 테마, Button/Card 재사용 컴포넌트. 데스크톱과 모바일 뷰 모두 검증 완료.

## Verification

npm run build 성공, 브라우저에서 탭 전환 동작, 모바일 뷰 레이아웃 확인

## Requirements Advanced

- R002 — Next.js 16 + TypeScript + Tailwind 프로젝트 생성 및 빌드 성공

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `package.json` — Next.js 프로젝트 설정
- `src/app/globals.css` — Tailwind 4 CSS 변수 테마
- `src/app/layout.tsx` — 앱 레이아웃 (메타데이터, 뷰포트, 바텀네비)
- `src/app/page.tsx` — 홈 페이지
- `src/app/workout/page.tsx` — 운동 페이지 placeholder
- `src/app/diet/page.tsx` — 식단 페이지 placeholder
- `src/app/sleep/page.tsx` — 수면 페이지 placeholder
- `src/app/profile/page.tsx` — 프로필 페이지
- `src/components/BottomNav.tsx` — 바텀 네비게이션 5탭
- `src/components/Header.tsx` — 헤더 컴포넌트
- `src/components/ui/Button.tsx` — Button 컴포넌트
- `src/components/ui/Card.tsx` — Card 컴포넌트
- `src/components/ui/index.ts` — UI barrel export
