# 5강. Component Architecture

## 학습 목표

- 컴포넌트 분리가 재사용보다 변경 격리를 위한 설계 도구임을 이해한다.
- props API를 데이터, 이벤트, 슬롯으로 구분해 설계할 수 있다.
- feature-based 구조와 공통 컴포넌트 구조의 경계를 설명할 수 있다.
- custom hook, Context, composition을 언제 사용할지 판단할 수 있다.

## 왜 컴포넌트 아키텍처가 중요한가

작은 React 앱에서는 한 파일 안에 모든 코드를 두어도 동작합니다. 하지만 제품 코드에서는 요구사항 변경, 화면 확장, 팀 작업, 테스트, 디자인 시스템 연동이 반복됩니다.

컴포넌트 아키텍처의 목적은 파일을 많이 나누는 것이 아닙니다. 변경될 가능성이 높은 코드를 서로 격리하고, 호출부가 읽기 쉬운 API를 만드는 것입니다.

```tsx
<OrderTable
  orders={visibleOrders}
  selectedOrderId={selectedOrderId}
  onSelectOrder={setSelectedOrderId}
/>
```

이 호출부만 보고도 `OrderTable`의 책임을 알 수 있어야 합니다.

## 1. 컴포넌트 분리 기준

컴포넌트를 분리할 때 흔한 기준은 "코드가 길어졌기 때문"입니다. 길이는 신호일 수 있지만 충분한 이유는 아닙니다.

더 나은 기준:

- 책임이 다르다.
- 변경 이유가 다르다.
- 독립적으로 테스트하거나 검토할 수 있다.
- props API로 의도를 명확히 표현할 수 있다.
- 하위 구현을 바꿔도 상위 호출부가 흔들리지 않는다.

주문 화면 예시:

```text
OrderPage
  OrderFilterPanel
  OrderSummaryCards
  OrderTable
    OrderRow
  OrderDetailPanel
```

`OrderPage`는 데이터를 소유하고 흐름을 조립합니다. `OrderFilterPanel`은 검색 조건 입력만 담당합니다. `OrderTable`은 목록 표시와 행 선택 이벤트만 담당합니다.

## 2. Container와 Presentational

오래된 React 문서와 프로젝트에서는 container/presentational 구분을 자주 볼 수 있습니다.

- Container: 데이터 조회, state, effect, 라우팅 등 화면의 동작을 담당
- Presentational: props로 받은 데이터를 렌더링하고 이벤트를 올려보냄

```tsx
function OrderPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  return (
    <OrderTable
      orders={orders}
      selectedOrderId={selectedOrderId}
      onSelectOrder={setSelectedOrderId}
    />
  );
}
```

```tsx
type OrderTableProps = {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (id: string) => void;
};

function OrderTable({
  orders,
  selectedOrderId,
  onSelectOrder,
}: OrderTableProps) {
  return (
    <table>
      <tbody>
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            selected={order.id === selectedOrderId}
            onSelect={onSelectOrder}
          />
        ))}
      </tbody>
    </table>
  );
}
```

이 구분은 여전히 유용하지만 절대 규칙은 아닙니다. 작은 기능 안에서는 state와 UI가 가까이 있는 편이 더 읽기 쉽습니다.

## 3. Props API 설계

props는 컴포넌트의 public API입니다. 이름이 모호하면 컴포넌트 내부를 열어봐야 합니다.

피해야 할 이름:

- `data`
- `item`
- `value`
- `onChange`
- `setData`

더 나은 이름:

- `orders`
- `selectedOrderId`
- `onSelectOrder`
- `onKeywordChange`
- `onSubmitOrder`

이벤트 props는 "무슨 일이 발생했는가"를 표현하는 편이 좋습니다.

```tsx
type OrderFilterPanelProps = {
  keyword: string;
  status: OrderStatus | "all";
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: OrderStatus | "all") => void;
};
```

상위 컴포넌트가 실제로 state를 어떻게 바꾸는지는 하위 컴포넌트가 몰라도 됩니다.

## 4. Composition

composition은 컴포넌트에 구멍을 만들어 상위에서 내용을 주입하는 방식입니다.

```tsx
type PanelProps = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

function Panel({ title, actions, children }: PanelProps) {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}
```

사용 예:

```tsx
<Panel
  title="주문 목록"
  actions={<button type="button">새로고침</button>}
>
  <OrderTable orders={orders} onSelectOrder={setSelectedOrderId} />
</Panel>
```

composition은 boolean prop이 늘어나는 문제를 줄입니다.

```tsx
<Modal showFooter showCloseButton primaryButtonText="저장" />
```

이런 API가 커지면 내부 조건이 복잡해집니다. 대신 필요한 영역을 slot처럼 주입하는 편이 오래 버팁니다.

## 5. Custom Hook

custom hook은 UI가 아니라 상태ful 로직을 재사용하거나 격리할 때 사용합니다.

```tsx
function useOrderFilters() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  return {
    keyword,
    status,
    setKeyword,
    setStatus,
  };
}
```

hook으로 빼기 좋은 코드:

- localStorage 동기화
- query string 동기화
- table selection
- form state
- 비동기 요청 상태

반대로 단순 계산값은 hook으로 빼기 전에 일반 함수로 충분한지 먼저 봐야 합니다.

## 6. Context 사용 기준

Context는 prop drilling을 줄여주지만 모든 상태 관리 문제의 답은 아닙니다.

Context가 적합한 경우:

- 테마
- 로그인 사용자
- locale
- 권한 정보
- 화면 트리 전체에서 필요한 읽기 중심 값

Context가 부적합한 경우:

- 자주 바뀌는 입력값
- 특정 화면 일부에서만 필요한 state
- 서버 캐시
- 모든 것을 전역으로 두려는 목적

값이 자주 바뀌면 Context를 구독하는 많은 컴포넌트가 다시 렌더링될 수 있습니다. 먼저 state colocation을 검토합니다.

## 7. Feature-based 구조

기능 단위 구조는 관련 코드를 가까이 둡니다.

```text
src/
  features/
    orders/
      components/
        OrderFilterPanel.tsx
        OrderTable.tsx
        OrderDetailPanel.tsx
      hooks/
        useOrderFilters.ts
      model/
        orderTypes.ts
      utils/
        orderCalculations.ts
      OrderPage.tsx
  shared/
    ui/
      Button.tsx
      Panel.tsx
    utils/
      formatCurrency.ts
```

기준:

- `features/orders`: 주문 도메인에만 의미가 있는 코드
- `shared/ui`: 도메인과 무관한 UI building block
- `shared/utils`: 도메인과 무관한 순수 유틸리티

공통화는 발견되는 것이지 예측해서 만드는 것이 아닙니다. 최소 2~3곳에서 같은 요구가 반복된 뒤 공통 컴포넌트로 올리는 편이 안전합니다.

## 8. Design System과 Product Component

디자인 시스템 컴포넌트는 도메인을 몰라야 합니다.

```tsx
<Button variant="primary">저장</Button>
```

제품 컴포넌트는 도메인 의미를 가집니다.

```tsx
<ApproveOrderButton orderId={order.id} />
```

`Button` 안에 주문 승인 API 호출이 들어가면 재사용 컴포넌트와 제품 로직의 경계가 무너집니다. 반대로 모든 제품 컴포넌트를 지나치게 일반화하면 호출부가 복잡해집니다.

## 9. 리뷰 질문

- 이 컴포넌트의 변경 이유는 하나인가?
- props 이름만 보고 사용법을 이해할 수 있는가?
- state를 너무 위로 끌어올리지 않았는가?
- 공통 컴포넌트가 도메인 로직을 알게 되지 않았는가?
- custom hook이 실제로 복잡도를 줄였는가?
- Context가 필요한 범위보다 넓게 쓰이지 않았는가?

