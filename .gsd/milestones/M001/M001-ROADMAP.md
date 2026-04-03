# M001: 워크아웃 트래커 MVP ✅

## Vision
Next.js Web 앱 기초를 세우고, 첫 핵심 기능인 워크아웃 트래커(근력 운동 로깅 + progressive overload)를 동작하는 MVP로 만든다. 식단, 러닝, 수면은 후속 마일스톤으로.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Next.js 프로젝트 기초 + 앱 셸 | low | — | ✅ | 브라우저에서 앱 셸(네비게이션, 레이아웃)이 렌더링되고 빌드 성공 |
| S02 | 운동 데이터 모델 + 세션 CRUD | medium | S01 | ✅ | 브라우저에서 운동 세션 생성 → 운동 선택 → 세트/렙/무게 입력 → 저장 → 기록 조회 |
| S03 | 분할 운동 추천 + Progressive Overload | medium | S02 | ✅ | 오늘 요일에 맞는 운동 추천(2/3/5분할), 가용 시간별 운동 구성, 이전 기록 기반 무게/렙 추천 |
