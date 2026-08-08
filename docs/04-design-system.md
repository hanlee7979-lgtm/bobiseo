# 04. 디자인 시스템 · 테마

> 근거: `docs/assets/ref-01~04*.png` 4장. 아래 토큰은 그 이미지에서 읽어낸 값을 체계화한 것이다.
> 이미지에서 직접 확인되지 않은 값(정확한 hex, 폰트명)은 **근사치이며 조정 가능**하다고 표시했다.

## 1. 이 제품의 시각적 성격

이미지 4장에서 일관되게 반복되는 것은 세 가지다.

1. **사람 사진이 주인공** — 사장님 얼굴이 카드 전체를 채운다. 로고도 일러스트도 아니다.
2. **좌우로 살짝 보이는 이웃 카드** — 캐러셀 양옆에 이전/다음 카드가 20~30px 물려 있다.
   "혼자가 아니라 줄 서 있는 동네"라는 인상을 만든다.
3. **강조색 링(ring)** — 활성 카드 테두리가 강조색으로 빛난다. 다크 배경에서 특히 강하다.

이 셋이 **시그니처**다. 다른 장식은 최대한 조용하게 간다. 그라데이션 배경, 유리모피즘,
장식용 아이콘 남발은 이 사진들의 힘을 깎아먹으므로 쓰지 않는다.

## 2. 색 토큰

### 2.1 구조

색은 **의미 토큰(semantic)** 으로만 사용한다. 컴포넌트에서 hex를 직접 쓰지 않는다.

```css
/* src/styles/tokens.css */
:root {
  /* 배경 계층 */
  --bg:            /* 페이지 최하단 배경 */;
  --surface:       /* 카드 기본면 */;
  --surface-2:     /* 카드 안 중첩면 (메뉴 썸네일 배경 등) */;
  --surface-raised:/* 떠 있는 시트, 팝오버 */;

  /* 텍스트 */
  --text:          /* 본문 */;
  --text-muted:    /* 보조 설명, 캡션 */;
  --text-faint:    /* 비활성 */;
  --text-on-accent:/* 강조색 위 텍스트 */;

  /* 선 */
  --border:        /* 기본 경계선 */;
  --border-strong: /* 활성 카드 링 */;

  /* 강조 */
  --accent:        /* 팔레트별 주강조색 */;
  --accent-soft:   /* 강조색 12% 배경 */;
  --accent-ring:   /* 활성 카드 글로우 */;

  /* 상태 */
  --success: #2FA36B;
  --warning: #F2B441;
  --danger:  #E5484D;
  --info:    #3B82F6;

  /* 등급 (팔레트와 무관하게 고정) */
  --tier-s: #2FA36B;   /* S등급 — 에메랄드 */
  --tier-a: #E5484D;   /* A등급 — 코럴 레드 */
  --tier-b: #F2B441;   /* B등급 — 앰버 */
  --tier-c: #4CAF6D;   /* C등급 — 그린 */
}
```

**등급 색을 팔레트마다 바꾸지 말 것.** 설계사가 A/B/C를 색으로 기억하는데, 테마를 바꿨다고
색이 달라지면 학습된 인지가 깨진다. (ref-03 4개 테마 전부에서 등급색이 동일하게 유지되고 있다.)

### 2.2 팔레트 4종

이미지의 4가지 색상 변형에 대응한다. 각 팔레트는 light / dark 두 모드를 갖는다.
`data-palette` × `.dark` 조합으로 적용한다.

| ID | 이름(ko) | 유래 | 강조색 |
|---|---|---|---|
| `basalt` | 현무암 | ref-03 흑/백 대비, ref-04 앰버 글로우 | `#F0A03C` |
| `gyul` | 감귤 | ref-01 웜 브라운·크림, ref-02 샌드 | `#E07A2F` |
| `gotjawal` | 곶자왈 | ref-01 딥그린, ref-02 그린 | `#2E9E63` |
| `badang` | 바당 | ref-02·03 네이비, ref-01·04 퍼플 | `#6C5CE7` |

기본값: `basalt` + `system`(OS 설정 따름).

```css
/* 기본: basalt */
:root, [data-palette='basalt'] {
  --bg: #FBFAF8;  --surface: #FFFFFF;  --surface-2: #F4F2EF;  --surface-raised: #FFFFFF;
  --text: #17140F; --text-muted: #6B655C; --text-faint: #A8A29A;
  --border: #E7E3DC; --border-strong: #D5CFC5;
  --accent: #D4801F; --accent-soft: rgba(212,128,31,.12); --accent-ring: rgba(212,128,31,.35);
  --text-on-accent: #FFFFFF;
}
.dark[data-palette='basalt'], .dark {
  --bg: #0B0A09;  --surface: #16130F;  --surface-2: #201B15;  --surface-raised: #221D17;
  --text: #F5F1EA; --text-muted: #A79E92; --text-faint: #6E655B;
  --border: #2A241D; --border-strong: #4A3F32;
  --accent: #F0A03C; --accent-soft: rgba(240,160,60,.14); --accent-ring: rgba(240,160,60,.45);
  --text-on-accent: #1A1200;
}

[data-palette='gyul'] {
  --bg: #F7F1E7;  --surface: #FFFDF9;  --surface-2: #F0E7DA;  --surface-raised: #FFFDF9;
  --text: #2A1D12; --text-muted: #7A6A58; --text-faint: #B0A08C;
  --border: #E4D8C6; --border-strong: #CDBBA1;
  --accent: #E07A2F; --accent-soft: rgba(224,122,47,.12); --accent-ring: rgba(224,122,47,.35);
  --text-on-accent: #FFFFFF;
}
.dark[data-palette='gyul'] {
  --bg: #1A100A;  --surface: #241609;  --surface-2: #33200F;  --surface-raised: #2C1B0D;
  --text: #F6EADC; --text-muted: #B49A80; --text-faint: #7A6450;
  --border: #3B2715; --border-strong: #6A4622;
  --accent: #F3A45A; --accent-soft: rgba(243,164,90,.14); --accent-ring: rgba(243,164,90,.45);
  --text-on-accent: #1A1000;
}

[data-palette='gotjawal'] {
  --bg: #F3F8F3;  --surface: #FFFFFF;  --surface-2: #E8F2E9;
  --text: #12211A; --text-muted: #5C7064; --text-faint: #9AAB9F;
  --border: #D8E6DA; --border-strong: #B4CDB9;
  --accent: #2E9E63; --accent-soft: rgba(46,158,99,.12); --accent-ring: rgba(46,158,99,.32);
  --text-on-accent: #FFFFFF;
}
.dark[data-palette='gotjawal'] {
  --bg: #08120C;  --surface: #101E16;  --surface-2: #172B1E;
  --text: #E9F3EB; --text-muted: #8FA795; --text-faint: #5D7264;
  --border: #1E3527; --border-strong: #2F5C40;
  --accent: #4FD18B; --accent-soft: rgba(79,209,139,.14); --accent-ring: rgba(79,209,139,.4);
  --text-on-accent: #05180D;
}

[data-palette='badang'] {
  --bg: #F5F5FB;  --surface: #FFFFFF;  --surface-2: #ECECF7;
  --text: #14152B; --text-muted: #5F6280; --text-faint: #9B9DB5;
  --border: #E0E0EF; --border-strong: #C2C3E0;
  --accent: #5B4BD6; --accent-soft: rgba(91,75,214,.10); --accent-ring: rgba(91,75,214,.30);
  --text-on-accent: #FFFFFF;
}
.dark[data-palette='badang'] {
  --bg: #090B1A;  --surface: #121531;  --surface-2: #1B2044;
  --text: #ECEDF8; --text-muted: #969AC0; --text-faint: #64688C;
  --border: #232852; --border-strong: #3B4288;
  --accent: #8B7CF6; --accent-soft: rgba(139,124,246,.16); --accent-ring: rgba(139,124,246,.45);
  --text-on-accent: #0B0820;
}
```

> ⚠️ 위 hex는 이미지에서 눈으로 읽은 근사치다. 구현 후 실제 화면과 대조해 조정할 것.
> 모든 조합에 대해 **본문 대비 4.5:1, 큰 텍스트 3:1** 을 만족하는지 검사한다.

### 2.3 Tailwind 연결

> **업데이트 (M0)**: 설치 시점 최신 안정판이 **Tailwind v4**였다. v4는 JS 설정(`tailwind.config.ts`)
> 대신 CSS 안에서 `@theme` 로 토큰을 선언하는 CSS-first 방식을 쓴다. 아래가 실제 구현이다
> (`src/app/globals.css`). 의미는 기존 v3 예시와 동일하고, 생성되는 유틸리티 클래스명도 같다
> (`bg-surface-2`, `text-content-muted`, `bg-accent-soft`, `text-accent-on`, `bg-tier-s` 등).

```css
/* src/app/globals.css */
@import 'tailwindcss';
@import '../styles/tokens.css';

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-surface-raised: var(--surface-raised);

  --color-content: var(--text);
  --color-content-muted: var(--text-muted);
  --color-content-faint: var(--text-faint);

  --color-line: var(--border);
  --color-line-strong: var(--border-strong);

  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-accent-ring: var(--accent-ring);
  --color-accent-on: var(--text-on-accent);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-info: var(--info);

  --color-tier-s: var(--tier-s);
  --color-tier-a: var(--tier-a);
  --color-tier-b: var(--tier-b);
  --color-tier-c: var(--tier-c);

  --font-sans: var(--font-pretendard);
}
```

`bg-white`, `text-gray-500`, `#FFF` 같은 표기를 컴포넌트에 쓰면 안 된다. 리뷰에서 반려 대상.

> **근사치 표시**: `gotjawal`, `badang` 팔레트는 원본 이미지에 `--surface-raised` 값이 별도로
> 식별되지 않아 `--surface` 와 동일하게 채웠다. 시트/팝오버 컴포넌트를 만들 때(M3) 실제 화면과
> 대조해 필요하면 조정할 것.

---

## 3. 타이포그래피

**Pretendard Variable** 단일 패밀리로 간다. 한국어 UI에서 자간·숫자·영문 혼용이 가장 안정적이고,
이미지의 글자꼴도 이 계열로 보인다. 디스플레이 역할은 별도 폰트 대신 **웨이트와 자간으로** 만든다.
(폰트를 늘리면 웹폰트 용량이 커지고 한글은 특히 무겁다.)

```css
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
             'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif;
```

| 역할 | 크기/행간 | 웨이트 | 자간 | 쓰는 곳 |
|---|---|---|---|---|
| `display` | 28 / 34 | 800 | -0.03em | 히어로 카드 상호명 ("제주 해녀밥상") |
| `title` | 20 / 28 | 700 | -0.02em | 섹션 제목, 화면 타이틀 ("CRM") |
| `subtitle` | 16 / 24 | 600 | -0.01em | 카드 인물명 ("김민수") |
| `body` | 15 / 23 | 400 | -0.01em | 본문, 매장 소개 |
| `label` | 13 / 18 | 600 | 0 | 버튼, 배지, 메뉴명 |
| `caption` | 12 / 16 | 500 | 0 | 시간, 주소, 보조정보 |
| `micro` | 11 / 14 | 600 | 0.02em | 사이드레일 라벨, 탭 라벨 |

**숫자 규칙**: 가격·평수·보증금·평점 등 모든 수치는 `font-variant-numeric: tabular-nums`.
리스트에서 자릿수가 흔들리지 않게 한다. (`.tabular` 유틸 클래스 하나 만들어 재사용)

가격 표기는 `18,000원` — 천단위 콤마 + `원` 접미. 통화 기호(₩)를 쓰지 않는다(이미지 기준).
다국어에서는 `Intl.NumberFormat(locale, { style:'currency', currency:'KRW' })` 로 분기 (`docs/05`).

---

## 4. 레이아웃 · 간격 · 모서리

```css
--radius-card: 20px;   /* 카드 */
--radius-inner: 14px;  /* 카드 안 썸네일, 메뉴 이미지 */
--radius-chip: 10px;   /* 필터칩, 작은 배지 */
--radius-pill: 999px;  /* 등급 배지, 원형 버튼 */

--gap-1: 4px;  --gap-2: 8px;  --gap-3: 12px;
--gap-4: 16px; --gap-5: 20px; --gap-6: 24px; --gap-8: 32px;

--page-x: 16px;        /* 모바일 좌우 여백 */
--section-y: 24px;     /* 섹션 사이 세로 간격 */
```

- 화면 좌우 여백 16px 고정. 카드 내부 패딩 16px.
- 섹션 헤더와 첫 카드 사이 12px, 섹션 사이 24px.
- 그림자는 다크 모드에서 거의 쓰지 않는다(안 보인다). 대신 `--border` 로 면을 구분한다.
  라이트 모드에서만 `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`.

### 반응형

| 브레이크포인트 | 레이아웃 |
|---|---|
| ~ 640px | 모바일. 하단 탭바 (소상공인/소비자) 또는 좌측 아이콘 레일 (CRM) |
| 640 ~ 1024px | 2열 카드 그리드, 레일 유지 |
| 1024px ~ | 좌측 레일 확장(라벨 표시) + 본문 최대폭 1120px 중앙 정렬. 3열 그리드 |

원 제안서에 "모바일 우선 입력 / PC 중심 관리" 이원화가 명시돼 있다.
→ **입력 UI(컴포저, 사진 업로드)는 모바일 최적화, 통계·지도·관리 화면은 데스크톱 최적화.**

---

## 5. 핵심 컴포넌트

### 5.1 `HeroCarousel` — 시그니처 컴포넌트

ref-01(내 매장), ref-04(LOCAL HERO)에 나오는 그 카드.

```
┌─────────────────────────────────────────────┐
│ ╭──╮ ┌───────────────────────────────╮ ╭──╮ │
│ │02│ │ 01              [A등급]       │ │02│ │  ← 좌우 이웃 카드가 24px 물림
│ │  │ │                               │ │  │ │    (opacity .35, scale .92)
│ │  │ │      [사장님 전신 사진]        │ │  │ │
│ │  │ │                               │ │  │ │
│ │  │ │  제주 해녀밥상            ❤   │ │  │ │  ← display 28/800
│ │  │ │  30년 전통 해산물 전문         │ │  │ │  ← caption, muted
│ │  │ │  ★4.9 (128)  🗒 리뷰 256      │ │  │ │
│ │  │ │  🕐 08:00-20:30                │ │  │ │
│ │  │ │  📍 제주시 서귀포시             │ │  │ │
│ │  │ │  [ 자세히 보기 ]               │ │  │ │
│ ╰──╯ └───────────────────────────────╯ ╰──╯ │
│  ‹                                        ›  │  ← 좌우 원형 버튼, 세로 중앙
│              • ○ ○ ○ ○                       │  ← 페이지 도트
└─────────────────────────────────────────────┘
```

구현 규칙:
- 카드 비율 **3:4**. 사진은 `object-cover`, 인물 상체가 상단 60%에 오도록 `object-position: 50% 25%`.
- 텍스트 가독성: 하단 55%에 스크림 `linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 35%, transparent 70%)`.
  **사진 위 텍스트는 항상 흰색 고정** (`--text` 아님). 라이트 모드에서도 마찬가지 — 사진은 어둡기 때문.
- 활성 카드 링: `box-shadow: 0 0 0 2px var(--accent), 0 0 32px var(--accent-ring)`.
- 좌상단 순번(`01`, `02`)은 **캐러셀 위치를 알려주는 정보**이므로 유지한다. 장식이 아니다.
- 우상단 등급 배지 또는 카테고리 배지 (`pill`, `--tier-*` 배경, 12/700).
- 스와이프(터치) + 좌우 버튼 + 키보드 화살표 모두 지원. `prefers-reduced-motion` 시 트랜지션 제거.
- 접근성: `role="region"`, `aria-roledescription="carousel"`, 각 슬라이드 `aria-label`.

### 5.2 `TierBadge`

```tsx
<TierBadge tier="A" />   // 배경 var(--tier-a), 텍스트 흰색, pill, 12px/700, padding 4px 10px
```

라벨은 i18n 키 `tier.S`~`tier.C` → ko: `S등급` / en: `Tier S`.

### 5.3 `PersonCard` (CRM 고객카드) — ref-03

```
┌──────────────────────────────────────────────┐   ← 좌측 4px 등급 컬러 바 또는
│ ┌────────┐  김민수  [A등급]                  │      전체 1px 등급색 테두리
│ │        │  제주중앙자동차                    │
│ │  사진   │  대표                             │   특이사항
│ │  4:5   │  📞 010-1234-5678                 │   신차 출시 관심 높음
│ │        │  ⊙ⓘ (SNS 아이콘)      [ 상담로그 ] │   ← 우측 정렬 outline 버튼
│ └────────┘                                   │      테두리색 = 등급색
└──────────────────────────────────────────────┘
```

- 사진 88×110, `--radius-inner`.
- 카드 테두리 = 등급색 (다크에서는 1px + 미세 글로우, 라이트에서는 1px + 배경 `--surface`).
- "특이사항"은 라벨(caption, muted) + 값(label) 2줄, 우측 컬럼.
- 상담로그 버튼: outline, 텍스트·테두리 등급색.

### 5.4 `QuickActionGrid` — ref-02 상단 6칸

6개 아이콘 타일(3×2 또는 6×1 가로 스크롤). 각 타일: 아이콘 24px + 라벨 12/600.
배경 `--surface-2`, 라디우스 14px, 정사각 비율. 활성 상태 없음(전부 바로가기).

### 5.5 `SectionCard` — 섹션 컨테이너

```
섹션 제목 (title)                            더보기 ›
┌──────────────────────────────────────────────┐
│ (내용)                                        │
└──────────────────────────────────────────────┘
```
제목 좌측, "더보기 ›" 우측 (label, `--text-muted`). 제목 아래 12px.

### 5.6 `ComposerSheet` — ref-01 하단 시트 ★ 제품의 핵심 UI

원 제안서가 "이 사업 성패의 8할"이라고 말한 입력 장벽 제거 장치다. **카카오톡과 같은 감각**이 목표.

```
┌──────────────────────────────────────────────┐
│  소식이나 사진을 남겨보세요!            [ ➤ ] │  ← 입력 힌트 + 원형 전송 버튼(accent)
│  ──────────────────────────────────────────  │
│   T        🖼        🎤        💬            │
│  텍스트     사진      음성    익명방에 글쓰기   │
└──────────────────────────────────────────────┘
                    ( ✕ )                        ← 닫기 FAB, accent 배경
```
- 화면 하단 고정. `--surface-raised`, 상단 모서리만 20px 라운드.
- 4개 액션 아이콘: 각각 `--surface-2` 배경의 작은 타일 + 라벨 11/600.
- 전송 버튼은 내용이 있을 때만 `--accent`, 비어 있으면 `--text-faint`.
- 키보드가 올라와도 시트가 가려지지 않게 `env(safe-area-inset-bottom)` 처리.

### 5.7 `SideRail` / `BottomNav`

- **CRM(설계사)**: 좌측 세로 레일. 홈 / CRM / 상담로그 / 일정 / 메시지 / 통계 / 설정.
  활성 항목은 `--accent-soft` 배경 + 아이콘·라벨 `--accent`. (ref-03)
- **소비자(LOCAL HERO)**: 좌측 레일. 홈 / 히어로 / 마켓 / 이벤트 / 찜한가게 / 마이페이지. (ref-04)
- **소상공인**: 하단 탭바 5칸 — 홈 / 알림 / **글쓰기(중앙 FAB)** / 내정보 / 더보기. (ref-02)
  중앙 FAB은 `--accent` 원형, 위로 8px 돌출.

역할마다 내비 형태가 다른 것은 의도된 것이다. 통일하지 말 것.

### 5.8 `ListingCard`, `SupportItem`, `GroupBuyCard`

- **ListingCard** (ref-02 부동산): 이미지 위 좌상단 `임대`/`매매` 배지(`--info`/`--warning`),
  아래 제목 → `보증금 3,000 / 월 150` → `25평 · 1층` (caption, muted).
- **SupportItem** (정부지원): 좌측 아이콘 타일 + 제목 + `최대 7천만원 · 연 2.0%` + 우측 `›`.
  **하단에 출처 링크 필수** (`docs/02` §7).
- **GroupBuyCard**: 가로형. 좌측 상품 이미지, 우측 제목 + `마감까지 2일 남음`(danger) +
  `참여인원 128명` + 우상단 `최대 28% 할인` 배지.

---

## 6. 다크 / 라이트 토글

### 6.1 요구사항

- 3상태: **라이트 / 다크 / 시스템**. 기본은 시스템.
- 새로고침 시 깜빡임(FOUC) 없어야 함.
- 로그인 사용자는 선택이 `users.themePreference` 에 저장돼 기기 간 유지.
- 팔레트(`basalt`/`gyul`/`gotjawal`/`badang`) 선택도 함께 저장 (`users.palette`).

### 6.2 구현

```tsx
// src/app/[locale]/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children, params }) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"          // .dark 클래스 부착
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange  // 전환 시 색 애니메이션으로 인한 잔상 방지
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

팔레트는 `next-themes` 와 별개로 `<html data-palette="...">` 를 직접 관리한다.

```tsx
// src/components/theme/PaletteProvider.tsx
'use client'
useEffect(() => {
  document.documentElement.setAttribute('data-palette', palette)
  localStorage.setItem('palette', palette)
}, [palette])
```

FOUC 방지 인라인 스크립트를 `<head>` 에 넣는다 (next-themes가 테마는 처리하지만 팔레트는 직접 해야 함).

```html
<script dangerouslySetInnerHTML={{ __html: `
  try {
    var p = localStorage.getItem('palette') || 'basalt';
    document.documentElement.setAttribute('data-palette', p);
  } catch (e) {}
`}} />
```

### 6.3 토글 UI

- 위치: 앱 헤더 우측 (알림 아이콘 옆) + 설정 화면.
- 형태: **세그먼트 컨트롤 3칸** (`☀ 라이트 · ☾ 다크 · ⚙ 시스템`). 단순 on/off 스위치는
  "시스템" 상태를 표현할 수 없으므로 쓰지 않는다.
- `aria-label` 은 i18n 키 `theme.toggleLabel`.
- 마운트 전에는 아이콘을 렌더하지 않는다(하이드레이션 불일치 방지). 자리는 고정폭으로 잡아둔다.

```tsx
'use client'
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9 w-28" aria-hidden />
  // 세그먼트 3칸 렌더
}
```

### 6.4 다크/라이트에서 반드시 다르게 처리할 것

| 요소 | 라이트 | 다크 |
|---|---|---|
| 카드 구분 | 그림자 사용 | 그림자 대신 `--border` |
| 사진 위 스크림 | 동일하게 진하게 유지 | 동일 |
| 등급 배지 | 채도 그대로 | 채도 그대로 (변경 금지) |
| 강조색 링 글로우 | 약하게(0.18 alpha) | 강하게(0.45 alpha) |
| 이미지 | 그대로 | `filter: brightness(.95)` 로 눈부심 완화 |

---

## 7. 모션

- 기본 트랜지션 `150ms cubic-bezier(.2,.8,.2,1)`.
- 카드 캐러셀 전환 `280ms`. 스와이프 중에는 손가락 따라감(트랜지션 없음).
- 하단 시트 열림 `220ms` 슬라이드업.
- **`prefers-reduced-motion: reduce` 면 모든 트랜지션·애니메이션 제거.** 예외 없음.
- 스켈레톤 로딩만 사용. 스피너는 쓰지 않는다(리스트 화면이 대부분이라 스켈레톤이 맞다).

## 8. 접근성 최소선

- 모든 인터랙티브 요소에 보이는 포커스 링: `outline: 2px solid var(--accent); outline-offset: 2px`.
- 터치 타깃 최소 44×44.
- 아이콘 전용 버튼에 `aria-label` 필수.
- 색만으로 정보를 전달하지 않는다 — 등급은 색 + 문자(`A등급`)를 함께 표시한다(이미지도 그렇게 돼 있다).
- 이미지 `alt` 는 의미 있게. 사장님 사진은 `"{name} 사장님"`.

## 9. 카피 원칙

- 버튼은 동작을 그대로 말한다. `저장` → 토스트도 `저장했습니다`. `제출` 같은 시스템 용어 금지.
- 빈 화면은 "없음"이 아니라 다음 행동을 제안한다.
  예) 고객이 0명일 때: "첫 고객을 등록해 보세요" + `[신규 등록]` 버튼.
- 오류는 사과하지 않고 무엇이 잘못됐고 어떻게 고치는지만 말한다.
- 사용자를 부르는 말은 역할별로 다르다: 설계사 → 이름, 소상공인 → **"사장님"**, 소비자 → 이름.
  (ref-02의 "사장님, 오늘도 수고 많으셨어요!" 톤을 유지)
