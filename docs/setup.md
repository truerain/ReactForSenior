# 학습 준비: VS Code와 실습 환경 만들기

이 문서는 React 강좌를 시작하기 전에 필요한 기본 개발 환경을 준비하는 절차입니다. 넥사크로, 전통적인 JavaScript, 사내 IDE 중심 개발에 익숙한 개발자가 VS Code 기반의 현대 프론트엔드 개발 흐름에 적응하는 것을 목표로 합니다.

## 1. 준비할 도구

필수 도구:

- VS Code
- Node.js LTS
- npm 또는 pnpm
- Chrome 또는 Edge
- Git

권장 도구:

- Windows Terminal
- GitHub 계정

## 2. VS Code 설치

VS Code는 현대 JavaScript/TypeScript 개발에서 가장 널리 쓰이는 편집기입니다.

설치:

- [VS Code 다운로드](https://code.visualstudio.com/)

설치 후 확인:

1. VS Code 실행
2. `File > Open Folder...` 선택
3. 실습용 폴더를 열 수 있는지 확인
4. `Terminal > New Terminal`을 열어 터미널이 동작하는지 확인

## 3. VS Code 확장 설치

다음 확장을 설치합니다.

- ESLint
- Prettier - Code formatter
- JavaScript and TypeScript Nightly는 필수는 아니며, 기본 TypeScript 지원으로 충분합니다.
- GitLens는 선택 사항입니다.

설치 방법:

1. VS Code 왼쪽 Extensions 아이콘 선택
2. 확장 이름 검색
3. Install 클릭

## 4. Node.js LTS 설치

React 개발 도구는 Node.js 위에서 실행됩니다. 브라우저에서 동작하는 React 앱을 만들더라도, 개발 서버와 빌드 도구는 Node.js를 사용합니다.

설치:

- [Node.js 다운로드](https://nodejs.org/)
- LTS 버전 선택

설치 후 VS Code 터미널에서 확인:

```powershell
node -v
npm -v
```

버전이 출력되면 설치가 완료된 것입니다.

## 5. pnpm 설치

이 강좌에서는 npm만으로도 실습할 수 있습니다. 다만 실무 프로젝트에서는 pnpm을 사용하는 경우가 많으므로 pnpm도 함께 준비합니다.

```powershell
npm install -g pnpm
pnpm -v
```

npm만 사용할 경우 이후 명령에서 `pnpm` 대신 `npm`을 사용하면 됩니다.

## 6. Git 설치

Git은 코드 변경 이력을 관리하는 도구입니다.

설치:

- [Git 다운로드](https://git-scm.com/)

설치 후 확인:

```powershell
git --version
```

처음 한 번만 사용자 정보를 설정합니다.

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## 7. 실습 폴더 만들기

원하는 위치에 실습 폴더를 만듭니다.

```powershell
mkdir react-for-senior-practice
cd react-for-senior-practice
```

VS Code에서 현재 폴더를 열려면 다음 명령을 사용할 수 있습니다.

```powershell
code .
```

`code` 명령이 동작하지 않으면 VS Code에서 `Ctrl + Shift + P`를 누르고 `Shell Command: Install 'code' command in PATH`를 실행합니다.

## 8. 첫 React 프로젝트 만들기

Vite를 사용해 React + TypeScript 프로젝트를 만듭니다.

```powershell
pnpm create vite my-react-app --template react-ts
cd my-react-app
pnpm install
pnpm dev
```

npm을 사용할 경우:

```powershell
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

터미널에 표시되는 주소를 브라우저에서 엽니다.

예:

```text
http://localhost:5173/
```

화면에 Vite/React 기본 페이지가 보이면 실습 환경이 준비된 것입니다.

## 9. 프로젝트 구조 살펴보기

Vite 프로젝트의 기본 구조는 다음과 같습니다.

```text
my-react-app/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
```

중요한 파일:

- `package.json`: 프로젝트 이름, 실행 명령, 의존성 목록
- `src/main.tsx`: React 앱이 브라우저 DOM에 연결되는 시작점
- `src/App.tsx`: 첫 화면 컴포넌트
- `vite.config.ts`: Vite 설정
- `tsconfig.json`: TypeScript 설정

## 10. 개발 서버 종료

개발 서버를 종료하려면 터미널에서 `Ctrl + C`를 누릅니다.

다시 실행하려면 프로젝트 폴더에서 다음 명령을 사용합니다.

```powershell
pnpm dev
```

또는 npm을 사용하는 경우:

```powershell
npm run dev
```

## 11. 브라우저 개발자 도구

React 개발에서는 브라우저 개발자 도구를 자주 사용합니다.

Chrome 또는 Edge에서:

- `F12`
- 또는 `Ctrl + Shift + I`

주요 탭:

- Elements: 실제 DOM 확인
- Console: 오류와 로그 확인
- Network: API 요청 확인
- Application: localStorage, sessionStorage 확인

## 12. React Developer Tools 설치

React 컴포넌트 구조와 props/state를 보기 위해 React Developer Tools를 설치합니다.

- Chrome Web Store에서 `React Developer Tools` 검색
- Edge Add-ons에서도 설치 가능

설치 후 React 앱을 열고 개발자 도구에 `Components`, `Profiler` 탭이 보이는지 확인합니다.

## 13. VS Code 기본 설정

권장 설정:

1. `Ctrl + ,`로 Settings 열기
2. `Format On Save` 검색 후 활성화
3. 기본 formatter를 Prettier로 설정

프로젝트별 설정 파일을 사용할 수도 있습니다.

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 14. 학습 전 체크리스트

- `node -v`가 동작한다.
- `npm -v` 또는 `pnpm -v`가 동작한다.
- `git --version`이 동작한다.
- VS Code에서 터미널을 열 수 있다.
- Vite React 프로젝트를 생성했다.
- `pnpm dev` 또는 `npm run dev`로 개발 서버를 실행했다.
- 브라우저에서 `localhost` 주소로 앱을 확인했다.
- React Developer Tools를 설치했다.

## 자주 만나는 문제

### `node` 명령을 찾을 수 없음

Node.js 설치 후 터미널을 새로 열어야 합니다. 그래도 안 되면 Node.js를 다시 설치하고 `Add to PATH` 옵션이 선택되어 있는지 확인합니다.

### `pnpm` 명령을 찾을 수 없음

다음 명령으로 다시 설치합니다.

```powershell
npm install -g pnpm
```

설치 후 터미널을 새로 엽니다.

### 개발 서버 주소가 다름

기본 포트 `5173`이 이미 사용 중이면 Vite가 다른 포트를 사용할 수 있습니다. 터미널에 표시된 주소를 그대로 열면 됩니다.

### PowerShell에서 스크립트 실행 오류가 발생함

회사 보안 정책이나 PowerShell 실행 정책 때문에 발생할 수 있습니다. 이 경우 npm 명령을 먼저 사용하거나, 사내 보안 정책에 맞는 터미널 설정을 확인해야 합니다.

## 다음 단계

환경 준비가 끝나면 [Modern JavaScript Foundation](./lessons/00-modern-javascript-foundation.md)부터 시작합니다.
