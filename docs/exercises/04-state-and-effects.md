# 실습 4. 주문 관리 앱에 State와 Effects 적용하기

## 목표

Phase 3에서 만든 주문 관리 미니 React 앱을 확장해 state 설계와 effect 사용 기준을 연습합니다.

- 검색어, 상태 필터, 선택 주문을 local state로 관리한다.
- 필터링된 목록, 총 금액, 선택된 주문은 derived value로 계산한다.
- 필터 상태를 `localStorage`에 저장하고 다시 불러온다.
- mock API 로딩을 구현해 loading, error, success 상태를 다룬다.
- effect가 필요한 코드와 필요하지 않은 코드를 구분한다.

## 시작 조건

Phase 3 실습 결과물을 사용합니다.

```powershell
cd my-react-app
pnpm dev
```

npm을 사용하는 경우:

```powershell
npm run dev
```

## 1. 주문 데이터를 state로 옮기기

Phase 3에서는 `orders`를 상수로 사용했습니다. 이번 실습에서는 서버에서 불러온 데이터처럼 다루기 위해 state로 옮깁니다.

```tsx
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
```

## 2. mock API 만들기

실제 서버 대신 Promise를 반환하는 함수를 만듭니다.

```tsx
function fetchOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve([
        { id: "ord_001", orderNo: "SO-2026-001", customerName: "Kim", status: "pending", totalPrice: 120000 },
        { id: "ord_002", orderNo: "SO-2026-002", customerName: "Lee", status: "paid", totalPrice: 89000 },
        { id: "ord_003", orderNo: "SO-2026-003", customerName: "Park", status: "shipped", totalPrice: 240000 },
        { id: "ord_004", orderNo: "SO-2026-004", customerName: "Choi", status: "cancelled", totalPrice: 56000 },
      ]);
    }, 700);
  });
}
```

## 3. Effect로 주문 목록 불러오기

컴포넌트가 처음 렌더링된 뒤 주문 목록을 불러옵니다.

```tsx
useEffect(() => {
  let ignore = false;

  async function loadOrders() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const nextOrders = await fetchOrders();

      if (!ignore) {
        setOrders(nextOrders);
      }
    } catch {
      if (!ignore) {
        setErrorMessage("주문 목록을 불러오지 못했습니다.");
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  }

  loadOrders();

  return () => {
    ignore = true;
  };
}, []);
```

완료 조건:

- 로딩 중에는 `불러오는 중...` 메시지를 표시한다.
- 오류가 있으면 오류 메시지를 표시한다.
- 데이터 로딩 후 주문 목록을 표시한다.

## 4. 필터 상태 저장하기

검색어와 상태 필터를 `localStorage`에 저장합니다.

```tsx
const [keyword, setKeyword] = useState(() => {
  return localStorage.getItem("orderKeyword") ?? "";
});

const [status, setStatus] = useState<OrderStatus | "all">(() => {
  const savedStatus = localStorage.getItem("orderStatus");

  if (
    savedStatus === "pending" ||
    savedStatus === "paid" ||
    savedStatus === "shipped" ||
    savedStatus === "cancelled" ||
    savedStatus === "all"
  ) {
    return savedStatus;
  }

  return "all";
});
```

값이 바뀔 때 저장합니다.

```tsx
useEffect(() => {
  localStorage.setItem("orderKeyword", keyword);
}, [keyword]);

useEffect(() => {
  localStorage.setItem("orderStatus", status);
}, [status]);
```

브라우저를 새로고침해도 필터 값이 유지되어야 합니다.

## 5. Derived Value 정리하기

다음 값은 state로 만들지 않고 계산합니다.

```tsx
const visibleOrders = orders.filter((order) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const matchesStatus = status === "all" || order.status === status;
  const matchesKeyword =
    normalizedKeyword === "" ||
    order.orderNo.toLowerCase().includes(normalizedKeyword) ||
    order.customerName.toLowerCase().includes(normalizedKeyword);

  return matchesStatus && matchesKeyword;
});

const totalPrice = visibleOrders.reduce(
  (sum, order) => sum + order.totalPrice,
  0
);

const selectedOrder =
  orders.find((order) => order.id === selectedOrderId) ?? null;
```

완료 조건:

- `visibleOrders`, `totalPrice`, `selectedOrder`를 별도 state로 저장하지 않는다.
- 검색어와 필터가 바뀌면 값이 자연스럽게 다시 계산된다.

## 6. 선택된 주문 상세 표시

주문 행을 클릭하면 선택된 주문의 상세 정보를 화면 한쪽에 표시합니다.

표시 항목:

- 주문 번호
- 고객명
- 주문 상태
- 주문 금액

선택된 주문이 없으면 `선택된 주문이 없습니다.`를 표시합니다.

## 7. 상태 변경 기능 추가

선택된 주문의 상태를 변경하는 버튼을 추가합니다.

요구사항:

- `paid`, `shipped`, `cancelled` 버튼을 제공한다.
- 상태 변경 시 원본 객체를 직접 수정하지 않는다.
- `setOrders`의 함수형 업데이트를 사용한다.

```tsx
function changeOrderStatus(id: string, status: OrderStatus) {
  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === id ? { ...order, status } : order
    )
  );
}
```

## 8. Effect 제거 리팩터링

다음과 같은 코드를 작성했다면 제거합니다.

```tsx
const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
  setTotalPrice(visibleOrders.reduce((sum, order) => sum + order.totalPrice, 0));
}, [visibleOrders]);
```

`totalPrice`는 state가 아니라 derived value로 계산합니다.

## 완료 기준

- 주문 목록이 mock API를 통해 비동기로 로딩된다.
- loading, error, success 상태가 화면에 표현된다.
- 검색어와 상태 필터가 새로고침 후에도 유지된다.
- 필터링된 목록과 총 금액은 derived value로 계산된다.
- 선택된 주문 상세가 표시된다.
- 주문 상태 변경이 불변 업데이트로 동작한다.
- 불필요한 effect가 없다.

## 리뷰 질문

- `orders`는 local state인가, server state인가?
- `visibleOrders`를 state로 만들지 않은 이유는 무엇인가?
- `localStorage` 동기화에는 왜 effect가 필요한가?
- mock API 호출 effect에 cleanup이 필요한 이유는 무엇인가?
- 상태 변경 함수가 기존 배열과 객체를 직접 수정하지 않는가?

## 확장 과제

- `useReducer`로 필터 상태를 관리한다.
- `localStorage` 저장 effect를 하나로 합친다.
- mock API 실패 버튼을 만들어 error state를 확인한다.
- `document.title`에 현재 보이는 주문 수를 표시한다.
