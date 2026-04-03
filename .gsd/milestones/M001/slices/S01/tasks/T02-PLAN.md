---
estimated_steps: 5
estimated_files: 8
skills_used: []
---

# T02: 앱 셸 레이아웃 + 바텀 네비게이션

1. 모바일 퍼스트 레이아웃 컴포넌트 (max-width, safe area)
2. 바텀 네비게이션 바 (홈/워크아웃/식단/수면/프로필 5탭)
3. 헤더 컴포넌트 (앱 이름 + 날짜)
4. 각 탭 페이지 라우트 생성 (placeholder 내용)
5. 탭 전환 동작 확인

## Inputs

- `src/app/layout.tsx`

## Expected Output

- `src/components/BottomNav.tsx`
- `src/components/Header.tsx`
- `src/app/workout/page.tsx`
- `src/app/diet/page.tsx`
- `src/app/sleep/page.tsx`
- `src/app/profile/page.tsx`

## Verification

npm run build 성공 + 브라우저에서 탭 전환 동작
