# 실습 1. 주문 도메인 타입 정의

## 목표

주문 목록 예제를 TypeScript 타입으로 모델링합니다. `type`, `interface`, union type, optional property, 함수 파라미터 타입, generic을 함께 사용합니다.

## 요구사항

- `OrderStatus` union type을 정의한다.
- `Order` 객체 타입을 `type` 또는 `interface`로 정의한다.
- 주문 생성 입력 타입 `CreateOrderInput`을 정의한다.
- 주문 상태 변경 입력 타입 `UpdateOrderStatusInput`을 정의한다.
- `updateOrderStatus` 함수는 객체 destructuring 파라미터를 사용한다.
- API 응답 공통 타입 `ApiResponse<T>`를 generic으로 정의한다.
- React props 타입 `OrderRowProps`를 정의한다.

## 시작 코드

```ts
const orders = [
  { id: "ord_001", orderNo: "SO-2026-001", customerName: "Kim", status: "pending", totalPrice: 120000 },
  { id: "ord_002", orderNo: "SO-2026-002", customerName: "Lee", status: "paid", totalPrice: 89000 },
  { id: "ord_003", orderNo: "SO-2026-003", customerName: "Park", status: "shipped", totalPrice: 240000 },
  { id: "ord_004", orderNo: "SO-2026-004", customerName: "Choi", status: "cancelled", totalPrice: 56000 },
];
```

## 기대 형태

```ts
type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
  memo?: string;
};

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

## 추가 구현

```ts
type ApiResponse<T> = {
  data: T;
  message: string;
};

type OrderListResponse = ApiResponse<Order[]>;

type OrderRowProps = {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
};
```

## 완료 기준

- `status`에 허용되지 않은 문자열을 넣으면 타입 오류가 발생한다.
- 주문 상태 변경 함수가 원본 배열을 직접 수정하지 않는다.
- 함수 호출부에서 인자의 의미가 이름으로 드러난다.
- `memo`가 없는 주문도 타입 오류 없이 표현된다.
- API 응답 타입이 `Order` 한 건과 `Order[]` 목록 모두에 재사용된다.

## 확장 과제

- `OrderStatusCount`를 `Record<OrderStatus, number>`로 정의한다.
- `CreateOrderInput`은 `id` 없이 주문 생성에 필요한 값만 받도록 정의한다.
- 서버 응답 타입과 화면 표시 타입을 분리해 `OrderViewModel`을 만든다.
