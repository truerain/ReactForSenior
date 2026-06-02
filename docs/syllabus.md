# 강의 계획

## 형식

- 대상: 시니어 개발자
- 권장 기간: 10개 Phase
- 회차: 주 1회, 회당 2.5~3시간
- 구성: 개념 강의 40%, 코드 읽기 20%, 실습 30%, 설계 토론 10%
- 기본 언어: Modern JavaScript + TypeScript

## 사전 준비

본 강의에 들어가기 전에 [학습 준비 문서](./setup.md)를 따라 VS Code, Node.js, pnpm 또는 npm, Git, Vite 기반 React 실습 프로젝트를 준비합니다.

사전 준비 산출물:

- VS Code에서 열린 실습 프로젝트
- `pnpm dev` 또는 `npm run dev`로 실행되는 React + TypeScript 앱
- 브라우저 개발자 도구와 React Developer Tools 확인

## Phase별 구성

| Phase | 주제 | 핵심 질문 | 교재 | 실습 |
| --- | --- | --- | --- | --- |
| 0 | Learning Environment Setup | React 학습을 위한 개발 환경을 스스로 만들 수 있는가? | [학습 준비](./setup.md) | Vite React + TypeScript 프로젝트 생성 |
| 1 | Modern JavaScript Foundation | ES5 스타일 코드와 현대 JavaScript는 무엇이 다른가? | [Modern JavaScript Foundation](./lessons/01-modern-javascript-foundation.md) | [ES5 코드 현대화](./exercises/01-modern-javascript-foundation.md) |
| 2 | TypeScript Foundation | 타입은 문서인가, 컴파일러가 검사하는 계약인가? | [TypeScript Foundation](./lessons/02-typescript-foundation.md) | [주문 도메인 타입 정의](./exercises/02-typescript-foundation.md) |
| 3 | React 사고 모델 | React는 언제, 왜 다시 렌더링하는가? | [React 사고 모델](./lessons/03-react-mental-model.md) | [주문 관리 미니 React 앱](./exercises/03-react-mental-model.md) |
| 4 | State and Effects | 어떤 상태를 어디에 두고, effect는 언제 써야 하는가? | [State and Effects](./lessons/04-state-and-effects.md) | [주문 관리 앱에 State와 Effects 적용하기](./exercises/04-state-and-effects.md) |
| 5 | Component Architecture | 오래 유지되는 컴포넌트 구조는 무엇이 다른가? | 작성 예정 | 작성 예정 |
| 6 | Data Fetching and Async UI | 서버 상태는 클라이언트 상태와 어떻게 다른가? | 작성 예정 | 작성 예정 |
| 7 | Performance and Concurrency | 최적화는 측정 가능한 문제를 해결하고 있는가? | 작성 예정 | 작성 예정 |
| 8 | Testing and Quality | 사용자의 신뢰를 테스트로 어떻게 보장할 것인가? | 작성 예정 | 작성 예정 |
| 9 | Production Architecture | 팀 규모에서 React 구조는 어떻게 진화해야 하는가? | 작성 예정 | 작성 예정 |

## 평가 기준

- 코드가 현대 JavaScript의 스코프, 참조, 비동기 모델을 올바르게 사용하는가
- 타입이 도메인 모델, 함수 계약, 컴포넌트 props를 명확히 설명하는가
- 코드가 React 렌더링 모델과 충돌하지 않는가
- state와 effect의 책임이 명확한가
- 컴포넌트 API가 변경에 견딜 수 있는가
- 성능 개선이 측정에 기반하는가
- 테스트가 구현 세부사항보다 사용자 행동을 검증하는가
- 팀 내 합의 가능한 설계 문서로 설명 가능한가

## 사전 지식

- ES5 JavaScript 경험
- 브라우저 개발자 도구 기본 사용 경험
- 터미널에서 명령을 실행해본 경험
- TypeScript는 강의 중 필요한 범위에서 함께 도입
