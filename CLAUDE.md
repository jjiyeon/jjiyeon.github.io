# Summer's Dev Letter

`jjiyeon.github.io` — Summer의 이력 + 매주 발행하는 개발레터를 묶은 개인 사이트.
일반적인 기술 블로그가 아니라 "월별 아카이브 + 이력서" 두 축에 집중한다.

## 정체성 한 줄

> 이력서로는 드러나기 어려운 일하는 방식과 판단 기준을, 매주 한 편의 레터로 누적해 보여주는 개인 사이트.

## 스택

- Astro 6 (정적 사이트, content collections)
- TypeScript strict
- React 19 + `@astrojs/react` 통합 — 컴포넌트는 `.tsx`로 작성, 페이지/레이아웃은 `.astro` 유지
- Markdown 기반 콘텐츠
- **Tailwind v4** (`@tailwindcss/vite`) + 일부 레거시 CSS (`src/styles/global.css`) 공존
  - 새 화면/컴포넌트는 Tailwind utility 클래스 우선
  - Letters 관련 화면(MonthlyLetters, letter detail/list)은 아직 레거시 클래스 기반 — 점진 마이그레이션 예정
  - **Preflight 미사용** (`@import "tailwindcss/theme.css"` + `"tailwindcss/utilities.css"`만 임포트) — 기존 레거시 CSS와 충돌 방지
- Node.js >= 22.12
- GitHub Pages 배포 (GitHub Actions)
- 기본 도메인: `https://jjiyeon.github.io` (`base` 미지정, user/org pages 패턴)

## React (.tsx) 컴포넌트 규칙

- 컴포넌트 신규 작성/리팩토링은 `.tsx` 우선. 페이지(`src/pages/*.astro`)와 레이아웃(`src/layouts/*.astro`)은 `.astro` 유지.
- React 컴포넌트는 기본적으로 SSR로 렌더링됨(별도 directive 없으면 zero-JS).
- 클라이언트 인터랙션이 필요하면 페이지에서 `<MyComp client:load />` (또는 `client:visible` / `client:idle`) 부착.
- `astro:assets`의 `<Image>`는 React에서 직접 못 씀 — 대신 부모 `.astro`에서 `getImage()`로 처리해 URL/크기를 props로 내려보내고, React에서는 plain `<img>` 사용.
- 콘텐츠 컬렉션 타입(`Letter` 등)은 `.tsx`에서도 그대로 import 가능.

## Tailwind 사용 규칙

- 새 마크업/컴포넌트의 스타일은 **utility 클래스 인라인** 우선. 별도 CSS 작성 금지.
- 토큰은 `@theme` 블록(global.css 상단)에서 한 곳에 정의 — 색을 바꾸려면 거기서 한 줄만 수정.
- 임의 값은 대괄호 표기(`text-[0.93rem]`, `grid-cols-[48px_minmax(0,1fr)_auto]`) — 자주 쓰이는 값은 `@theme`에 토큰으로 승격 고려.
- Preflight를 쓰지 않으므로 `<h1>`/`<ul>` 같은 태그의 브라우저 기본 스타일이 살아있음. 필요한 경우 `m-0 p-0 list-none` 같이 명시적으로 reset.
- 모바일 분기는 기본=mobile-first, `sm:` (>= 640px) 기준 데스크탑. 더 좁은 폭만 적용하려면 `max-sm:` 사용.
- 기존 Letters 화면의 `.month-card` / `.letter-detail` 등 클래스는 그대로 유지 — 새 컴포넌트를 만들 때만 Tailwind로.

## 명령어

```bash
npm run dev       # ASTRO_TELEMETRY_DISABLED=1 astro dev
npm run build     # 정적 빌드 → dist/
npm run preview   # 빌드 결과 미리보기
```

UI를 수정할 때는 항상 `npm run dev`로 띄우고 브라우저에서 확인한 뒤 완료 보고.

## 디렉토리 구조

```
src/
  pages/
    index.astro                  → 최신 월 Letters
    about.astro
    404.astro
    rss.xml.js
    letters/
      index.astro                → 최신 월 Letters (= /)
      [slug].astro               → /letters/<letterSlug>/ 상세
      [year]/[month].astro       → /letters/2026/05/ 월별
  layouts/BaseLayout.astro       → 헤더/푸터/메타. 헤더 좌측은 로고가 들어갈 빈 슬롯
  components/
    MonthlyLetters.astro         → 2열 월별 아카이브 (rail + issue list, 카테고리 필터)
    LetterList.tsx               → 단순 목록 (React 컴포넌트, 현재 미사용 / 레퍼런스 용)
  lib/
    letters.ts                   → published 필터, 월 그룹핑, 정렬, 포맷터, 인접 월
    categories.ts                → 5개 카테고리 정의 (work/dev/product/career/notes)
  content.config.ts              → letters collection schema (Zod)
  content/letters/<year>/<month>/<week-n>/
    index.md                     → 레터 본문 + frontmatter
    cover.svg|jpg|png            → 대표 이미지
    inline-*.svg|jpg|png         → 본문 인라인 이미지 (md에서 ./ 상대경로)
  styles/global.css              → 전역 단일 스타일시트
public/
  favicon.svg
  images/profile.jpg             → About 프로필 (없으면 placeholder)
docs/
  SUMMER_DEV_LETTER_PRD.md
  SUMMER_DEV_LETTER_IMPLEMENTATION_PLAN.md
  SUMMER_DEV_LETTER_DESIGN_REVISION_PLAN.md
  LETTER_TEMPLATE.md             → 새 레터 작성용 템플릿
```

`_posts/`, `404.html`, `Gemfile*`, `_config.yml`, `*.markdown` 같은 Jekyll 잔재는 제거 대상 (현재 git status에서 D 표시).

## 콘텐츠 모델 (letters)

`src/content.config.ts`에 정의된 frontmatter:

| 필드 | 타입 | 메모 |
|---|---|---|
| `title` | string | "2026년 5월 1주차 개발레터" 형태 권장 |
| `subtitle` | string | 한 주를 설명하는 짧은 문장 |
| `letterSlug` | string | 공개 URL용 (`/letters/<letterSlug>/`). Astro가 `slug`를 예약어로 쓰므로 별도 필드 |
| `publishedAt` | Date | 월별 그룹핑/정렬 기준 |
| `week` | string | "2026-W18" 같은 ISO week label |
| `issue` | int > 0 | 발행 회차 |
| `category` | enum | `work` / `dev` / `product` / `career` / `notes` |
| `tags` | string[] | 표시용. 별도 인덱스 페이지 없음 |
| `summary` | string | 목록 카드 본문 + meta description |
| `cover` | image() | 선택. 있으면 목록/상세 상단에 표시. 없으면 영역 자체 숨김 |
| `coverAlt` | string | 선택 |
| `status` | `draft` \| `published` | `published`만 공개 화면/RSS에 노출 |

본문 섹션 구조 (관습):

1. `## 이번 주의 한 줄`
2. `## 한 일`
3. `## 생각한 것`
4. `## 배운 것`
5. `## 남겨둘 조각`

새 레터는 `docs/LETTER_TEMPLATE.md`를 복사해 시작.

## 라우팅 요약

- `/` 와 `/letters/` 는 동일하게 **최신 월 아카이브** (`getLatestMonthArchive`)
- `/letters/[year]/[month]/` 는 해당 월 (`getMonthArchive`, 인접 월 자동 연결)
- `/letters/[slug]/` 는 `letterSlug` 기반 상세
- `/about/`
- `/rss.xml`
- 카테고리/태그 전용 인덱스 페이지는 의도적으로 만들지 않음 — 카테고리는 월 화면 내부 필터로만 동작

## 디자인 원칙 (지킬 것)

PRD/디자인 개편 계획에서 합의한 톤:

**선호한다**
- 캘린더/아카이브 같은 정적이고 조용한 느낌
- 얇은 선(`var(--line)`)으로 분리된 sparse한 목록
- 모든 타이포는 Pretendard sans (큰 제목은 weight 700 + `letter-spacing: -0.02em`)
- `var(--accent)` (짙은 청록 #2f6f61)는 라벨/eyebrow 같은 미세한 강조에만
- 헤더 좌측은 로고용 빈 슬롯으로 유지 — 텍스트 브랜드 넣지 말 것

**피한다**
- SaaS 랜딩 페이지 분위기
- 카드만 빽빽한 블로그 그리드
- 기술 문서 톤
- 콘텐츠 정체성과 무관한 장식

색/타이포 토큰은 `global.css`의 `@theme` 블록과 `:root` 레거시 alias 양쪽에서 노출됨:

| 토큰 | 값 | Tailwind utility | 레거시 var |
|---|---|---|---|
| ink (본문 검정) | `#171717` | `text-ink` `bg-ink` | `var(--ink)` |
| muted (보조 회색) | `#6b7280` | `text-muted` | `var(--muted)` |
| line (얇은 보더) | `#e5e7eb` | `border-line` | `var(--line)` |
| soft (옅은 배경) | `#f4f4f5` | `bg-soft` | `var(--soft)` |
| surface (모바일 칩 배경 등) | `#fafafa` | `bg-surface` | `var(--surface)` |
| accent (라벨용 청록) | `#2f6f61` | `text-accent` `bg-accent` | `var(--accent)` |
| accent-soft (옅은 청록 배경) | `#e4eee9` | `bg-accent-soft` | `var(--accent-soft)` |

폰트 스택은 `--font-sans`(`@theme`) → `font-sans` utility 또는 `var(--font-sans)`. BaseLayout에서 jsDelivr CDN의 Pretendard variable dynamic-subset을 로드.

Tailwind는 v4 + Preflight 미사용 모드(아래 통합 섹션 참고). `bg-white` 같은 기본 팔레트도 사용 가능.

데스크탑 Letters는 280px rail + 1fr content의 2열, 모바일(`<= 820px`)은 단일 컬럼.
모바일에서 카테고리 필터는 가로 스크롤 칩으로 변형.

## 작업할 때 지킬 것

- **새 파일/추상화 줄이기**: 컴포넌트는 `MonthlyLetters` / `LetterList` 두 개로 충분. 한 곳에서만 쓰는 마크업은 페이지 안에 그대로 둔다.
- **CSS는 `global.css` 한 파일**: 컴포넌트마다 `<style>` 블록을 새로 만들지 말고 토큰/유틸을 재사용한다.
- **이미지는 `astro:assets`의 `<Image>`로**: `MonthlyLetters`/`[slug].astro`/`LetterList`처럼 schema의 `image()`를 통해 들어온 cover를 그대로 넘긴다. raw `<img>`로 대체하지 말 것.
- **`status: 'published'`가 아닌 글은 공개 화면/RSS에 절대 노출 금지** — `getPublishedLetters()`만 사용.
- **`base` 추가 금지**: user pages 저장소이므로 `astro.config.mjs`에는 `site`만 둔다.
- **빌드 검증**: 라우팅/스키마/콘텐츠를 건드린 경우 `npm run build`로 끝낸다.

## 현재 상태 (2026-05 기준)

- 브랜치: `summer-dev-letter`. PR base는 `master`.
- Phase 1~4 완료, **Phase 5 (디자인 개편) 진행 중**.
- 발행된 레터 1편: `2026/05/week-1`.
- 사용자가 디자인을 직접 가이드하면서 화면을 다듬는 단계.
