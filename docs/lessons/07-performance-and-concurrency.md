# 7강. Performance and Concurrency

## 학습 목표

- React 성능 문제를 감이 아니라 측정으로 확인한다.
- render cost와 commit cost를 구분한다.
- `memo`, `useMemo`, `useCallback`의 비용과 사용 기준을 이해한다.
- `startTransition`, `useDeferredValue`가 사용자 입력 반응성에 어떤 도움을 주는지 설명할 수 있다.
- virtualization과 code splitting을 적용할 수 있는 문제를 구분한다.

## 성능 최적화의 기본 원칙

최적화는 "빠르게 보이는 코드"를 쓰는 일이 아닙니다. 측정 가능한 병목을 찾고, 병목을 줄인 뒤, 결과를 다시 측정하는 일입니다.

잘못된 최적화는 코드를 더 어렵게 만들고 실제 성능에는 도움이 되지 않을 수 있습니다.

기본 순서:

1. 사용자가 느끼는 문제를 정의한다.
2. React DevTools Profiler나 브라우저 Performance 탭으로 측정한다.
3. 병목이 렌더링, 계산, 네트워크, 번들 크기 중 어디인지 구분한다.
4. 가장 작은 변경을 적용한다.
5. before/after를 비교한다.

## 1. Render와 Commit

React 렌더링은 크게 두 단계로 볼 수 있습니다.

- Render: 컴포넌트 함수를 호출해 다음 UI를 계산
- Commit: 계산된 변경을 실제 DOM에 반영

컴포넌트가 다시 렌더링된다는 말은 항상 DOM이 바뀐다는 뜻이 아닙니다. React가 다음 결과를 계산한 뒤 실제 변경이 필요할 때만 DOM을 갱신합니다.

성능 문제는 다음 위치에서 발생할 수 있습니다.

- 큰 목록을 매번 다시 계산한다.
- 비싼 필터링, 정렬, 집계를 렌더링마다 수행한다.
- 불필요한 props 변경으로 하위 컴포넌트가 많이 다시 렌더링된다.
- 실제 DOM 업데이트가 많다.

## 2. Profiler로 확인하기

React DevTools Profiler는 어떤 컴포넌트가 왜 오래 걸렸는지 확인하는 도구입니다.

확인할 항목:

- 어떤 상호작용에서 느려지는가?
- 어떤 컴포넌트가 자주 렌더링되는가?
- 한 번의 렌더링에 시간이 오래 걸리는 컴포넌트는 무엇인가?
- props가 매번 새 참조로 바뀌고 있는가?

Profiler 결과 없이 모든 컴포넌트에 `memo`를 붙이는 것은 좋은 기준이 아닙니다.

## 3. `memo`

`memo`는 props가 같으면 컴포넌트 재렌더링을 건너뛰게 도와줍니다.

```tsx
const OrderRow = memo(function OrderRow({
  order,
  selected,
  onSelect,
}: OrderRowProps) {
  return (
    <tr onClick={() => onSelect(order.id)}>
      <td>{order.orderNo}</td>
      <td>{order.customerName}</td>
      <td>{selected ? "선택됨" : ""}</td>
    </tr>
  );
});
```

효과가 있으려면 props 참조가 안정적이어야 합니다.

```tsx
<OrderRow
  order={order}
  selected={order.id === selectedOrderId}
  onSelect={handleSelectOrder}
/>
```

부모 렌더링마다 새 객체나 새 함수를 만들면 `memo` 효과가 줄어듭니다.

## 4. `useMemo`

`useMemo`는 비싼 계산 결과를 캐시합니다.

```tsx
const visibleOrders = useMemo(() => {
  return orders
    .filter((order) => order.status === status || status === "all")
    .filter((order) => order.customerName.includes(keyword));
}, [orders, status, keyword]);
```

사용 기준:

- 계산 비용이 실제로 크다.
- 입력값이 자주 바뀌지 않는다.
- 캐시 때문에 코드가 더 명확하거나 성능이 측정된다.

작은 배열이나 단순 계산에는 `useMemo`가 오히려 불필요한 복잡도입니다.

## 5. `useCallback`

`useCallback`은 함수 참조를 안정화합니다.

```tsx
const handleSelectOrder = useCallback((id: string) => {
  setSelectedOrderId(id);
}, []);
```

주요 사용처:

- `memo`로 감싼 하위 컴포넌트에 콜백을 전달할 때
- custom hook dependency로 함수가 들어갈 때
- effect dependency가 불필요하게 바뀌는 것을 막을 때

단독으로 `useCallback`을 붙인다고 렌더링이 빨라지는 것은 아닙니다. 함수 생성 자체는 보통 병목이 아닙니다.

## 6. 큰 목록과 Virtualization

수천 개 행을 한 번에 DOM에 렌더링하면 느려질 수 있습니다. 이 경우 memoization보다 virtualization이 효과적입니다.

virtualization은 화면에 보이는 일부 행만 렌더링합니다.

적합한 경우:

- 행 수가 많다.
- 각 행 높이가 비교적 일정하다.
- 스크롤 기반 목록이다.
- 사용자가 모든 행을 동시에 볼 필요가 없다.

적합하지 않은 경우:

- 목록이 작다.
- 브라우저 기본 검색이나 전체 선택 같은 DOM 전체 접근이 중요하다.
- 행 높이가 크게 달라 구현 복잡도가 높다.

## 7. Concurrency와 사용자 입력

React 18 이후에는 긴 렌더링 작업이 사용자 입력을 막지 않도록 우선순위를 조정하는 API가 있습니다.

`startTransition`은 긴 상태 업데이트를 낮은 우선순위로 표시합니다.

```tsx
const [keyword, setKeyword] = useState("");
const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

function handleKeywordChange(nextKeyword: string) {
  setKeyword(nextKeyword);

  startTransition(() => {
    setQuery(nextKeyword);
  });
}
```

입력값은 즉시 반영하고, 무거운 목록 필터링은 늦춰도 되는 업데이트로 처리할 수 있습니다.

`useDeferredValue`는 값의 반영을 지연시킵니다.

```tsx
const deferredKeyword = useDeferredValue(keyword);

const visibleOrders = useMemo(() => {
  return filterOrders(orders, deferredKeyword);
}, [orders, deferredKeyword]);
```

이 API들은 느린 계산을 없애지 않습니다. 사용자 입력 반응성을 더 좋게 만드는 도구입니다.

## 8. Code Splitting

초기 번들이 크면 첫 로딩이 느려집니다. 자주 사용하지 않는 화면은 lazy loading을 고려합니다.

```tsx
const AdminOrderPage = lazy(() => import("./AdminOrderPage"));
```

```tsx
<Suspense fallback={<p>화면을 불러오는 중입니다.</p>}>
  <AdminOrderPage />
</Suspense>
```

적합한 대상:

- 관리자 화면
- 차트, 에디터, 지도처럼 무거운 라이브러리
- 초기 진입에 필요 없는 라우트

## 9. 리뷰 질문

- 성능 문제가 실제 사용자 행동에서 재현되는가?
- Profiler로 병목 컴포넌트를 확인했는가?
- `memo`가 props 참조 안정성과 함께 쓰이는가?
- `useMemo`가 비싼 계산에만 쓰이는가?
- 큰 목록 문제를 memoization으로만 해결하려고 하지 않는가?
- concurrency API를 성능 제거 도구가 아니라 반응성 개선 도구로 이해하고 있는가?

