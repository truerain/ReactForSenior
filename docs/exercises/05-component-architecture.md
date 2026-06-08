# 실습 5. 주문 관리 앱 컴포넌트 아키텍처 리팩터링

## 목표

Phase 4에서 만든 주문 관리 앱을 기능 단위 구조로 리팩터링합니다. 동작을 크게 늘리기보다, 오래 유지되는 컴포넌트 구조와 props API를 만드는 데 집중합니다.

## 시작 조건

Phase 4 실습 결과물을 사용합니다.

```powershell
cd my-react-app
pnpm dev
```

npm을 사용하는 경우:

```powershell
npm run dev
```

## 요구사항

- 주문 관련 코드를 `features/orders` 아래로 이동한다.
- 도메인 타입을 별도 파일로 분리한다.
- 화면 조립 컴포넌트와 표시 컴포넌트를 구분한다.
- 검색 패널, 요약, 테이블, 상세 패널을 각각 컴포넌트로 분리한다.
- 공통 UI인 `Panel` 컴포넌트를 만든다.
- 필터 state는 custom hook으로 분리한다.
- props 이름은 도메인 의미를 드러내도록 작성한다.

## 1. 권장 폴더 구조

```text
src/
  features/
    orders/
      components/
        OrderDetailPanel.tsx
        OrderFilterPanel.tsx
        OrderSummary.tsx
        OrderTable.tsx
        OrderRow.tsx
      hooks/
        useOrderFilters.ts
      model/
        orderTypes.ts
      utils/
        orderCalculations.ts
      OrderPage.tsx
  shared/
    ui/
      Panel.tsx
    utils/
      formatCurrency.ts
  App.tsx
```

## 2. 타입 분리

`src/features/orders/model/orderTypes.ts`를 만듭니다.

```ts
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
};

export type OrderStatusFilter = OrderStatus | "all";
```

## 3. 계산 로직 분리

`src/features/orders/utils/orderCalculations.ts`를 만듭니다.

```ts
import type { Order, OrderStatus, OrderStatusFilter } from "../model/orderTypes";

export function filterOrders({
  orders,
  keyword,
  status,
}: {
  orders: Order[];
  keyword: string;
  status: OrderStatusFilter;
}) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesStatus = status === "all" || order.status === status;
    const matchesKeyword =
      normalizedKeyword === "" ||
      order.orderNo.toLowerCase().includes(normalizedKeyword) ||
      order.customerName.toLowerCase().includes(normalizedKeyword);

    return matchesStatus && matchesKeyword;
  });
}

export function getTotalPrice(orders: Order[]) {
  return orders.reduce((sum, order) => sum + order.totalPrice, 0);
}

export function countOrdersByStatus(orders: Order[]) {
  return orders.reduce<Record<OrderStatus, number>>(
    (counts, order) => ({
      ...counts,
      [order.status]: counts[order.status] + 1,
    }),
    {
      pending: 0,
      paid: 0,
      shipped: 0,
      cancelled: 0,
    }
  );
}
```

## 4. Custom Hook 만들기

`src/features/orders/hooks/useOrderFilters.ts`를 만듭니다.

```ts
import { useState } from "react";
import type { OrderStatusFilter } from "../model/orderTypes";

export function useOrderFilters() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<OrderStatusFilter>("all");

  return {
    keyword,
    status,
    setKeyword,
    setStatus,
  };
}
```

localStorage 동기화는 Phase 4 코드가 있다면 hook 안으로 옮겨도 됩니다. 단, hook이 너무 많은 책임을 갖지 않도록 필터 state와 저장 정책만 담당하게 합니다.

## 5. `Panel` 컴포넌트 만들기

`src/shared/ui/Panel.tsx`를 만듭니다.

```tsx
import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section>
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}
```

## 6. 컴포넌트 props 기준

다음 형태처럼 의미가 드러나는 props를 사용합니다.

```ts
type OrderTableProps = {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (id: string) => void;
};
```

```ts
type OrderFilterPanelProps = {
  keyword: string;
  status: OrderStatusFilter;
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: OrderStatusFilter) => void;
};
```

`data`, `item`, `setValue` 같은 이름은 피합니다.

## 7. `OrderPage`에서 조립하기

`OrderPage`는 state와 데이터 흐름을 조립합니다.

```tsx
export function OrderPage() {
  const { keyword, status, setKeyword, setStatus } = useOrderFilters();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const visibleOrders = filterOrders({ orders, keyword, status });
  const totalPrice = getTotalPrice(visibleOrders);
  const statusCounts = countOrdersByStatus(orders);
  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null;

  return (
    <>
      <OrderFilterPanel
        keyword={keyword}
        status={status}
        onKeywordChange={setKeyword}
        onStatusChange={setStatus}
      />
      <OrderSummary totalPrice={totalPrice} statusCounts={statusCounts} />
      <OrderTable
        orders={visibleOrders}
        selectedOrderId={selectedOrderId}
        onSelectOrder={setSelectedOrderId}
      />
      <OrderDetailPanel order={selectedOrder} />
    </>
  );
}
```

## 완료 기준

- `App.tsx`는 `OrderPage`를 렌더링하는 수준으로 단순해진다.
- 주문 타입, 계산 로직, UI 컴포넌트가 파일 단위로 분리된다.
- props 이름만 보고 컴포넌트 사용 의도를 알 수 있다.
- 공통 `Panel`은 주문 도메인 타입을 import하지 않는다.
- 리팩터링 후 검색, 필터, 선택, 상세 표시 기능이 기존과 동일하게 동작한다.

## 리뷰 질문

- 분리한 컴포넌트의 책임이 명확한가?
- 공통 컴포넌트가 도메인 로직을 알지 않는가?
- custom hook이 UI 렌더링을 포함하지 않는가?
- 파일 구조가 기능을 찾기 쉽게 만드는가?
- 리팩터링 전후 사용자 동작이 동일한가?

