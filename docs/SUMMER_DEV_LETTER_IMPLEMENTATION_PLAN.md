# Summer's Dev Letter 구현 계획

## 1. 방향

이 저장소는 기본 Jekyll 스캐폴드에서 Astro 기반 정적 사이트로 전환한다.

현재 디자인 방향은 일반적인 블로그보다 단순하다. 공개 화면은 **Letters**와 **About** 두 축에 집중한다.

첫 버전은 의도적으로 가볍게 유지한다.

- Astro 중심 UI
- 설정, content schema, helper에는 TypeScript 사용
- 개발레터는 Markdown으로 작성
- v1에서는 React 의존성 없음
- Node.js 22.12 이상 사용
- GitHub Actions로 GitHub Pages 배포

React는 검색, 필터, 구독 폼처럼 클라이언트 인터랙션이 더 필요해질 때 나중에 도입한다.

## 2. 콘텐츠 모델

개발레터 한 편은 Markdown 파일 하나로 관리한다.

권장 경로:

```txt
src/content/letters/2026/05/week-1/index.md
```

공개 상세 URL:

```txt
/letters/2026-05-week-1/
```

월별 아카이브 URL:

```txt
/letters/2026/05/
```

필수 frontmatter:

```md
---
title: "2026년 5월 1주차 개발레터"
subtitle: "일을 정리하는 방식에 대해 생각한 한 주"
letterSlug: "2026-05-week-1"
publishedAt: "2026-05-03"
week: "2026-W18"
issue: 1
category: "work"
tags:
  - collaboration
  - retrospective
  - frontend
summary: "이번 주에는 개발 기록을 어떻게 나답게 쌓을지 고민했다."
cover: "./cover.jpg"
coverAlt: "개발레터 대표 이미지 설명"
status: "published"
---
```

허용 카테고리:

- `work`
- `dev`
- `product`
- `career`
- `notes`

공개 페이지와 RSS에는 `status: "published"`인 글만 노출한다.

Astro가 `slug`를 content entry routing metadata로 사용하므로, 공개 URL 값은 `letterSlug`에 둔다.

레터 이미지는 글과 같은 폴더에서 관리한다.

```txt
src/content/letters/2026/05/week-1/
  index.md
  cover.jpg
  inline-note.png
```

`cover`는 Letters 목록과 상세 상단에서 사용하고, 본문 이미지는 Markdown 상대 경로로 삽입한다.

## 3. 페이지 구조

MVP에 포함하는 페이지:

- `/`: 최신 월 Letters 화면
- `/letters`: 최신 월 Letters 화면
- `/letters/[year]/[month]`: 한 달치 주차별 개발레터와 카테고리 필터
- `/letters/[slug]`: 개발레터 상세 페이지
- `/about`: 프로필 이미지와 이력서 기반 섹션을 가진 About 페이지
- `/rss.xml`: 공개 개발레터 RSS 피드

상단 내비게이션에는 다음 두 메뉴만 보여준다.

- `Letters`
- `About`

왼쪽 브랜드 영역은 로고가 준비될 때까지 비워둔다.

독립적인 카테고리/태그 페이지는 MVP의 주요 UX에서 제외한다. 카테고리는 Letters 월별 아카이브 안에서 필터로 사용한다.

## 4. 구현 순서

1. Jekyll 파일을 Astro 프로젝트 구조로 대체한다.
2. TypeScript와 Astro 설정을 추가한다.
3. 개발레터 content collection schema를 추가한다.
4. 개발레터와 카테고리 helper를 추가한다.
5. 공통 레이아웃의 내비게이션을 `Letters`, `About`만 남기도록 단순화한다.
6. `/`와 `/letters`를 최신 월 Letters 화면 중심으로 재구성한다.
7. `/letters/[year]/[month]`를 추가하고 월 이동과 카테고리 필터를 구현한다.
8. `/letters/[slug]`는 전체 개발레터 읽기 페이지로 유지한다.
9. `/about`을 프로필 이미지가 있는 이력서형 포트폴리오 페이지로 재구성한다.
10. RSS와 GitHub Pages 배포 설정을 유지한다.
11. production build를 실행하고 문제를 수정한다.

## 5. 디자인 개편 계획

### 내비게이션

- 로고가 준비되기 전까지 보이는 브랜드 텍스트를 제거한다.
- 상단 메뉴는 `Letters`, `About`만 둔다.
- 향후 로고가 들어갈 수 있도록 왼쪽 헤더 공간은 남겨둔다.

### Letters 데스크탑 레이아웃

- 2열 레이아웃을 사용한다.
- 왼쪽 영역:
  - `2026 May` 같은 현재 연도/월 표시
  - `Week 1` 같은 강조된 주차
  - 이전/다음 월 이동
  - 월 정보 아래 카테고리 필터
- 오른쪽 영역:
  - 선택된 월의 개발레터 목록
  - 무거운 카드보다 희박한 issue preview 느낌
  - 페이지네이션은 글 단위가 아니라 월 단위

### Letters 모바일 레이아웃

- 왼쪽 영역을 상단 월 요약 블록으로 접는다.
- 카테고리 필터는 가로 스크롤 칩으로 보여준다.
- 주차별 개발레터 preview는 세로로 쌓는다.
- 월 이동은 월 제목 가까이에 둔다.

### About 레이아웃

- `public/images/profile.jpg`를 프로필 이미지 경로로 사용한다.
- 이미지가 없을 때는 깨진 이미지 대신 단순한 원형 placeholder를 보여준다.
- 섹션은 이력서 기반으로 구성한다.
  - Profile summary
  - Work
  - Projects
  - Expertise
  - Now
- 톤은 명확하고 이력서 기반이어야 하지만, 이력서 원문을 그대로 복사한 느낌은 피한다.

## 6. 검증 기준

- `npm run build`가 성공한다.
- React 없이 사이트가 빌드된다.
- 최신 샘플 개발레터가 최신 월 Letters 화면에 보인다.
- 샘플 개발레터가 월별 아카이브, 상세 페이지, 카테고리 필터 결과, RSS에 일관되게 노출된다.
- `published`가 아닌 글은 공개 목록에 보이지 않는다.
- 상단 내비게이션에는 `Letters`, `About`만 보인다.
- About에는 원형 프로필 이미지 영역이 있다.
- Astro 설정에는 `https://jjiyeon.github.io`가 `site`로 지정되고 `base`는 없다.
- GitHub Actions가 `dist`를 GitHub Pages로 배포할 수 있다.
