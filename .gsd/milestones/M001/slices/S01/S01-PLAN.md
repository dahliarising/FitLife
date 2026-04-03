# S01: Next.js 프로젝트 기초 + 앱 셸

**Goal:** Next.js + Tailwind 프로젝트 생성, 모바일 퍼스트 앱 셸(바텀 네비, 헤더, 페이지 라우팅) 구현
**Demo:** After this: 브라우저에서 앱 셸(네비게이션, 레이아웃)이 렌더링되고 빌드 성공

## Tasks
- [x] **T01: Next.js 16 + Tailwind 4 + TypeScript 프로젝트 생성 및 빌드 성공** — 1. create-next-app으로 Next.js 프로젝트 생성 (App Router, TypeScript, Tailwind, ESLint)
2. 불필요한 보일러플레이트 정리
3. npm run build + npm run dev 성공 확인
  - Estimate: 15min
  - Files: package.json, tsconfig.json, tailwind.config.ts, next.config.ts, src/app/layout.tsx, src/app/page.tsx, src/app/globals.css
  - Verify: npm run build 성공
- [x] **T02: 앱 셸 완성 — 5탭 바텀 네비, 헤더, 5개 페이지 라우트, 모바일 퍼스트 레이아웃** — 1. 모바일 퍼스트 레이아웃 컴포넌트 (max-width, safe area)
2. 바텀 네비게이션 바 (홈/워크아웃/식단/수면/프로필 5탭)
3. 헤더 컴포넌트 (앱 이름 + 날짜)
4. 각 탭 페이지 라우트 생성 (placeholder 내용)
5. 탭 전환 동작 확인
  - Estimate: 30min
  - Files: src/components/BottomNav.tsx, src/components/Header.tsx, src/app/layout.tsx, src/app/page.tsx, src/app/workout/page.tsx, src/app/diet/page.tsx, src/app/sleep/page.tsx, src/app/profile/page.tsx
  - Verify: npm run build 성공 + 브라우저에서 탭 전환 동작
- [x] **T03: Button/Card UI 컴포넌트 추출 + 홈 페이지 리팩토링** — 1. 색상 팔레트 정의 (primary, secondary, accent, neutral)
2. Tailwind 커스텀 설정 (colors, spacing, fonts)
3. 공통 유틸리티 컴포넌트 (Card, Button)
4. 다크/라이트 모드 기초 (시스템 설정 따르기)
5. 전체 레이아웃에 테마 적용
  - Estimate: 20min
  - Files: tailwind.config.ts, src/app/globals.css, src/components/ui/Card.tsx, src/components/ui/Button.tsx
  - Verify: npm run build 성공 + 디자인 토큰 적용 확인
