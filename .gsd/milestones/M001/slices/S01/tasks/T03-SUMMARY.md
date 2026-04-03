---
id: T03
parent: S01
milestone: M001
provides: []
requires: []
affects: []
key_files: ["src/components/ui/Button.tsx", "src/components/ui/Card.tsx", "src/components/ui/index.ts"]
key_decisions: ["Button: variant(primary/secondary/outline/ghost/danger) + size(sm/md/lg)", "Card: padding prop(none/sm/md/lg), 기본 디자인 통일", "barrel export via ui/index.ts"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build 성공"
completed_at: 2026-04-02T23:12:18.686Z
blocker_discovered: false
---

# T03: Button/Card UI 컴포넌트 추출 + 홈 페이지 리팩토링

> Button/Card UI 컴포넌트 추출 + 홈 페이지 리팩토링

## What Happened
---
id: T03
parent: S01
milestone: M001
key_files:
  - src/components/ui/Button.tsx
  - src/components/ui/Card.tsx
  - src/components/ui/index.ts
key_decisions:
  - Button: variant(primary/secondary/outline/ghost/danger) + size(sm/md/lg)
  - Card: padding prop(none/sm/md/lg), 기본 디자인 통일
  - barrel export via ui/index.ts
duration: ""
verification_result: passed
completed_at: 2026-04-02T23:12:18.686Z
blocker_discovered: false
---

# T03: Button/Card UI 컴포넌트 추출 + 홈 페이지 리팩토링

**Button/Card UI 컴포넌트 추출 + 홈 페이지 리팩토링**

## What Happened

Button과 Card 재사용 컴포넌트를 추출하고, 홈 페이지를 Card 컴포넌트로 리팩토링했다. Button은 5가지 variant와 3가지 size를 지원. barrel export로 import를 깔끔하게.

## Verification

npm run build 성공

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 6000ms |


## Deviations

CSS 변수 테마는 T02에서 이미 구현됨. T03에서는 Button/Card 컴포넌트 추출과 홈 페이지 리팩토링에 집중.

## Known Issues

None.

## Files Created/Modified

- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/index.ts`


## Deviations
CSS 변수 테마는 T02에서 이미 구현됨. T03에서는 Button/Card 컴포넌트 추출과 홈 페이지 리팩토링에 집중.

## Known Issues
None.
