---
number: 9
title: "Hooks와 가드레일 — AI 행동에 규칙을 세우다"
week: 5
weekTheme: "AI를 관리하다"
type: concept
level: "Level 4: Managed Automation"
keyMessage: "AI 에이전트가 강력해질수록 '무엇을 해도 되고, 무엇을 하면 안 되는지'를 명확히 정의해야 합니다."
deliverable: "없음"
timeStructure: "10분 개념 + 15분 데모 + 5분 Q&A"
status: upcoming
bookRef: "Ch.4.8 Hooks, Ch.5.14 보안과 거버넌스"
---

## 핵심 메시지

AI 에이전트가 강력해질수록 **"무엇을 해도 되고, 무엇을 하면 안 되는지"**를 명확히 정의해야 합니다. Hooks는 AI의 행동을 자동으로 규칙화하는 장치입니다.

## Hooks란?

Hook은 AI가 특정 행동을 할 때 자동으로 실행되는 규칙입니다. 예를 들어:
- 민감한 파일을 수정하려 할 때 → 자동 차단
- 특정 명령 실행 전 → 확인 단계 추가
- AI 출력물 생성 후 → 자동 품질 검증

## 왜 가드레일이 중요한가

"AI에게 할 수 있는 일의 경계를 정해주는 것"이 신뢰의 시작입니다. 경계 없는 자유는 사고로 이어집니다.

## 데모

- .env 파일 수정 방지 Hook
- 특정 명령 실행 전 확인 Hook
- AI 출력물에 자동으로 검증 단계 추가
