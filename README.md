# React for Senior Developers

시니어 개발자를 대상으로 한 React 강좌 자료실입니다. 특히 넥사크로처럼 오래된 JavaScript 스타일과 화면 중심 개발 환경에 익숙한 개발자가, 현대 JavaScript와 TypeScript 기반의 React 애플리케이션 개발 방식으로 전환하는 데 초점을 둡니다.

## 목표

- 현대 JavaScript의 문법, 모듈, 비동기 처리, 도구 체인을 먼저 정리한다.
- TypeScript로 도메인 모델, 함수 계약, React props를 표현하는 방법을 익힌다.
- React의 렌더링 모델과 상태 모델을 정확히 이해한다.
- 대규모 프론트엔드 코드베이스에서 유지보수 가능한 구조를 설계한다.
- 성능, 테스트, 접근성, 데이터 흐름, 배포 품질을 실무 기준으로 다룬다.
- 기존 웹, 백엔드, 모바일, 데스크톱 개발 경험을 React 의사결정에 활용한다.

## 문서 구성

- [docs/](./docs): VitePress 문서 사이트 원본
- [docs/setup.md](./docs/setup.md): VS Code와 실습 환경 준비
- [docs/roadmap.md](./docs/roadmap.md): 전체 학습 로드맵
- [docs/syllabus.md](./docs/syllabus.md): 강의 운영안과 Phase별 목표
- [docs/lessons/](./docs/lessons): 회차별 교재
- [docs/exercises/](./docs/exercises): 실습 과제
- [docs/references/](./docs/references): 참고 자료와 읽을거리

## 문서 사이트 실행

로컬에서 VitePress 사이트를 확인합니다.

```bash
npm install
npm run docs:dev
```

정적 사이트 빌드를 확인합니다.

```bash
npm run docs:build
npm run docs:preview
```

GitHub Pages로 배포하려면 리포지토리 `Settings > Pages`에서 `Build and deployment > Source`를 `GitHub Actions`로 설정합니다. 이 리포지토리 이름이 `ReactForSenior`가 아니라면 [docs/.vitepress/config.ts](./docs/.vitepress/config.ts)의 `base` 값을 실제 리포지토리 이름에 맞게 수정해야 합니다.

## 문서 작성 기준

이 프로젝트는 `docs/`를 단일 원본으로 사용합니다. 새 교재, 실습, 참고자료는 `docs/lessons`, `docs/exercises`, `docs/references` 아래에 추가합니다.

## 권장 대상

- 넥사크로, jQuery, JSP 화면, 레거시 JavaScript 기반 UI를 오래 다뤄온 개발자
- ES5 중심의 JavaScript에는 익숙하지만 ES2015 이후 문법과 프론트엔드 빌드 도구가 낯선 개발자
- 다른 UI 프레임워크, 백엔드, 모바일, 데스크톱 개발 경험이 있는 시니어 개발자
- React를 이미 사용하지만 렌더링, 상태 관리, 성능, 구조화 원칙을 더 깊게 정리하고 싶은 개발자

## 운영 원칙

- 예제는 레거시 JavaScript 스타일과 현대 JavaScript 스타일을 비교하며 시작한다.
- 예제는 작게 시작하되, 설계 논의는 실제 제품 규모를 기준으로 한다.
- 라이브러리 사용법보다 React가 요구하는 사고방식을 먼저 설명한다.
- "정답 패턴"보다 trade-off를 명확히 비교한다.
- 코드 품질은 타입, 테스트, 접근성, 성능 관찰을 함께 본다.
