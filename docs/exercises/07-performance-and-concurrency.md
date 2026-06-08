# 실습 7. 주문 목록 성능 측정과 최적화

## 목표

큰 주문 목록을 사용해 렌더링 병목을 재현하고, Profiler 측정 결과를 기준으로 최적화합니다. `memo`, `useMemo`, `useCallback`, `useDeferredValue`, `useTransition`을 무작정 적용하지 않고 필요한 지점에만 사용합니다.

## 시작 조건

Phase 6 실습 결과물을 사용합니다.

```powershell
cd my-react-app
pnpm dev
```

## 요구사항

- 5,000건 이상의 mock 주문 데이터를 만든다.
- 검색 입력 시 느려지는 지점을 재현한다.
- React DevTools Profiler로 before 결과를 기록한다.
- 필요한 계산에 `useMemo`를 적용한다.
- 행 컴포넌트에 `memo`를 적용하고 콜백 참조를 안정화한다.
- `useDeferredValue` 또는 `useTransition`으로 입력 반응성을 개선한다.
- before/after 결과를 짧은 메모로 남긴다.

## 1. 큰 데이터 만들기

```ts
function createMockOrders(count: number): Order[] {
  const statuses: OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

  return Array.from({ length: count }, (_, index) => {
    const orderNumber = index + 1;

    return {
      id: `ord_${String(orderNumber).padStart(5, "0")}`,
      orderNo: `SO-2026-${String(orderNumber).padStart(5, "0")}`,
      customerName: `Customer ${orderNumber}`,
      status: statuses[index % statuses.length],
      totalPrice: 10000 + index * 100,
    };
  });
}
```

mock API의 기본 데이터를 `createMockOrders(5000)`로 바꿉니다.

## 2. 병목 재현

검색 입력에 한 글자씩 입력하며 화면 반응을 확인합니다.

확인할 항목:

- 입력 글자가 늦게 표시되는가?
- 목록 렌더링이 눈에 띄게 느린가?
- Profiler에서 어떤 컴포넌트가 오래 걸리는가?

Profiler 기록 메모 예:

```md
## Before

- 행동: 검색어 입력
- 데이터: 주문 5,000건
- 느린 컴포넌트: OrderTable, OrderRow
- 관찰: 입력마다 전체 목록 필터링과 행 렌더링 발생
```

## 3. 계산 최적화

필터링과 합계 계산이 비싸다면 `useMemo`를 적용합니다.

```tsx
const visibleOrders = useMemo(() => {
  return filterOrders({ orders, keyword: deferredKeyword, status });
}, [orders, deferredKeyword, status]);

const totalPrice = useMemo(() => {
  return getTotalPrice(visibleOrders);
}, [visibleOrders]);
```

작은 계산까지 모두 `useMemo`로 감싸지 않습니다. Profiler에서 의미 있는 비용이 보이는 계산에만 적용합니다.

## 4. 행 렌더링 최적화

`OrderRow`를 `memo`로 감쌉니다.

```tsx
export const OrderRow = memo(function OrderRow({
  order,
  selected,
  onSelectOrder,
}: OrderRowProps) {
  return (
    <tr onClick={() => onSelectOrder(order.id)}>
      <td>{order.orderNo}</td>
      <td>{order.customerName}</td>
      <td>{order.status}</td>
    </tr>
  );
});
```

부모의 콜백 참조를 안정화합니다.

```tsx
const handleSelectOrder = useCallback((id: string) => {
  setSelectedOrderId(id);
}, []);
```

`memo` 적용 후에도 props가 매번 새 객체로 만들어지면 효과가 줄어듭니다.

## 5. 입력 반응성 개선

`useDeferredValue`를 사용해 입력값과 무거운 목록 계산에 쓰는 값을 분리합니다.

```tsx
const [keyword, setKeyword] = useState("");
const deferredKeyword = useDeferredValue(keyword);
```

입력 필드는 `keyword`를 사용하고, 필터링은 `deferredKeyword`를 사용합니다.

```tsx
<OrderFilterPanel
  keyword={keyword}
  onKeywordChange={setKeyword}
  status={status}
  onStatusChange={setStatus}
/>
```

`useTransition`으로 구현해도 됩니다.

```tsx
const [isPending, startTransition] = useTransition();

function handleKeywordChange(nextKeyword: string) {
  setInputKeyword(nextKeyword);

  startTransition(() => {
    setKeyword(nextKeyword);
  });
}
```

## 6. After 측정

최적화 후 다시 Profiler를 기록합니다.

```md
## After

- 적용: useMemo, memo(OrderRow), useCallback, useDeferredValue
- 개선: 입력 표시 지연 감소
- 남은 문제: DOM 행 수가 많아 스크롤과 초기 렌더링 비용이 큼
- 다음 후보: virtualization
```

## 완료 기준

- Profiler before/after 기록이 있다.
- 최적화가 적용된 이유를 코드와 메모로 설명할 수 있다.
- `useMemo`, `useCallback`, `memo`가 필요한 지점에만 적용되어 있다.
- 입력 반응성이 개선된다.
- 5,000개 DOM 행 자체가 남기는 한계를 설명할 수 있다.

## 리뷰 질문

- 실제로 측정한 병목을 해결했는가?
- 최적화 때문에 코드 가독성이 과도하게 나빠지지 않았는가?
- memoization보다 virtualization이 더 적합한 지점은 없는가?
- concurrency API를 계산 제거 도구로 오해하지 않았는가?

