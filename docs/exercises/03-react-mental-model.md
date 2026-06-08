# 실습 3. 주문 관리 미니 React 앱 만들기

## 목표

Vite로 생성한 React + TypeScript 프로젝트에서 작은 주문 관리 앱을 직접 구현합니다. 이 실습은 React 사고 모델을 코드로 체감하는 데 초점을 둡니다.

- UI를 컴포넌트로 분해한다.
- props로 데이터를 아래로 전달한다.
- state로 사용자 입력과 선택 상태를 관리한다.
- state가 바뀔 때 UI가 다시 계산되는 흐름을 확인한다.
- 목록 렌더링에서 안정적인 key를 사용한다.
- DOM을 직접 조작하지 않고 React state로 화면을 갱신한다.

## 만들 앱

주문 목록을 조회하고, 상태 필터와 검색어로 목록을 좁혀 보는 미니 앱을 만듭니다.

기능:

- 주문 목록 표시
- 주문 상태 필터
- 고객명 또는 주문 번호 검색
- 상태별 주문 개수 표시
- 현재 보이는 주문의 총 금액 표시
- 주문 행 클릭 시 선택 상태 표시

## 1. 프로젝트 준비

학습 준비 단계에서 만든 Vite 프로젝트를 사용합니다.

```powershell
cd my-react-app
pnpm dev
```

npm을 사용하는 경우:

```powershell
cd my-react-app
npm run dev
```

브라우저에서 개발 서버 주소를 엽니다.

```text
http://localhost:5173/
```

## 2. 기본 타입과 데이터 만들기

`src/App.tsx`를 열고 다음 타입과 데이터를 준비합니다.

```tsx
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
  { id: "ord_005", orderNo: "SO-2026-005", customerName: "Jung", status: "paid", totalPrice: 310000 },
];
```

## 3. 컴포넌트 구조

최소한 다음 컴포넌트로 분리합니다.

```text
App
  OrderToolbar
  OrderSummary
  OrderTable
    OrderRow
```

각 컴포넌트의 책임:

- `App`: state 소유, 필터링 계산, 전체 조립
- `OrderToolbar`: 검색어와 상태 필터 입력
- `OrderSummary`: 상태별 개수와 총 금액 표시
- `OrderTable`: 주문 목록 렌더링
- `OrderRow`: 주문 한 행 렌더링

## 4. 구현 조건

`App`에서 다음 state를 관리합니다.

```tsx
const [keyword, setKeyword] = useState("");
const [status, setStatus] = useState<OrderStatus | "all">("all");
const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
```

필터링 결과는 state로 따로 저장하지 말고 렌더링 중 계산합니다.

```tsx
const visibleOrders = orders.filter((order) => {
  const matchesStatus = status === "all" || order.status === status;
  const matchesKeyword =
    order.orderNo.toLowerCase().includes(keyword.toLowerCase()) ||
    order.customerName.toLowerCase().includes(keyword.toLowerCase());

  return matchesStatus && matchesKeyword;
});
```

목록 렌더링에서는 index가 아니라 `order.id`를 key로 사용합니다.

```tsx
{visibleOrders.map((order) => (
  <OrderRow
    key={order.id}
    order={order}
    selected={order.id === selectedOrderId}
    onSelect={setSelectedOrderId}
  />
))}
```

## 5. 컴포넌트 props 예시

```tsx
type OrderToolbarProps = {
  keyword: string;
  status: OrderStatus | "all";
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: OrderStatus | "all") => void;
};
```

```tsx
type OrderRowProps = {
  order: Order;
  selected: boolean;
  onSelect: (id: string) => void;
};
```

props 이름은 컴포넌트의 의도를 드러내야 합니다. `setValue`, `data`, `item`처럼 너무 일반적인 이름보다 `onKeywordChange`, `order`, `selected`처럼 역할이 보이는 이름을 사용합니다.

## 6. 완료 기준

- Vite 개발 서버에서 앱이 정상 실행된다.
- 검색어 입력 시 주문 목록이 다시 계산된다.
- 상태 필터 변경 시 주문 목록이 다시 계산된다.
- 주문 행 클릭 시 선택된 행이 시각적으로 구분된다.
- 상태별 개수와 현재 보이는 주문의 총 금액이 표시된다.
- 목록 key로 `order.id`를 사용한다.
- `document.querySelector`, 직접 DOM 수정, 전역 변수로 화면 상태 관리 등을 사용하지 않는다.

## 7. 리뷰 질문

- 어떤 state가 `App`에 있어야 하고, 어떤 값은 계산값으로 충분한가?
- props는 데이터와 이벤트를 명확히 구분하고 있는가?
- 컴포넌트 분리가 재사용 때문인가, 변경 격리 때문인가?
- key가 데이터의 정체성을 반영하는가?
- 사용자의 입력이 state 변경으로 이어지고, 그 state가 UI를 다시 계산하게 만드는가?

## 8. 확장 과제

- 주문 상태를 변경하는 버튼을 추가한다.
- 주문 상태 변경 시 원본 배열을 직접 수정하지 않고 새 배열을 만든다.
- 선택된 주문의 상세 영역을 추가한다.
- 검색어가 없고 필터가 `all`일 때 전체 목록을 보여주는지 확인한다.
- 필터 결과가 없을 때 empty state를 표시한다.

## 콘솔 출력 확인

UI가 다시 그려지는 흐름을 브라우저 개발자 도구 콘솔에서 확인합니다. `App` 컴포넌트 안에서 `visibleOrders`, 상태별 개수, 총 금액을 계산한 뒤 다음 로그를 추가합니다.

```tsx
console.log("render App", {
  keyword,
  status,
  selectedOrderId,
  visibleOrders,
  totalPrice,
  statusCounts,
});
```

행 선택 이벤트도 콘솔로 확인합니다.

```tsx
function handleSelectOrder(id: string) {
  console.log("select order", id);
  setSelectedOrderId(id);
}
```

`OrderRow`에는 `onSelect={handleSelectOrder}`를 전달합니다.

```tsx
<OrderRow
  key={order.id}
  order={order}
  selected={order.id === selectedOrderId}
  onSelect={handleSelectOrder}
/>
```

React 개발 모드에서 `StrictMode`가 켜져 있으면 렌더 로그가 두 번 보일 수 있습니다. 이 경우 같은 상태를 검증하는 중복 로그로 봅니다.
