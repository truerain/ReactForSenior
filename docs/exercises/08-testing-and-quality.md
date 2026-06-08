# 실습 8. 주문 관리 앱 테스트와 품질 게이트

## 목표

주문 관리 앱의 핵심 사용자 흐름을 테스트로 검증합니다. 구현 세부사항이 아니라 사용자가 보는 화면과 행동을 기준으로 테스트를 작성합니다.

## 시작 조건

Phase 7 실습 결과물을 사용합니다. 테스트 도구가 없다면 Vite 프로젝트에 Vitest와 Testing Library를 추가합니다.

```powershell
pnpm add -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

npm을 사용하는 경우:

```powershell
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

## 요구사항

- 테스트 환경을 설정한다.
- 주문 목록 loading, success, empty, error 상태를 테스트한다.
- 검색어 입력과 상태 필터 변경을 사용자 행동으로 테스트한다.
- 주문 행 선택과 상세 표시를 테스트한다.
- 상태 변경 버튼 클릭을 테스트한다.
- 테스트가 class selector나 내부 state에 의존하지 않게 한다.

## 1. Vitest 설정

`vite.config.ts`에 테스트 설정을 추가합니다.

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

`src/test/setup.ts`를 만듭니다.

```ts
import "@testing-library/jest-dom/vitest";
```

`package.json`에 script를 추가합니다.

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

## 2. 첫 테스트 작성

`src/features/orders/OrderPage.test.tsx`를 만듭니다.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderPage } from "./OrderPage";

describe("OrderPage", () => {
  it("주문 목록을 불러온 뒤 주문 번호를 표시한다", async () => {
    render(<OrderPage />);

    expect(screen.getByText("주문 목록을 불러오는 중입니다.")).toBeInTheDocument();

    expect(await screen.findByText("SO-2026-001")).toBeInTheDocument();
  });
});
```

## 3. 검색 테스트

```tsx
import userEvent from "@testing-library/user-event";

it("검색어로 주문 목록을 필터링한다", async () => {
  const user = userEvent.setup();

  render(<OrderPage />);

  await screen.findByText("SO-2026-001");

  await user.type(screen.getByLabelText("검색어"), "Kim");

  expect(screen.getByText("Kim")).toBeInTheDocument();
  expect(screen.queryByText("Lee")).not.toBeInTheDocument();
});
```

입력에 label이 없다면 테스트 전에 접근 가능한 label을 먼저 추가합니다.

## 4. 상태 필터 테스트

```tsx
it("상태 필터로 주문 목록을 좁힌다", async () => {
  const user = userEvent.setup();

  render(<OrderPage />);

  await screen.findByText("SO-2026-001");

  await user.selectOptions(screen.getByLabelText("주문 상태"), "paid");

  expect(screen.getByText("paid")).toBeInTheDocument();
  expect(screen.queryByText("pending")).not.toBeInTheDocument();
});
```

## 5. 선택 상세 테스트

```tsx
it("주문 행을 선택하면 상세 정보를 표시한다", async () => {
  const user = userEvent.setup();

  render(<OrderPage />);

  await user.click(await screen.findByText("SO-2026-001"));

  expect(screen.getByRole("heading", { name: "주문 상세" })).toBeInTheDocument();
  expect(screen.getByText("Kim")).toBeInTheDocument();
});
```

## 6. Error와 Empty 테스트

mock API가 성공만 반환하면 error와 empty를 테스트하기 어렵습니다. API 모듈에 테스트에서 제어할 수 있는 mock 함수를 두거나 MSW를 사용합니다.

테스트해야 할 내용:

- error 메시지가 표시된다.
- 다시 시도 버튼이 있다.
- empty 메시지가 표시된다.
- error와 empty 메시지가 서로 다르다.

## 7. 품질 명령 실행

```powershell
pnpm test:run
pnpm typecheck
pnpm build
```

npm을 사용하는 경우:

```powershell
npm run test:run
npm run typecheck
npm run build
```

## 완료 기준

- 핵심 사용자 흐름 테스트가 4개 이상 있다.
- 테스트가 `getByRole`, `getByLabelText`, `findByText` 같은 사용자 중심 쿼리를 사용한다.
- loading, success, empty, error 중 최소 3가지 상태가 검증된다.
- 테스트가 내부 state 변수명이나 CSS class에 의존하지 않는다.
- `typecheck`, `test`, `build`가 통과한다.

## 리뷰 질문

- 테스트가 사용자의 행동과 화면 결과를 검증하는가?
- 구현을 리팩터링해도 유지될 테스트인가?
- 실패 상태를 실제로 검증했는가?
- 접근 가능한 이름이 없어서 테스트가 어려운 컴포넌트는 없는가?
- CI에 넣을 최소 명령이 무엇인가?

