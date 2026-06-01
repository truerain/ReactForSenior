# 2강. React Mental Model

## 학습 목표

- React를 템플릿 엔진이 아니라 렌더링 시스템으로 이해한다.
- 컴포넌트 함수 호출과 화면 반영이 같은 일이 아님을 구분한다.
- props, state, key가 component identity에 미치는 영향을 설명할 수 있다.

## 핵심 개념

### 1. UI는 상태의 결과다

React에서 UI는 현재 상태를 입력으로 받아 계산한 결과입니다. 중요한 점은 DOM을 직접 바꾸는 절차를 작성하는 것이 아니라, 주어진 상태에서 어떤 UI가 보여야 하는지를 선언한다는 것입니다.

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}
```

이 컴포넌트는 `name`이 바뀔 때마다 다른 UI 결과를 계산합니다. React는 이전 결과와 새 결과를 비교해 필요한 DOM 변경만 반영합니다.

### 2. 렌더링은 DOM 업데이트와 다르다

컴포넌트가 렌더링된다는 말은 컴포넌트 함수가 호출되어 React element tree를 다시 계산한다는 뜻입니다. 실제 DOM 반영은 commit 단계에서 일어납니다.

- render: 다음 UI가 무엇인지 계산
- commit: 계산 결과를 실제 환경에 반영

이 차이를 이해하면 "왜 함수가 여러 번 호출되는가"와 "왜 화면은 한 번만 바뀌는가"를 분리해서 볼 수 있습니다.

### 3. State는 컴포넌트의 기억이다

`useState`는 렌더링 사이에 값을 보존합니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}
```

state 업데이트는 즉시 변수 값을 바꾸는 명령이 아니라, React에 다음 렌더링을 요청하는 일입니다.

### 4. Key는 목록 성능 옵션이 아니라 정체성 힌트다

`key`는 React가 이전 컴포넌트와 다음 컴포넌트를 같은 대상으로 볼지 판단하는 기준입니다. 잘못된 key는 입력값 유실, 포커스 이동, 잘못된 애니메이션 같은 버그를 만들 수 있습니다.

```tsx
items.map((item) => <TodoItem key={item.id} item={item} />);
```

배열 index를 key로 쓰는 것은 항목의 순서가 절대 바뀌지 않는 경우에만 안전합니다.

## 시니어 관점의 질문

- 이 상태는 정말 local state인가, 서버 상태인가?
- 컴포넌트 재사용보다 변경 격리가 더 중요한 상황인가?
- key 선택이 사용자 입력, 애니메이션, focus state에 영향을 주는가?
- 렌더링 횟수를 줄이려는 시도가 실제 사용자 경험을 개선하는가?

## 실습

제품 주문 목록 UI를 다음 조건으로 구현합니다.

- 주문 목록, 상태 필터, 검색어 입력을 가진다.
- 필터와 검색어는 local state로 관리한다.
- 주문 항목의 key는 안정적인 식별자를 사용한다.
- 컴포넌트를 최소 3개 이상으로 분리한다.

## 리뷰 체크리스트

- 상태가 필요한 위치보다 위로 올라가 있지 않은가
- props 이름이 도메인 의도를 드러내는가
- key가 데이터의 정체성을 반영하는가
- 렌더링과 effect를 혼동한 코드가 없는가
