# 9강. Production Architecture

## 학습 목표

- 팀 규모에서 React 코드베이스가 커질 때 필요한 경계를 설계할 수 있다.
- 상태 관리, 라우팅, 데이터 패칭, 디자인 시스템의 선택 기준을 설명할 수 있다.
- ADR로 아키텍처 의사결정을 문서화할 수 있다.
- 레거시 화면을 한 번에 갈아엎지 않고 점진적으로 이전하는 전략을 세울 수 있다.

## 제품 아키텍처는 선택의 기록이다

React 앱이 커지면 기술 선택보다 선택을 일관되게 적용하는 능력이 더 중요해집니다.

아키텍처가 필요한 이유:

- 팀원이 늘어난다.
- 화면과 기능이 많아진다.
- 공통 UI와 도메인 로직이 반복된다.
- 배포와 장애 대응이 중요해진다.
- 레거시와 신규 코드가 공존한다.

좋은 아키텍처는 모든 문제를 미리 해결하지 않습니다. 대신 변경이 예상되는 지점에 명확한 경계를 둡니다.

## 1. 폴더 구조보다 의존성 방향

폴더 구조는 중요하지만 핵심은 의존성 방향입니다.

```text
app -> pages -> features -> shared
```

예:

```text
src/
  app/
    App.tsx
    router.tsx
  pages/
    orders/
      OrderListPage.tsx
  features/
    orders/
      api/
      components/
      model/
      hooks/
  shared/
    ui/
    utils/
    config/
```

규칙:

- `shared`는 `features`를 import하지 않는다.
- `features/orders`는 `features/users` 내부 구현에 직접 의존하지 않는다.
- page는 feature를 조립한다.
- app은 라우팅, provider, 전역 설정을 담당한다.

## 2. Package Boundary와 Monorepo

제품이 커지면 하나의 앱 안에서도 패키지 경계가 필요할 수 있습니다.

모노레포가 유용한 경우:

- 여러 앱이 같은 디자인 시스템을 공유한다.
- 공통 타입과 API 클라이언트를 공유한다.
- 배포 단위는 다르지만 개발 경험을 통합하고 싶다.
- 패키지별 build, test, version 정책이 필요하다.

예:

```text
packages/
  ui/
  theme/
  api-client/
  domain/
apps/
  admin/
  customer-portal/
```

패키지 경계는 빌드 속도와 코드 소유권을 개선할 수 있지만, 설정 복잡도도 증가시킵니다. 작은 팀에서는 feature-based 구조로 충분할 수 있습니다.

## 3. 상태 관리 선택

상태 관리 도구는 문제 유형에 맞게 선택해야 합니다.

| 문제 | 적합한 선택 |
| --- | --- |
| 컴포넌트 내부 입력값 | `useState`, `useReducer` |
| 여러 컴포넌트가 읽는 테마/권한 | Context |
| 서버 데이터, 캐시, 재조회 | TanStack Query류 서버 상태 도구 |
| 복잡한 클라이언트 전역 상태 | Zustand, Redux Toolkit 등 |
| URL에 남아야 하는 상태 | Router query string |

모든 상태를 Redux나 Context에 넣는 방식은 유지보수를 어렵게 만듭니다. 상태의 소유자와 수명을 먼저 판단합니다.

## 4. Routing과 Data Loading

라우팅은 URL과 화면 상태를 연결합니다.

결정할 기준:

- 검색 조건을 URL에 남길 것인가?
- 상세 화면을 직접 링크로 열 수 있어야 하는가?
- route 진입 전에 데이터를 불러올 것인가?
- 권한 없는 사용자를 어디에서 차단할 것인가?

검색 조건이 공유되어야 한다면 local state보다 query string이 더 적합합니다.

```text
/orders?status=paid&keyword=kim&page=2
```

URL은 사용자가 복사하고 공유할 수 있는 상태 저장소입니다.

## 5. SSR, SSG, CSR 선택

모든 React 앱에 SSR이 필요한 것은 아닙니다.

CSR이 적합한 경우:

- 내부 업무 시스템
- 로그인 후 사용
- SEO가 중요하지 않음
- 빠른 개발과 단순 배포가 중요함

SSR/SSG가 적합한 경우:

- SEO가 중요함
- 첫 화면 성능이 비즈니스에 중요함
- 공개 콘텐츠가 많음
- 서버 렌더링 프레임워크를 운영할 역량이 있음

SSR은 성능 문제를 자동으로 해결하지 않습니다. 서버 운영, hydration, cache, 배포 복잡도를 함께 가져옵니다.

## 6. Design System 운영

디자인 시스템은 컴포넌트 모음이 아니라 제품 UI 의사결정의 표준입니다.

운영 기준:

- token: 색상, spacing, typography
- primitive: Button, Input, Modal
- pattern: SearchForm, DataTable, EmptyState
- documentation: 사용 예와 금지 예
- governance: 변경 절차와 버전 정책

제품 컴포넌트와 디자인 시스템 컴포넌트를 섞으면 재사용성이 떨어집니다. 도메인 로직은 feature에 두고, 시각적 규칙은 design system에 둡니다.

## 7. Migration Strategy

레거시 화면을 신규 React 구조로 옮길 때 한 번에 전체를 바꾸는 방식은 위험합니다.

점진적 전략:

1. 새 기능부터 신규 구조로 작성한다.
2. 공통 타입과 API 클라이언트를 먼저 분리한다.
3. 레거시 화면 주변에 adapter를 둔다.
4. 화면 단위로 라우팅을 전환한다.
5. 사용량과 장애 지표를 보며 단계적으로 제거한다.

마이그레이션의 목적은 "새 기술 사용"이 아니라 운영 위험을 낮추면서 유지보수 비용을 줄이는 것입니다.

## 8. ADR

ADR(Architecture Decision Record)은 중요한 기술 결정을 짧게 기록하는 문서입니다.

예시 구조:

```md
# ADR 001. 서버 상태 관리는 TanStack Query를 사용한다

## Context

주문, 고객, 상품 데이터가 여러 화면에서 중복 조회되고 있다.

## Decision

서버 상태 캐시와 mutation invalidation은 TanStack Query로 표준화한다.

## Consequences

- 화면별 loading/error 처리 방식이 일관된다.
- Query key 설계 규칙이 필요하다.
- 기존 직접 fetch 코드는 점진적으로 이전한다.
```

ADR은 길 필요가 없습니다. 중요한 것은 왜 그렇게 결정했는지 나중에 추적 가능해야 한다는 점입니다.

## 9. 아키텍처 리뷰 질문

- 이 구조는 현재 팀 규모와 제품 복잡도에 맞는가?
- 의존성 방향을 위반하는 import가 없는가?
- 상태의 소유자와 수명이 명확한가?
- 서버 상태 정책이 화면마다 흩어져 있지 않은가?
- URL에 남아야 할 상태와 local state가 구분되는가?
- 디자인 시스템과 제품 로직의 경계가 유지되는가?
- 큰 변경에 ADR이 남아 있는가?

