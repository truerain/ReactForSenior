# 1강. Modern JavaScript Foundation

## 학습 목표

- ES5 중심의 JavaScript 코드와 현대 JavaScript 코드의 차이를 설명할 수 있다.
- React 코드에서 자주 쓰이는 문법을 읽고 쓸 수 있다.
- 배열, 객체, 비동기 처리, 모듈을 React 학습에 필요한 수준으로 정리한다.
- 불변 업데이트와 참조 동일성이 왜 중요한지 이해한다.

## 왜 React 전에 JavaScript를 다시 봐야 하는가

React는 JavaScript 위에 얹힌 UI 라이브러리입니다. 따라서 React에서 어렵게 느껴지는 많은 지점은 사실 React 문법이 아니라 현대 JavaScript 문법, 함수형 배열 처리, 비동기 처리, 모듈 시스템, 불변성에서 옵니다.

넥사크로와 같은 환경에서는 화면 객체를 직접 찾고 값을 변경하는 방식이 자연스럽습니다.

```js
this.divSearch.form.edtKeyword.set_value("react");
this.dsOrders.setColumn(row, "status", "paid");
```

React에서는 UI 객체를 직접 찾아 고치는 대신, 상태 데이터를 바꾸고 UI는 그 상태의 결과로 다시 계산되게 만듭니다.

```tsx
setKeyword("react");
setOrders((orders) =>
  orders.map((order) =>
    order.id === id ? { ...order, status: "paid" } : order
  )
);
```

이 차이를 받아들이려면 현대 JavaScript의 데이터 다루는 방식에 먼저 익숙해져야 합니다.

## 1. var 대신 let, const

`var`는 function scope를 갖고, `let`과 `const`는 block scope를 갖습니다.

```js
function legacyExample() {
  if (true) {
    var status = "paid";
  }

  console.log(status);
}
```

```js
function modernExample() {
  if (true) {
    const status = "paid";
    console.log(status);
  }
}
```

기본 원칙은 `const`를 먼저 쓰고, 재할당이 필요한 경우에만 `let`을 쓰는 것입니다.

관련 읽기:

- [변수와 상수](https://ko.javascript.info/variables)
- [오래된 var](https://ko.javascript.info/var)

## 2. Arrow Function

React 코드에서는 콜백 함수를 자주 전달합니다.

```js
const paidOrders = orders.filter(function (order) {
  return order.status === "paid";
});
```

```js
const paidOrders = orders.filter((order) => order.status === "paid");
```

화살표 함수는 짧은 콜백을 표현하기 좋고, `this` 바인딩 방식도 기존 함수와 다릅니다. React 함수 컴포넌트에서는 `this`를 거의 사용하지 않습니다.

관련 읽기:

- [화살표 함수 기본](https://ko.javascript.info/arrow-functions-basics)
- [화살표 함수 다시 살펴보기](https://ko.javascript.info/arrow-functions)

## 3. Destructuring

객체와 배열에서 필요한 값만 꺼낼 수 있습니다.

```js
const order = {
  id: "ord_001",
  customerName: "Kim",
  status: "paid",
};

const { customerName, status } = order;
```

React props를 받을 때 특히 자주 사용합니다.

```tsx
function OrderRow({ customerName, status }: OrderRowProps) {
  return <div>{customerName}: {status}</div>;
}
```

관련 읽기:

- [구조 분해 할당](https://ko.javascript.info/destructuring-assignment)

## 4. 함수 파라미터 Destructuring

객체 destructuring은 변수 선언뿐 아니라 함수 파라미터에서도 사용할 수 있습니다. React에서는 props를 받을 때 가장 자주 보지만, 일반 JavaScript 함수에서도 인자가 많아질 때 특히 유용합니다.

### 기존 방식: 순서에 의존하는 파라미터

```js
function createOrder(orderNo, customerName, status, totalPrice) {
  return {
    orderNo,
    customerName,
    status,
    totalPrice,
  };
}

const order = createOrder("SO-2026-001", "Kim", "paid", 120000);
```

이 방식은 파라미터가 3개 이상으로 늘어나면 호출부만 보고 각 값의 의미를 알기 어렵습니다. 순서를 바꾸거나 중간 값을 생략해야 할 때도 실수하기 쉽습니다.

### 객체 파라미터 방식

```js
function createOrder({ orderNo, customerName, status, totalPrice }) {
  return {
    orderNo,
    customerName,
    status,
    totalPrice,
  };
}

const order = createOrder({
  orderNo: "SO-2026-001",
  customerName: "Kim",
  status: "paid",
  totalPrice: 120000,
});
```

호출부에 이름이 드러나기 때문에 값의 의미가 명확합니다. 실무에서는 검색 조건, 저장 옵션, 컴포넌트 props처럼 여러 값을 한 번에 넘길 때 이 방식이 더 안전합니다.

### 기본값 지정

파라미터 destructuring에서는 기본값도 함께 지정할 수 있습니다.

```js
function searchOrders({ keyword = "", status = "all", page = 1 }) {
  return {
    keyword,
    status,
    page,
  };
}

searchOrders({ keyword: "Kim" });
```

위 호출에서는 `status`는 `"all"`, `page`는 `1`이 됩니다.

### 나머지 값 받기

필요한 값만 꺼내고 나머지는 별도로 모을 수 있습니다.

```js
function submitOrder({ id, status, ...payload }) {
  return {
    id,
    status,
    payload,
  };
}
```

이 패턴은 API 요청에서 식별자와 실제 전송 데이터를 분리하거나, React 컴포넌트에서 특정 prop만 처리하고 나머지를 하위 요소에 전달할 때 사용합니다.

### TypeScript와 함께 쓰기

```ts
type CreateOrderInput = {
  orderNo: string;
  customerName: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  totalPrice: number;
};

function createOrder({
  orderNo,
  customerName,
  status,
  totalPrice,
}: CreateOrderInput) {
  return {
    orderNo,
    customerName,
    status,
    totalPrice,
  };
}
```

TypeScript를 사용하면 함수가 어떤 이름의 값을 요구하는지 더 명확해집니다. React 컴포넌트 props 타입을 작성하는 방식과 동일한 사고방식입니다.

### 언제 쓰는가

- 파라미터가 3개 이상인 함수
- 선택 파라미터가 많은 함수
- 검색 조건, 저장 옵션, 설정값처럼 이름이 중요한 값
- React 컴포넌트 props
- 나중에 파라미터가 늘어날 가능성이 높은 함수

반대로 값이 하나뿐이거나, `formatCurrency(value)`처럼 의미가 매우 분명한 함수에서는 굳이 객체 파라미터로 만들 필요가 없습니다.

관련 읽기:

- [구조 분해 할당](https://ko.javascript.info/destructuring-assignment)
- [함수](https://ko.javascript.info/function-basics)

## 5. Spread Syntax와 불변 업데이트

React에서는 기존 객체를 직접 수정하는 대신 새 객체를 만들어 상태를 갱신하는 방식이 중요합니다.

```js
const nextOrder = {
  ...order,
  status: "shipped",
};
```

배열도 마찬가지입니다.

```js
const nextOrders = orders.map((order) =>
  order.id === targetId ? { ...order, status: "shipped" } : order
);
```

이 방식은 React가 이전 값과 다음 값을 비교하고 다시 렌더링할 수 있게 돕습니다.

관련 읽기:

- [나머지 매개변수와 전개 구문](https://ko.javascript.info/rest-parameters-spread)
- [참조에 의한 객체 복사](https://ko.javascript.info/object-copy)

## 6. Array Method

React에서 목록 렌더링과 데이터 가공은 배열 메서드에 크게 의존합니다.

```js
const visibleOrders = orders
  .filter((order) => order.status !== "cancelled")
  .map((order) => ({
    id: order.id,
    label: `${order.orderNo} - ${order.customerName}`,
  }));
```

자주 쓰는 메서드:

- `map`: 각 항목을 다른 형태로 변환
- `filter`: 조건에 맞는 항목만 선택
- `find`: 조건에 맞는 첫 항목 찾기
- `some`: 하나라도 조건을 만족하는지 확인
- `every`: 모든 항목이 조건을 만족하는지 확인
- `reduce`: 여러 항목을 하나의 값으로 누적

관련 읽기:

- [배열과 메서드](https://ko.javascript.info/array-methods)
- [Object.keys, values, entries](https://ko.javascript.info/keys-values-entries)

## 7. Module System

현대 프론트엔드 코드는 파일 단위로 나누고 `import`, `export`로 연결합니다.

```ts
export function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}
```

```ts
import { formatCurrency } from "./formatCurrency";
```

파일 분리는 단순 정리가 아니라 의존성 방향과 테스트 가능성을 결정합니다.

관련 읽기:

- [모듈 소개](https://ko.javascript.info/modules-intro)
- [모듈 내보내고 가져오기](https://ko.javascript.info/import-export)
- [동적으로 모듈 가져오기](https://ko.javascript.info/modules-dynamic-imports)

## 8. Promise와 async/await

비동기 코드는 서버 데이터, 파일, 타이머, 브라우저 API를 다룰 때 필요합니다.

```js
async function loadOrders() {
  const response = await fetch("/api/orders");
  const orders = await response.json();
  return orders;
}
```

React에서는 비동기 결과를 state로 저장하고, loading/error/empty 상태를 함께 모델링해야 합니다.

관련 읽기:

- [프라미스와 async, await](https://ko.javascript.info/async)
- [async와 await](https://ko.javascript.info/async-await)
- [fetch](https://ko.javascript.info/fetch)

## 9. TypeScript는 다음 챕터에서 다룬다

React 실무 코드에서는 TypeScript를 거의 함께 사용합니다. 다만 TypeScript는 단순 문법 하나가 아니라 데이터 모델, 함수 계약, 컴포넌트 props, API 응답 구조를 설명하는 별도의 사고방식이므로 다음 챕터에서 따로 다룹니다.

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

이 예제처럼 TypeScript는 런타임 동작을 대신하지 않습니다. 대신 코드를 읽는 사람과 도구가 데이터 구조를 더 정확히 이해하게 만듭니다.

관련 읽기:

- [자바스크립트란?](https://ko.javascript.info/intro)

## 리뷰 질문

- 이 변수는 재할당이 필요한가?
- 이 함수는 값을 변경하는가, 새 값을 반환하는가?
- 함수 파라미터가 많아져서 객체 destructuring으로 바꾸는 편이 더 명확하지 않은가?
- 배열 메서드가 의도를 드러내는가?
- 객체나 배열을 직접 수정하고 있지 않은가?
- 비동기 코드에서 loading/error 상태를 표현할 준비가 되어 있는가?
- 타입이 도메인 의미를 설명하고 있는가?
