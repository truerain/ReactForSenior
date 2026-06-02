# 실습 1. ES5 코드 현대화

## 목표

레거시 JavaScript 스타일 코드를 현대 JavaScript와 TypeScript 친화적인 형태로 바꿉니다.

## 시작 코드

```js
var orders = [
  { id: "ord_001", orderNo: "SO-2026-001", customerName: "Kim", status: "pending", totalPrice: 120000 },
  { id: "ord_002", orderNo: "SO-2026-002", customerName: "Lee", status: "paid", totalPrice: 89000 },
  { id: "ord_003", orderNo: "SO-2026-003", customerName: "Park", status: "shipped", totalPrice: 240000 },
  { id: "ord_004", orderNo: "SO-2026-004", customerName: "Choi", status: "cancelled", totalPrice: 56000 }
];

function getPaidOrders(orders) {
  var result = [];

  for (var i = 0; i < orders.length; i++) {
    if (orders[i].status === "paid") {
      result.push(orders[i]);
    }
  }

  return result;
}

function updateOrderStatus(orders, id, status) {
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id === id) {
      orders[i].status = status;
    }
  }

  return orders;
}
```

## 요구사항

- `var`를 제거하고 `const`, `let`을 사용한다.
- `for` 루프 중 하나 이상을 `filter`, `map`, `reduce` 중 적절한 메서드로 바꾼다.
- 주문 상태 변경 함수는 원본 배열과 원본 객체를 직접 수정하지 않는다.
- `updateOrderStatus(orders, id, status)`를 객체 파라미터 destructuring 방식으로 바꾼다.
- `OrderStatus`, `Order` 타입을 정의한다.
- 총 주문 금액을 계산하는 함수를 추가한다.

## 기대 형태

```ts
type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
};
```

```ts
type UpdateOrderStatusInput = {
  orders: Order[];
  id: string;
  status: OrderStatus;
};

function updateOrderStatus({
  orders,
  id,
  status,
}: UpdateOrderStatusInput): Order[] {
  return orders.map((order) =>
    order.id === id ? { ...order, status } : order
  );
}
```

## 완료 기준

- 원본 `orders` 배열이 변경되지 않는다.
- 상태 변경 결과는 새 배열로 반환된다.
- 함수 호출부에서 각 인자의 의미가 이름으로 드러난다.
- 함수 이름만 보고도 반환값의 의미를 추측할 수 있다.
- React state 업데이트에 그대로 사용할 수 있는 코드 형태다.

## 확장 과제

- `status`별 주문 개수를 `reduce`로 계산한다.
- `Promise.resolve`를 사용해 주문 목록을 비동기로 불러오는 함수를 작성한다.
- `async/await`로 loading/error 처리를 표현하는 의사 코드를 작성한다.
