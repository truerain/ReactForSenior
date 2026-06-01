# 실습 2. 주문 목록 UI

## 목표

React의 기본 렌더링 모델, props, state, key를 사용해 작은 화면을 구성합니다.

## 요구사항

- 주문 목록을 화면에 표시한다.
- 주문 상태별 필터를 제공한다.
- 고객명 또는 주문 번호로 검색할 수 있다.
- 각 주문 항목은 안정적인 key를 사용한다.
- 컴포넌트는 최소 3개로 분리한다.

## 예시 데이터

```ts
type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
};

const orders: Order[] = [
  { id: "ord_001", orderNo: "SO-2026-001", customerName: "Kim", status: "pending", totalPrice: 120000 },
  { id: "ord_002", orderNo: "SO-2026-002", customerName: "Lee", status: "paid", totalPrice: 89000 },
  { id: "ord_003", orderNo: "SO-2026-003", customerName: "Park", status: "shipped", totalPrice: 240000 },
  { id: "ord_004", orderNo: "SO-2026-004", customerName: "Choi", status: "cancelled", totalPrice: 56000 },
];
```

## 완료 기준

- 상태 변경 시 UI가 올바르게 다시 계산된다.
- DOM 직접 조작 없이 React state만으로 동작한다.
- index key를 사용하지 않는다.
- 필터링 로직이 렌더링 중 이해 가능한 형태로 드러난다.

## 확장 과제

- 총 주문 금액을 derived value로 표시한다.
- 상태별 개수를 표시한다.
- 필터 UI를 별도 컴포넌트로 분리하고 props API를 리뷰한다.
