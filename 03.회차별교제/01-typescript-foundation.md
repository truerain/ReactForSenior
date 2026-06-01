# 1강. TypeScript Foundation

## 학습 목표

- TypeScript가 JavaScript를 대체하는 언어가 아니라, JavaScript에 타입 시스템을 더한 도구임을 이해한다.
- `type`, `interface`, union type, optional property, function type을 읽고 작성할 수 있다.
- React 컴포넌트 props와 API 응답 데이터를 타입으로 표현할 수 있다.
- 타입이 런타임 검증을 대신하지 않는다는 한계를 이해한다.

## 1. TypeScript를 왜 쓰는가

레거시 JavaScript에서는 데이터 구조가 코드 밖에 숨어 있는 경우가 많습니다.

```js
function renderOrder(order) {
  return order.orderNo + " / " + order.customerName + " / " + order.status;
}
```

이 함수만 보고는 `order`가 어떤 필드를 가져야 하는지, `status`에 어떤 값이 들어올 수 있는지 알기 어렵습니다.

TypeScript는 이런 암묵적인 약속을 코드에 드러냅니다.

```ts
type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
};

function renderOrder(order: Order) {
  return `${order.orderNo} / ${order.customerName} / ${order.status}`;
}
```

타입은 문서이면서 동시에 도구가 검사할 수 있는 계약입니다.

관련 읽기:

- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/ko/docs/handbook/typescript-in-5-minutes.html)
- [Everyday Types](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html)

## 2. 기본 타입

```ts
const orderNo: string = "SO-2026-001";
const totalPrice: number = 120000;
const isPaid: boolean = true;
const tags: string[] = ["react", "typescript"];
```

실무에서는 모든 변수에 타입을 직접 붙이지 않습니다. TypeScript가 추론할 수 있으면 생략합니다.

```ts
const orderNo = "SO-2026-001";
const totalPrice = 120000;
```

타입을 명시해야 하는 대표적인 위치는 함수 파라미터, API 응답, 외부에서 들어오는 데이터, 컴포넌트 props입니다.

관련 읽기:

- [Everyday Types](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html)

## 3. type alias

`type`은 타입에 이름을 붙이는 방법입니다.

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

도메인에서 중요한 개념에는 타입 이름을 붙이는 편이 좋습니다. `string`보다 `OrderStatus`가 훨씬 많은 정보를 전달합니다.

관련 읽기:

- [Type Aliases](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#type-aliases)

## 4. interface

`interface`도 객체의 구조를 표현할 수 있습니다.

```ts
interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
}
```

React 실무에서는 `type`과 `interface`를 모두 볼 수 있습니다. 둘 중 하나만 정답은 아닙니다.

일반적인 기준:

- union, primitive 조합, 함수 타입, 유틸리티 타입 조합은 `type`이 편하다.
- 객체 모델을 확장해야 하거나 public API 형태를 표현할 때는 `interface`가 자연스럽다.
- 한 프로젝트 안에서는 팀의 일관성이 더 중요하다.

관련 읽기:

- [Interfaces](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#interfaces)
- [Object Types](https://www.typescriptlang.org/ko/docs/handbook/2/objects.html)

## 5. Union Type

union type은 가능한 값의 집합을 제한합니다.

```ts
type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
```

이렇게 정의하면 오타를 줄일 수 있습니다.

```ts
function updateStatus(status: OrderStatus) {
  return status;
}

updateStatus("paid");
updateStatus("done"); // 오류
```

넥사크로의 코드값, 공통코드, 상태값을 React/TypeScript로 옮길 때 union type은 매우 유용합니다.

관련 읽기:

- [Union Types](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#union-types)
- [Literal Types](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#literal-types)
- [Narrowing](https://www.typescriptlang.org/ko/docs/handbook/2/narrowing.html)

## 6. Optional Property

항상 존재하지 않는 값은 `?`로 표시합니다.

```ts
type Order = {
  id: string;
  orderNo: string;
  customerName: string;
  memo?: string;
};
```

`memo?: string`은 `memo`가 없을 수도 있다는 뜻입니다. 사용할 때는 없는 경우를 처리해야 합니다.

```ts
function getOrderMemo(order: Order) {
  return order.memo ?? "메모 없음";
}
```

optional property는 편하지만 남용하면 모델이 흐려집니다. 정말 선택값인지, 아니면 API 응답 처리 과정에서 아직 보장되지 않은 값인지 구분해야 합니다.

관련 읽기:

- [Optional Properties](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#optional-properties)
- [Object Types](https://www.typescriptlang.org/ko/docs/handbook/2/objects.html)

## 7. 함수 파라미터와 반환 타입

함수는 입력과 출력의 계약을 타입으로 표현할 수 있습니다.

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

객체 destructuring 파라미터와 TypeScript를 함께 쓰면 호출부와 구현부가 모두 명확해집니다.

```ts
updateOrderStatus({
  orders,
  id: "ord_001",
  status: "paid",
});
```

관련 읽기:

- [Functions](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html)
- [Object Types](https://www.typescriptlang.org/ko/docs/handbook/2/objects.html)

## 8. 배열과 Record

배열 타입은 두 방식 모두 사용할 수 있습니다.

```ts
type Orders = Order[];
type OrderList = Array<Order>;
```

상태별 개수처럼 key-value 형태는 `Record`가 유용합니다.

```ts
type OrderStatusCount = Record<OrderStatus, number>;

const count: OrderStatusCount = {
  pending: 0,
  paid: 0,
  shipped: 0,
  cancelled: 0,
};
```

`Record<K, V>`는 key 타입 `K`와 value 타입 `V`를 가진 객체를 표현합니다.

관련 읽기:

- [Everyday Types - Arrays](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#arrays)
- [Utility Types - Record](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html#recordkeys-type)

## 9. Generics

generic은 타입을 파라미터처럼 받는 기능입니다. 처음에는 어렵게 느껴지지만, "같은 구조인데 안에 들어가는 데이터만 다른 경우"라고 보면 됩니다.

```ts
type ApiResponse<T> = {
  data: T;
  message: string;
};

type OrderResponse = ApiResponse<Order>;
type OrderListResponse = ApiResponse<Order[]>;
```

React와 프론트엔드 실무에서는 API 응답, select option, table row, form value처럼 재사용되는 구조를 표현할 때 자주 사용합니다.

관련 읽기:

- [Generics](https://www.typescriptlang.org/ko/docs/handbook/2/generics.html)

## 10. React props 타입

React 컴포넌트는 props라는 객체를 파라미터로 받는 함수로 볼 수 있습니다.

```tsx
type OrderRowProps = {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
};

function OrderRow({ order, onStatusChange }: OrderRowProps) {
  return (
    <button onClick={() => onStatusChange(order.id, "paid")}>
      {order.orderNo} / {order.customerName}
    </button>
  );
}
```

props 타입은 컴포넌트의 사용법을 설명하는 가장 중요한 문서입니다.

관련 읽기:

- [JSX](https://www.typescriptlang.org/ko/docs/handbook/jsx.html)
- [Object Types](https://www.typescriptlang.org/ko/docs/handbook/2/objects.html)
- [Functions](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html)

## 11. 타입과 런타임 검증은 다르다

TypeScript 타입은 개발 중 검사입니다. 서버에서 잘못된 JSON이 오거나 사용자가 잘못된 값을 입력하는 상황을 자동으로 막아주지는 않습니다.

```ts
const response = await fetch("/api/orders");
const orders = await response.json();
```

위 코드에서 TypeScript는 `orders`의 실제 런타임 구조를 검증하지 않습니다. 외부 데이터는 필요하면 별도의 검증 로직이나 schema validation 도구로 확인해야 합니다.

관련 읽기:

- [unknown](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#unknown)
- [Type Assertions](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html#type-assertions)
- [Narrowing](https://www.typescriptlang.org/ko/docs/handbook/2/narrowing.html)

## 12. 실무 기준

- 타입 이름은 도메인 언어를 사용한다.
- `any`는 마지막 수단으로만 사용한다.
- `unknown`은 검증 전 외부 데이터에 적합하다.
- 함수 파라미터가 많으면 객체 타입으로 묶는다.
- API 응답 타입과 화면 상태 타입을 무조건 같게 만들지 않는다.
- 타입이 복잡해지면 구현이 아니라 모델링이 복잡한 것인지 먼저 의심한다.

관련 읽기:

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Everyday Types](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html)
- [Object Types](https://www.typescriptlang.org/ko/docs/handbook/2/objects.html)
- [Generics](https://www.typescriptlang.org/ko/docs/handbook/2/generics.html)

## 리뷰 질문

- 이 값은 단순 `string`인가, 제한된 상태값인가?
- 이 객체 타입은 도메인 모델인가, 화면 표시용 모델인가?
- optional property가 정말 선택값을 의미하는가?
- 함수의 입력과 출력이 타입만 보고 이해되는가?
- 외부 데이터에 타입 단언만 하고 검증을 생략하고 있지 않은가?
