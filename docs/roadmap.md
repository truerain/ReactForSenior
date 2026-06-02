# React for Senior Developers Roadmap

## Phase 0. Learning Environment Setup

React와 TypeScript를 학습하기 전에 VS Code 기반의 실습 환경을 준비합니다.

- VS Code 설치와 기본 사용
- Node.js LTS 설치
- npm 또는 pnpm 확인
- Git 설치와 기본 설정
- Vite로 React + TypeScript 프로젝트 생성
- 브라우저 개발자 도구와 React Developer Tools 설치

산출물:

- 로컬에서 실행되는 React + TypeScript 실습 프로젝트
- VS Code에서 터미널과 소스 편집이 가능한 환경

## Phase 1. Modern JavaScript Foundation

넥사크로, jQuery, ES5 스타일 코드에 익숙한 개발자가 React에 들어가기 전에 반드시 알아야 할 현대 JavaScript 기반을 정리합니다.

- `var`에서 `let`, `const`로 전환할 때 달라지는 스코프와 재할당 모델
- function declaration, function expression, arrow function의 차이
- object/array destructuring, spread/rest syntax
- template literal, optional chaining, nullish coalescing
- array method: `map`, `filter`, `reduce`, `find`, `some`, `every`
- module system: `import`, `export`
- Promise, async/await, fetch 기반 비동기 처리
- immutable update와 참조 동일성
- npm, package.json, bundler, dev server의 역할

산출물:

- ES5 스타일 코드를 현대 JavaScript로 리팩터링한 예제
- 배열과 객체를 불변 방식으로 갱신하는 연습
- async/await로 API 호출 흐름을 표현한 실습

## Phase 2. TypeScript Foundation

React 실무 코드에서 필요한 TypeScript 기반을 별도 챕터로 정리합니다. 완전한 TypeScript 심화 과정이 아니라, React 컴포넌트와 프론트엔드 도메인 모델링에 필요한 타입 사고방식을 다룹니다.

- 기본 타입과 타입 추론
- `type`과 `interface`
- union type과 literal type
- optional property
- 함수 파라미터와 반환 타입
- 객체 destructuring 파라미터 타입
- 배열, `Record`, generic
- API 응답 타입 모델링
- React props 타입
- `any`, `unknown`, 타입 단언의 사용 기준

산출물:

- 주문 도메인 타입 정의
- API 응답 공통 타입 `ApiResponse<T>` 작성
- React 컴포넌트 props 타입 작성

## Phase 3. React 사고 모델

React를 컴포넌트 문법이 아니라 렌더링 시스템으로 이해합니다. 이 단계는 현대 JavaScript의 함수, 모듈, 배열 처리, 불변성에 익숙해졌다는 전제에서 진행합니다.

- React가 UI를 선언적으로 다루는 방식
- 컴포넌트, props, state의 역할 분리
- 렌더링과 커밋의 차이
- JSX가 표현식으로 동작하는 방식
- key, reconciliation, component identity

산출물:

- 작은 UI를 컴포넌트 단위로 분해한 예제
- state 위치 결정을 설명한 설계 메모

## Phase 4. State and Effects

상태와 외부 시스템 연동을 분리해서 다룹니다.

- local state, derived state, server state의 구분
- `useState`, `useReducer`, `useRef` 선택 기준
- `useEffect`가 필요한 경우와 필요하지 않은 경우
- stale closure, dependency array, cleanup
- form state와 validation 전략

산출물:

- 복잡도가 있는 폼 구현
- effect 제거 또는 축소 리팩터링 사례

## Phase 5. Component Architecture

제품 코드베이스에서 오래 버티는 컴포넌트 구조를 설계합니다.

- presentational/container 구분의 장단점
- composition, slot, render prop, custom hook
- feature-based structure
- design system과 product component의 경계
- prop drilling, context, external store의 선택 기준

산출물:

- 기능 단위 폴더 구조 예시
- 재사용 컴포넌트 API 설계 리뷰

## Phase 6. Data Fetching and Async UI

네트워크와 비동기 상태를 사용자 경험 중심으로 설계합니다.

- loading, empty, error, stale 상태
- cache, invalidation, optimistic update
- request cancellation과 race condition
- Suspense의 역할과 한계
- React Router 또는 framework 기반 데이터 로딩

산출물:

- 목록, 상세, 편집 흐름을 가진 CRUD 예제
- 실패와 재시도를 포함한 async state 설계

## Phase 7. Performance and Concurrency

측정 가능한 성능 개선과 React 18 이후의 동시성 모델을 다룹니다.

- render cost와 commit cost
- memoization의 비용과 사용 기준
- `useMemo`, `useCallback`, `memo`
- `startTransition`, `useDeferredValue`
- virtualization, code splitting
- React DevTools Profiler 기반 분석

산출물:

- 성능 병목 분석 보고서
- before/after profiler 비교

## Phase 8. Testing and Quality

React 애플리케이션 품질을 자동화 가능한 기준으로 관리합니다.

- unit, integration, E2E 테스트 경계
- Testing Library의 사용자 중심 테스트 모델
- mocking 전략
- accessibility testing
- error boundary와 observability
- lint, typecheck, CI 품질 게이트

산출물:

- 핵심 사용자 플로우 테스트
- 접근성 체크리스트

## Phase 9. Production Architecture

팀과 제품 규모에서 React 코드를 운영하는 방법을 정리합니다.

- monorepo와 package boundary
- design system 운영
- state management 선택: Context, Zustand, Redux Toolkit, TanStack Query 등
- SSR, SSG, hydration의 의사결정
- migration strategy
- 프론트엔드 아키텍처 리뷰 방법

산출물:

- 아키텍처 결정 기록 ADR
- 레거시 React 코드 개선 계획
