# 8강. Testing and Quality

## 학습 목표

- React 테스트를 구현 세부사항이 아니라 사용자 행동 중심으로 작성한다.
- unit, integration, E2E 테스트의 경계를 설명할 수 있다.
- 테스트에서 무엇을 mock하고 무엇을 실제로 사용할지 판단할 수 있다.
- accessibility, typecheck, lint, CI를 품질 게이트로 연결할 수 있다.

## 테스트의 목적

테스트는 코드 줄 수를 늘리기 위한 활동이 아닙니다. 사용자가 기대하는 행동이 계속 보장되는지 확인하는 자동화된 피드백입니다.

나쁜 테스트:

- 컴포넌트 내부 state 이름을 검증한다.
- CSS class 이름만 검증한다.
- 구현 리팩터링 때마다 깨진다.

좋은 테스트:

- 사용자가 보는 텍스트와 역할을 기준으로 찾는다.
- 사용자가 하는 클릭, 입력, 제출을 재현한다.
- 성공, 실패, 빈 상태를 검증한다.

## 1. 테스트 피라미드

React 앱에서는 대략 다음 계층을 구분합니다.

- Unit: 순수 함수, reducer, formatter
- Component/Integration: 여러 컴포넌트가 함께 동작하는 화면 일부
- E2E: 실제 브라우저에서 핵심 사용자 플로우 검증

예:

- `formatCurrency(120000)`은 unit 테스트
- 주문 검색과 필터링 UI는 component 테스트
- 로그인 후 주문을 조회하고 상태를 변경하는 흐름은 E2E 테스트

모든 것을 E2E로만 검증하면 느리고 불안정합니다. 모든 것을 unit으로만 검증하면 실제 사용자 흐름을 놓칩니다.

## 2. Testing Library 사고방식

Testing Library는 사용자가 접근하는 방식에 가까운 쿼리를 권장합니다.

```tsx
screen.getByRole("button", { name: "검색" });
screen.getByLabelText("검색어");
screen.getByText("SO-2026-001");
```

피해야 할 방식:

```tsx
container.querySelector(".search-button");
```

class 이름은 구현 세부사항입니다. 버튼의 역할과 이름은 사용자와 보조기술이 인식하는 정보입니다.

## 3. 사용자 이벤트

클릭과 입력은 `userEvent`로 재현합니다.

```tsx
await user.type(screen.getByLabelText("검색어"), "Kim");
await user.click(screen.getByRole("button", { name: "검색" }));

expect(screen.getByText("Kim")).toBeInTheDocument();
```

테스트는 "함수를 호출했는가"보다 "화면이 어떻게 바뀌었는가"를 확인해야 합니다.

## 4. 비동기 테스트

서버 데이터를 불러오는 화면은 비동기로 검증합니다.

```tsx
render(<OrderPage />);

expect(screen.getByText("주문 목록을 불러오는 중입니다.")).toBeInTheDocument();

expect(await screen.findByText("SO-2026-001")).toBeInTheDocument();
```

`findBy`는 요소가 나타날 때까지 기다립니다. loading, success, error 상태를 각각 테스트해야 합니다.

## 5. Mocking 전략

mock은 외부 경계를 대체할 때 사용합니다.

mock하기 좋은 대상:

- 네트워크 API
- 시간
- 브라우저 저장소
- analytics
- 권한 API

mock을 피해야 할 대상:

- 테스트 대상 컴포넌트 내부 함수
- 사용자에게 중요한 실제 렌더링 결과
- 순수 함수의 실제 계산

네트워크는 MSW 같은 도구로 브라우저 관점에서 mock하는 방식이 유지보수에 유리합니다. 호출 함수 자체를 mock하면 실제 요청 경로나 응답 처리 흐름을 놓칠 수 있습니다.

## 6. 접근성은 테스트 가능성이다

접근성이 좋은 UI는 테스트하기도 쉽습니다.

```tsx
<label htmlFor="keyword">검색어</label>
<input id="keyword" value={keyword} onChange={handleChange} />
```

이렇게 작성하면 테스트에서 label로 입력을 찾을 수 있습니다.

```tsx
screen.getByLabelText("검색어");
```

버튼과 링크는 실제 HTML 의미에 맞는 요소를 사용합니다. 클릭 가능한 `div`는 키보드 접근성과 테스트 모두를 어렵게 만듭니다.

## 7. Error Boundary와 Observability

테스트는 알려진 흐름을 검증합니다. 운영에서는 예상하지 못한 오류도 발생합니다.

React 앱에는 다음 품질 장치가 필요합니다.

- Error Boundary
- API 오류 로깅
- 사용자 행동 추적
- 성능 측정
- 배포 버전 식별

Error Boundary는 렌더링 중 발생한 오류로 전체 앱이 빈 화면이 되는 것을 막습니다.

```tsx
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>화면을 표시하는 중 문제가 발생했습니다.</p>;
    }

    return this.props.children;
  }
}
```

## 8. 품질 게이트

팀 프로젝트에서는 개인의 주의력보다 자동화된 품질 게이트가 더 신뢰할 수 있습니다.

기본 게이트:

- `typecheck`
- `lint`
- `test`
- `build`

Pull Request 기준:

- 타입 오류가 없어야 한다.
- lint 오류가 없어야 한다.
- 핵심 테스트가 통과해야 한다.
- 접근성 위반이 새로 추가되지 않아야 한다.
- 번들 크기나 성능 지표가 기준을 크게 넘지 않아야 한다.

## 9. 리뷰 질문

- 이 테스트는 사용자 행동을 검증하는가?
- 구현 리팩터링을 해도 깨지지 않을 테스트인가?
- loading, error, empty 상태가 모두 검증되는가?
- mock이 외부 경계에만 적용되는가?
- 접근 가능한 이름과 역할로 요소를 찾을 수 있는가?
- CI에서 타입, lint, test, build가 자동으로 실행되는가?

