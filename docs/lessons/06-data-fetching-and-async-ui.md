# 6강. Data Fetching and Async UI

## 학습 목표

- 서버 상태와 클라이언트 상태의 차이를 설명할 수 있다.
- loading, error, empty, success, stale 상태를 UI로 모델링할 수 있다.
- 요청 취소, race condition, 재시도, optimistic update의 필요성을 이해한다.
- 직접 `fetch`를 사용할 때와 서버 상태 라이브러리를 도입할 때의 기준을 세울 수 있다.

## 서버 상태는 local state와 다르다

검색어, 탭 선택, 모달 열림 여부는 클라이언트가 소유한 state입니다. 반면 주문 목록, 고객 상세, 재고 수량은 서버가 원본을 소유합니다.

서버 상태의 특징:

- 네트워크 지연이 있다.
- 실패할 수 있다.
- 여러 화면에서 같은 데이터를 볼 수 있다.
- 시간이 지나면 오래된 데이터가 된다.
- 저장 후 다시 조회하거나 캐시를 갱신해야 한다.

따라서 서버 상태는 단순히 `useState`에 넣는 것만으로 충분하지 않은 경우가 많습니다.

## 1. Async UI 상태 모델

비동기 UI는 최소한 다음 상태를 표현해야 합니다.

- loading: 요청 중
- error: 요청 실패
- empty: 성공했지만 데이터 없음
- success: 데이터 있음

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error"; message: string };
```

boolean 여러 개를 조합하는 방식은 모순 상태를 만들 수 있습니다.

```ts
const loading = true;
const errorMessage = "실패";
const orders = [];
```

이 상태는 동시에 loading이면서 error입니다. union type으로 모델링하면 가능한 상태를 제한할 수 있습니다.

## 2. 직접 fetch 구현

작은 화면에서는 직접 `fetch`와 `useEffect`로 충분할 수 있습니다.

```tsx
function useOrders() {
  const [state, setState] = useState<AsyncState<Order[]>>({ status: "idle" });

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        setState({ status: "loading" });

        const response = await fetch("/api/orders");

        if (!response.ok) {
          throw new Error("주문 목록을 불러오지 못했습니다.");
        }

        const orders = (await response.json()) as Order[];

        if (ignore) {
          return;
        }

        setState(
          orders.length === 0
            ? { status: "empty" }
            : { status: "success", data: orders }
        );
      } catch (error) {
        if (!ignore) {
          setState({
            status: "error",
            message:
              error instanceof Error ? error.message : "알 수 없는 오류입니다.",
          });
        }
      }
    }

    loadOrders();

    return () => {
      ignore = true;
    };
  }, []);

  return state;
}
```

cleanup은 컴포넌트가 사라진 뒤 오래된 요청 결과가 state를 바꾸는 것을 막습니다.

## 3. Race Condition

사용자가 검색어를 빠르게 바꾸면 여러 요청이 동시에 진행될 수 있습니다.

```text
검색어 A 요청 시작
검색어 B 요청 시작
검색어 B 응답 도착
검색어 A 응답 도착
```

마지막 응답이 항상 최신 요청이라는 보장은 없습니다. 이런 경우 오래된 응답을 무시하거나 요청을 취소해야 합니다.

```tsx
useEffect(() => {
  const controller = new AbortController();

  async function searchOrders() {
    const response = await fetch(`/api/orders?keyword=${keyword}`, {
      signal: controller.signal,
    });

    const orders = (await response.json()) as Order[];
    setOrders(orders);
  }

  searchOrders().catch((error) => {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    setErrorMessage("검색에 실패했습니다.");
  });

  return () => {
    controller.abort();
  };
}, [keyword]);
```

## 4. Stale 데이터

서버 상태는 성공적으로 불러와도 시간이 지나면 오래될 수 있습니다. 예를 들어 주문 상태가 다른 사용자의 작업으로 변경될 수 있습니다.

고려할 정책:

- 화면 진입 시 항상 새로 조회할 것인가?
- 일정 시간 동안 캐시를 신뢰할 것인가?
- 창 포커스가 돌아오면 다시 조회할 것인가?
- 저장 성공 후 목록을 다시 조회할 것인가?
- 직접 캐시를 갱신할 것인가?

이 정책이 화면마다 흩어지면 유지보수가 어려워집니다.

## 5. Optimistic Update

optimistic update는 서버 성공을 기다리기 전에 UI를 먼저 바꾸는 방식입니다.

```tsx
async function changeStatus(id: string, status: OrderStatus) {
  const previousOrders = orders;

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === id ? { ...order, status } : order
    )
  );

  try {
    await updateOrderStatus({ id, status });
  } catch {
    setOrders(previousOrders);
    setErrorMessage("상태 변경에 실패해 이전 값으로 되돌렸습니다.");
  }
}
```

장점은 반응성이 좋다는 것입니다. 단점은 실패 시 rollback 정책이 필요하다는 것입니다.

## 6. 서버 상태 라이브러리 도입 기준

직접 `fetch`로 시작해도 됩니다. 하지만 다음 요구가 반복되면 TanStack Query 같은 서버 상태 라이브러리 도입을 검토합니다.

- 같은 데이터를 여러 화면에서 공유한다.
- cache, stale time, refetch 정책이 필요하다.
- mutation 후 invalidation이 필요하다.
- pagination, infinite scroll이 있다.
- retry, background refetch가 필요하다.
- loading/error 처리가 여러 화면에 반복된다.

라이브러리는 fetch를 대체하는 것이 아니라 서버 상태 정책을 표준화합니다.

## 7. UI 상태 표현

비동기 상태는 데이터만 처리하면 끝이 아닙니다. 사용자가 무엇을 볼지 결정해야 합니다.

```tsx
if (state.status === "loading") {
  return <p>주문 목록을 불러오는 중입니다.</p>;
}

if (state.status === "error") {
  return <ErrorMessage message={state.message} onRetry={reload} />;
}

if (state.status === "empty") {
  return <EmptyState message="표시할 주문이 없습니다." />;
}

return <OrderTable orders={state.data} />;
```

error와 empty를 같은 화면으로 처리하면 사용자는 실패와 정상 빈 결과를 구분할 수 없습니다.

## 8. 리뷰 질문

- 이 데이터의 원본 소유자는 서버인가, 클라이언트인가?
- 실패와 빈 결과가 화면에서 구분되는가?
- 오래된 응답이 최신 화면을 덮어쓸 가능성은 없는가?
- 저장 성공 후 어떤 데이터를 다시 조회해야 하는가?
- optimistic update 실패 시 rollback 정책이 있는가?
- 직접 구현보다 서버 상태 라이브러리가 정책을 더 명확히 만들지 않는가?

