import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "ko-KR",
  title: "React for Senior Developers",
  description: "시니어 개발자를 위한 Modern JavaScript, TypeScript, React 전환 강좌",
  base: "/ReactForSenior/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "학습 준비", link: "/setup" },
      { text: "로드맵", link: "/roadmap" },
      { text: "강의계획서", link: "/syllabus" },
    ],
    sidebar: [
      {
        text: "시작",
        items: [
          { text: "학습 준비", link: "/setup" },
          { text: "로드맵", link: "/roadmap" },
          { text: "강의계획서", link: "/syllabus" },
        ],
      },
      {
        text: "회차별 교재",
        items: [
          {
            text: "Modern JavaScript Foundation",
            link: "/lessons/01-modern-javascript-foundation",
          },
          {
            text: "TypeScript Foundation",
            link: "/lessons/02-typescript-foundation",
          },
          {
            text: "React 사고 모델",
            link: "/lessons/03-react-mental-model",
          },
          {
            text: "State and Effects",
            link: "/lessons/04-state-and-effects",
          },
          {
            text: "Component Architecture",
            link: "/lessons/05-component-architecture",
          },
          {
            text: "Data Fetching and Async UI",
            link: "/lessons/06-data-fetching-and-async-ui",
          },
          {
            text: "Performance and Concurrency",
            link: "/lessons/07-performance-and-concurrency",
          },
          {
            text: "Testing and Quality",
            link: "/lessons/08-testing-and-quality",
          },
          {
            text: "Production Architecture",
            link: "/lessons/09-production-architecture",
          },
        ],
      },
      {
        text: "실습 과제",
        items: [
          {
            text: "ES5 코드 현대화",
            link: "/exercises/01-modern-javascript-foundation",
          },
          {
            text: "주문 도메인 타입 정의",
            link: "/exercises/02-typescript-foundation",
          },
          {
            text: "주문 관리 미니 React 앱",
            link: "/exercises/03-react-mental-model",
          },
          {
            text: "주문 관리 앱에 State와 Effects 적용하기",
            link: "/exercises/04-state-and-effects",
          },
          {
            text: "주문 관리 앱 컴포넌트 아키텍처 리팩터링",
            link: "/exercises/05-component-architecture",
          },
          {
            text: "주문 CRUD 흐름과 Async UI 구현",
            link: "/exercises/06-data-fetching-and-async-ui",
          },
          {
            text: "주문 목록 성능 측정과 최적화",
            link: "/exercises/07-performance-and-concurrency",
          },
          {
            text: "주문 관리 앱 테스트와 품질 게이트",
            link: "/exercises/08-testing-and-quality",
          },
          {
            text: "주문 관리 앱 Production Architecture 설계",
            link: "/exercises/09-production-architecture",
          },
        ],
      },
      {
        text: "참고자료",
        items: [{ text: "Reading List", link: "/references/reading-list" }],
      },
    ],
    search: {
      provider: "local",
    },
    socialLinks: [],
    footer: {
      message: "React for Senior Developers",
      copyright: "Released under the MIT License.",
    },
  },
});
