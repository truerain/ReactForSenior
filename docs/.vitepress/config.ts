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
            link: "/lessons/00-modern-javascript-foundation",
          },
          {
            text: "TypeScript Foundation",
            link: "/lessons/01-typescript-foundation",
          },
          {
            text: "React Mental Model",
            link: "/lessons/02-react-mental-model",
          },
        ],
      },
      {
        text: "실습 과제",
        items: [
          {
            text: "ES5 코드 현대화",
            link: "/exercises/00-modern-javascript-foundation",
          },
          {
            text: "주문 도메인 타입 정의",
            link: "/exercises/01-typescript-foundation",
          },
          {
            text: "주문 목록 UI",
            link: "/exercises/02-react-mental-model",
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
