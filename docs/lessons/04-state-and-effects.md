# 4강. State and Effects

## 학습 목표

- React에서 state가 필요한 값과 계산으로 충분한 값을 구분한다.
- local state, derived state, server state의 차이를 설명할 수 있다.
- `useState`, `useReducer`, `useRef`의 선택 기준을 이해한다.
- `useEffect`를 이벤트 처리 도구가 아니라 외부 시스템과의 동기화 도구로 이해한다.
- dependency array, cleanup, stale closure가 만드는 문제를 예방한다.

## 1. State는 UI의 기억이다

React에서 state는 렌더링 사이에 보존되어야 하는 값입니다. 사용자의 입력, 선택한 항목, 열림/닫힘 상태처럼 시간이 지나도 기억해야 하는 값이 state가 됩니다.

```tsx
const [keyword, setKeyword] = useState("");
const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
```

state가 바뀌면 React는 컴포넌트를 다시 렌더링하고, UI는 새로운 state를 기준으로 다시 계산됩니다.

## 2. State가 아니어도 되는 값

기존 state나 props로 계산할 수 있는 값은 별도 state로 두지 않는 편이 좋습니다.

```tsx
const visibleOrders = orders.filter((order) =>
  order.customerName.toLowerCase().includes(keyword.toLowerCase())
);
```

`visibleOrders`는 `orders`와 `keyword`로 매번 계산할 수 있으므로 별도 state로 저장하지 않습니다.

피해야 할 형태:

```tsx
const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);
```

이렇게 저장하면 `orders`, `keyword`, `visibleOrders` 사이의 동기화 문제가 생깁니다.

## 3. State의 종류

### Local State

특정 화면이나 컴포넌트 안에서만 의미가 있는 상태입니다.

- 검색어
- 선택된 주문 ID
- 열려 있는 모달
- 입력 중인 폼 값

### Derived State

다른 state나 props에서 계산할 수 있는 값입니다. 보통 state로 저장하지 않고 렌더링 중 계산합니다.

- 필터링된 주문 목록
- 총 주문 금액
- 상태별 주문 개수
- 선택된 주문 객체

### Server State

서버가 원본을 소유하는 데이터입니다.

- 주문 목록
- 사용자 정보
- 상품 목록
- 권한 정보

server state는 loading, error, stale, refetch, cache invalidation 같은 문제가 함께 따라옵니다. 단순 local state처럼 다루면 복잡해집니다.

## 4. State 위치 정하기

state는 그 값을 필요로 하는 가장 가까운 공통 부모에 둡니다.

```text
App
  OrderToolbar
  OrderSummary
  OrderTable
```

`keyword`가 `OrderToolbar`에서 변경되고 `OrderTable`의 목록 계산에 필요하다면, `keyword`는 두 컴포넌트의 공통 부모인 `App`에 두는 것이 자연스럽습니다.

state를 너무 위로 올리면 불필요한 렌더링과 props 전달이 늘어납니다. 반대로 너무 아래에 두면 여러 컴포넌트가 같은 상태를 공유하기 어려워집니다.

## 5. useState, useReducer, useRef

### useState

가장 기본적인 state 도구입니다. 값이 단순하고 업데이트 규칙이 명확할 때 사용합니다.

```tsx
const [status, setStatus] = useState<OrderStatus | "all">("all");
```

### useReducer

상태 전이가 여러 이벤트에 의해 일어나고 규칙이 복잡해질 때 사용합니다.

```tsx
type OrderFilterState = {
  keyword: string;
  status: OrderStatus | "all";
};

type OrderFilterAction =
  | { type: "keywordChanged"; keyword: string }
  | { type: "statusChanged"; status: OrderStatus | "all" }
  | { type: "reset" };

function orderFilterReducer(
  state: OrderFilterState,
  action: OrderFilterAction
): OrderFilterState {
  switch (action.type) {
    case "keywordChanged":
      return { ...state, keyword: action.keyword };
    case "statusChanged":
      return { ...state, status: action.status };
    case "reset":
      return { keyword: "", status: "all" };
  }
}
```

### useRef

렌더링에 직접 영향을 주지 않지만 렌더링 사이에 값을 보존해야 할 때 사용합니다.

```tsx
const searchInputRef = useRef<HTMLInputElement | null>(null);
```

`useRef` 값이 바뀌어도 컴포넌트는 다시 렌더링되지 않습니다. 화면에 보여야 하는 값은 ref가 아니라 state로 관리해야 합니다.

## 6. Effect는 외부 시스템과의 동기화다

`useEffect`는 React 바깥의 시스템과 컴포넌트를 동기화할 때 사용합니다.

대표적인 외부 시스템:

- 브라우저 API: `localStorage`, `document.title`
- 네트워크 요청
- 타이머: `setInterval`, `setTimeout`
- 외부 라이브러리 인스턴스
- WebSocket, event listener

```tsx
useEffect(() => {
  document.title = `Orders: ${visibleOrders.length}`;
}, [visibleOrders.length]);
```

반대로 렌더링 중 계산할 수 있는 값을 만들기 위해 effect를 쓰면 복잡도가 올라갑니다.

## 7. Effect가 필요하지 않은 경우

다음 코드는 피하는 편이 좋습니다.

```tsx
const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
  setTotalPrice(visibleOrders.reduce((sum, order) => sum + order.totalPrice, 0));
}, [visibleOrders]);
```

`totalPrice`는 렌더링 중 계산할 수 있습니다.

```tsx
const totalPrice = visibleOrders.reduce(
  (sum, order) => sum + order.totalPrice,
  0
);
```

effect를 줄일수록 상태 동기화 버그도 줄어듭니다.

## 8. Dependency Array

dependency array는 effect가 어떤 값에 의존하는지 React에 알려줍니다.

```tsx
useEffect(() => {
  localStorage.setItem("orderKeyword", keyword);
}, [keyword]);
```

effect 안에서 사용하는 reactive value는 dependency에 포함되어야 합니다. 빠뜨리면 오래된 값을 참조하는 stale closure 문제가 생길 수 있습니다.

## 9. Cleanup

effect가 외부 리소스를 등록했다면 cleanup으로 해제해야 합니다.

```tsx
useEffect(() => {
  const id = window.setInterval(() => {
    console.log("polling orders");
  }, 5000);

  return () => {
    window.clearInterval(id);
  };
}, []);
```

event listener, timer, subscription, WebSocket 연결은 cleanup이 필요합니다.

## 10. 비동기 Effect

effect 함수 자체를 `async`로 만들지는 않습니다. 내부에서 비동기 함수를 선언하고 호출합니다.

```tsx
useEffect(() => {
  let ignore = false;

  async function loadOrders() {
    const response = await fetch("/api/orders");
    const orders = await response.json();

    if (!ignore) {
      setOrders(orders);
    }
  }

  loadOrders();

  return () => {
    ignore = true;
  };
}, []);
```

cleanup에서 `ignore` 값을 바꾸는 이유는 늦게 도착한 응답이 이미 사라진 컴포넌트의 state를 바꾸는 일을 막기 위해서입니다.

## 11. Form State

사용자가 입력 중인 값은 보통 controlled component로 관리합니다.

```tsx
const [keyword, setKeyword] = useState("");

return (
  <input
    value={keyword}
    onChange={(event) => setKeyword(event.target.value)}
  />
);
```

입력값이 많아지고 업데이트 규칙이 복잡해지면 `useReducer`나 form library를 고려할 수 있습니다.

## 12. 실무 기준

- state는 최소한으로 둔다.
- 계산 가능한 값은 state로 저장하지 않는다.
- state 위치는 필요한 컴포넌트들의 가장 가까운 공통 부모로 정한다.
- effect는 외부 시스템 동기화에만 사용한다.
- effect 안에서 사용하는 값은 dependency에 포함한다.
- 외부 리소스를 등록하면 cleanup을 작성한다.
- server state는 local state와 구분해서 다룬다.

## 관련 읽기

- [React Docs: State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React Docs: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [React Docs: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React Docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Docs: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React Docs: Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)

## 리뷰 질문

- 이 값은 정말 state인가, 계산값인가?
- state가 필요한 위치보다 위에 있거나 아래에 있지 않은가?
- effect가 React 바깥 시스템과 동기화하고 있는가?
- effect가 단순 계산을 위해 쓰이고 있지 않은가?
- dependency array가 effect 안에서 사용하는 값을 모두 포함하는가?
- cleanup이 필요한 외부 리소스를 등록하고 있지 않은가?
