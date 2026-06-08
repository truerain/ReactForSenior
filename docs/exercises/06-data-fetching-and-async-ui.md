# 실습 6. 주문 CRUD 흐름과 Async UI 구현

## 목표

주문 관리 앱에 서버 상태에 가까운 비동기 UI를 구현합니다. 실제 서버 대신 mock API를 사용하되, loading, error, empty, success, retry, optimistic update 흐름을 모두 다룹니다.

## 시작 조건

Phase 5 실습 결과물을 사용합니다.

```powershell
cd my-react-app
pnpm dev
```

## 요구사항

- 주문 목록을 mock API로 불러온다.
- async 상태를 union type으로 모델링한다.
- loading, error, empty, success UI를 구분한다.
- 실패 시 재시도 버튼을 제공한다.
- 주문 상태 변경은 optimistic update로 처리한다.
- 실패 시 이전 상태로 rollback한다.
- 검색어가 바뀔 때 오래된 응답이 최신 UI를 덮어쓰지 않게 한다.

## 1. Async 상태 타입 만들기

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; message: string };
```

## 2. mock API 만들기

`src/features/orders/api/orderApi.ts`를 만듭니다.

```ts
import type { Order, OrderStatus } from "../model/orderTypes";

const mockOrders: Order[] = [
  { id: "ord_001", orderNo: "SO-2026-001", customerName: "Kim", status: "pending", totalPrice: 120000 },
  { id: "ord_002", orderNo: "SO-2026-002", customerName: "Lee", status: "paid", totalPrice: 89000 },
  { id: "ord_003", orderNo: "SO-2026-003", customerName: "Park", status: "shipped", totalPrice: 240000 },
];

export function fetchOrders({
  keyword,
  signal,
}: {
  keyword: string;
  signal?: AbortSignal;
}): Promise<Order[]> {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      const normalizedKeyword = keyword.trim().toLowerCase();
      const orders = mockOrders.filter(
        (order) =>
          normalizedKeyword === "" ||
          order.orderNo.toLowerCase().includes(normalizedKeyword) ||
          order.customerName.toLowerCase().includes(normalizedKeyword)
      );

      resolve(orders);
    }, 700);

    signal?.addEventListener("abort", () => {
      window.clearTimeout(timerId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

export function updateOrderStatus({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      console.log("server updated", { id, status });
      resolve();
    }, 500);
  });
}
```

## 3. 목록 조회 hook 만들기

`src/features/orders/hooks/useOrdersQuery.ts`를 만듭니다.

```ts
import { useEffect, useState } from "react";
import { fetchOrders } from "../api/orderApi";
import type { Order } from "../model/orderTypes";

type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; message: string };

export function useOrdersQuery(keyword: string) {
  const [state, setState] = useState<AsyncState<Order[]>>({ status: "idle" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      try {
        setState({ status: "loading" });
        const orders = await fetchOrders({ keyword, signal: controller.signal });
        setState(
          orders.length === 0
            ? { status: "empty" }
            : { status: "success", data: orders }
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setState({ status: "error", message: "주문 목록 조회에 실패했습니다." });
      }
    }

    loadOrders();

    return () => {
      controller.abort();
    };
  }, [keyword, reloadKey]);

  return {
    state,
    reload: () => setReloadKey((current) => current + 1),
    setState,
  };
}
```

## 4. 상태별 UI 구현

`OrderPage`에서 상태별로 다른 UI를 표시합니다.

```tsx
if (ordersState.status === "loading") {
  return <p>주문 목록을 불러오는 중입니다.</p>;
}

if (ordersState.status === "error") {
  return (
    <div>
      <p>{ordersState.message}</p>
      <button type="button" onClick={reloadOrders}>
        다시 시도
      </button>
    </div>
  );
}

if (ordersState.status === "empty") {
  return <p>표시할 주문이 없습니다.</p>;
}
```

## 5. Optimistic Update 구현

```tsx
async function handleChangeOrderStatus(id: string, status: OrderStatus) {
  if (ordersState.status !== "success") {
    return;
  }

  const previousOrders = ordersState.data;

  setOrdersState({
    status: "success",
    data: previousOrders.map((order) =>
      order.id === id ? { ...order, status } : order
    ),
  });

  try {
    await updateOrderStatus({ id, status });
  } catch {
    setOrdersState({ status: "success", data: previousOrders });
    alert("주문 상태 변경에 실패했습니다.");
  }
}
```

mock API 실패를 확인하려면 `updateOrderStatus`에서 임의로 `reject`를 반환하는 버튼이나 플래그를 추가합니다.

## 완료 기준

- 목록 조회 중 loading UI가 표시된다.
- 정상 조회 후 목록이 표시된다.
- 검색 결과가 없으면 empty UI가 표시된다.
- 오류 상태에서 다시 시도 버튼이 동작한다.
- 검색어를 빠르게 변경해도 오래된 요청 결과가 최신 화면을 덮어쓰지 않는다.
- 주문 상태 변경은 즉시 UI에 반영되고, 실패 시 rollback된다.

## 리뷰 질문

- 서버 상태와 필터 입력 state가 분리되어 있는가?
- error와 empty가 다른 화면으로 표현되는가?
- 요청 취소가 race condition을 줄이는가?
- optimistic update 실패 시 사용자가 이해할 수 있는 피드백이 있는가?
- 이 요구가 여러 화면에 반복된다면 서버 상태 라이브러리를 도입할 근거가 있는가?

