# 실습 9. 주문 관리 앱 Production Architecture 설계

## 목표

지금까지 만든 주문 관리 앱을 팀 프로젝트 기준으로 확장한다고 가정하고 아키텍처 설계 문서를 작성합니다. 코드를 많이 추가하기보다, 의존성 경계와 기술 선택을 명확히 설명하는 데 집중합니다.

## 산출물

다음 문서를 작성합니다.

```text
docs/
  architecture/
    orders-architecture.md
    adr-001-server-state.md
    migration-plan.md
```

## 요구사항

- 현재 폴더 구조와 목표 폴더 구조를 비교한다.
- feature, shared, app 계층의 의존성 규칙을 정의한다.
- 상태 관리 기준표를 작성한다.
- 서버 상태 도구 도입 여부를 ADR로 결정한다.
- URL 상태와 local state의 기준을 정리한다.
- 레거시 화면을 점진적으로 이전하는 계획을 작성한다.
- 테스트, 타입체크, 빌드 품질 게이트를 정의한다.

## 1. `orders-architecture.md` 작성

다음 템플릿을 사용합니다.

```md
# Orders Architecture

## Context

주문 관리 화면은 목록, 검색, 상세, 상태 변경, 오류 처리, 성능 최적화, 테스트를 포함한다.

## Current Structure

현재 폴더 구조와 문제점을 적는다.

## Target Structure

목표 폴더 구조를 적는다.

## Dependency Rules

- app은 page와 provider를 조립한다.
- page는 feature를 조립한다.
- feature는 shared를 사용할 수 있다.
- shared는 feature를 import하지 않는다.

## State Ownership

| 상태 | 소유자 | 저장 위치 |
| --- | --- | --- |
| 검색어 | URL 또는 local UI | query string 또는 component state |
| 선택 주문 ID | local UI | OrderPage |
| 주문 목록 | server | server state cache |
| 테마 | app | Context |

## Quality Gates

- typecheck
- lint
- test
- build
```

## 2. ADR 작성

`adr-001-server-state.md`를 작성합니다.

```md
# ADR 001. 주문 서버 상태 관리 방식

## Status

Accepted

## Context

주문 목록과 상세 데이터가 여러 화면에서 사용될 예정이며, 저장 후 목록 갱신과 오류 처리가 반복된다.

## Decision

서버 상태는 TanStack Query 같은 서버 상태 도구로 표준화한다.

## Alternatives

### 직접 fetch + useEffect

- 장점: 의존성이 적고 단순하다.
- 단점: cache, stale, retry, invalidation 정책이 화면마다 반복된다.

### 전역 클라이언트 상태 저장소

- 장점: 여러 컴포넌트에서 접근하기 쉽다.
- 단점: 서버 상태의 stale, refetch, mutation 정책을 직접 구현해야 한다.

## Consequences

- query key 규칙이 필요하다.
- mutation 후 invalidation 규칙을 정해야 한다.
- 기존 직접 fetch 코드는 점진적으로 이전한다.
```

도구 선택을 아직 확정하고 싶지 않다면 `Proposed` 상태로 두고 결정 근거와 남은 질문을 적습니다.

## 3. Migration Plan 작성

`migration-plan.md`를 작성합니다.

```md
# Migration Plan

## Goal

레거시 주문 화면을 React 기반 주문 관리 화면으로 점진적으로 이전한다.

## Principles

- 화면 단위로 이전한다.
- API 계약을 먼저 안정화한다.
- 공통 UI는 최소 반복 후 shared로 이동한다.
- 기존 화면과 신규 화면을 일정 기간 병행 운영한다.

## Steps

1. 주문 조회 API 응답 타입을 문서화한다.
2. 신규 React 주문 목록 화면을 read-only로 배포한다.
3. 상태 변경 기능을 제한된 사용자에게 활성화한다.
4. 오류 로그와 사용량을 모니터링한다.
5. 레거시 화면 진입점을 신규 화면으로 전환한다.
6. 사용 중단된 레거시 코드를 제거한다.

## Risks

- API 응답 구조가 화면마다 다를 수 있다.
- 권한 정책이 레거시 화면에 숨어 있을 수 있다.
- 사용자가 기존 화면 동작에 의존하고 있을 수 있다.

## Rollback

신규 화면 라우팅 플래그를 끄고 기존 화면으로 되돌린다.
```

## 4. 코드 경계 점검

현재 코드에서 다음 위반이 있는지 확인합니다.

- `shared`에서 `features/orders`를 import한다.
- 도메인 타입이 `shared/ui`로 들어갔다.
- API 호출이 여러 컴포넌트에 흩어져 있다.
- 검색 조건이 URL에 있어야 하는데 component state에만 있다.
- 테스트 없이 핵심 흐름이 변경된다.

## 5. 발표 준비

5분 이내로 설명할 수 있게 정리합니다.

설명 순서:

1. 현재 문제
2. 목표 구조
3. 의존성 규칙
4. 상태 관리 선택
5. 서버 상태 ADR
6. 마이그레이션 계획
7. 남은 리스크

## 완료 기준

- 아키텍처 문서 3개가 작성되어 있다.
- 상태별 소유자와 저장 위치가 표로 정리되어 있다.
- 서버 상태 관리 방식에 대한 ADR이 있다.
- 점진적 마이그레이션 단계와 rollback 기준이 있다.
- 팀원이 같은 기준으로 코드 리뷰할 수 있는 규칙이 있다.

## 리뷰 질문

- 이 설계는 현재 팀 규모에 과하지 않은가?
- 기술 선택보다 운영 규칙이 명확한가?
- shared와 feature 경계가 실제 import 규칙으로 설명되는가?
- ADR이 대안과 trade-off를 함께 기록하는가?
- rollback 계획이 현실적인가?

