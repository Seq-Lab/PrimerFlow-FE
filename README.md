# 🧬 PrimeFlow: Frontend Visualization Engine

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Canvas API](https://img.shields.io/badge/HTML5-Canvas_API-orange?logo=html5)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)

> **High-Performance PCR Primer Design & Visualization Platform**
> 
> 대용량 유전자 서열(10,000bp+)을 웹 브라우저에서 지연 없이 분석하고 시각화하는 프론트엔드 엔진 리포지토리입니다.

## 📖 프로젝트 개요

**PrimeFlow**는 생명과학 연구원들이 PCR 프라이머를 설계할 때 겪는 비효율을 해결하기 위한 웹 솔루션입니다.
본 리포지토리(Frontend)는 백엔드에서 분석된 유전자 데이터와 프라이머 후보군을 **HTML5 Canvas**를 활용해 시각적으로 표현하는 데 집중합니다.

### 💡 핵심 기술 (Key Features)

* **Custom Rendering Engine:** DOM 조작 방식이 아닌, Canvas API 기반의 자체 렌더링 엔진을 구현하여 10,000bp 이상의 데이터를 60fps로 부드럽게 렌더링합니다.
* **Optimization Algorithms:**
    * **View Culling:** 이분 탐색(Binary Search)을 활용하여 화면 밖의 데이터 렌더링을 생략합니다.
    * **Auto Layout:** 그리디(Greedy) 알고리즘을 응용하여 겹치는 프라이머 구간을 자동으로 배치합니다.
* **Interactive UX:** 행렬 변환(Matrix Transformation)을 적용한 정밀한 Zoom-In/Out 및 Panning 기능을 제공합니다.

## 🛠 기술 스택 (Tech Stack)

* **Core:** Next.js 14 (App Router), TypeScript
* **Graphics:** HTML5 Canvas API (2D Context)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Data Fetching:** SWR / TanStack Query
* **Deployment:** Vercel

```text
primeflow-frontend/
├── .github/                 # Github Actions (CI/CD)
├── public/                  # 정적 파일 (Favicon, Logo 등)
├── docs/                    # 📄 [핵심] 문서 및 프롬프트 저장소
│   ├── api_specs/           # 백엔드와 합의된 JSON 데이터 명세
│   └── prompts/             # AI에게 입력한 기능 명세서 (라이브러리화)
│       ├── canvas_rendering.md
│       ├── zoom_pan_logic.md
│       └── api_integration.md
|   └── strategy/
├── src/
│   ├── app/                 # Next.js App Router (페이지)
│   │   ├── page.tsx         # 메인 대시보드
│   │   ├── layout.tsx       # 전체 레이아웃
│   │   └── globals.css      # 전역 스타일 (Tailwind)
│   ├── components/
│   │   ├── canvas/          # 🎨 [핵심] 시각화 엔진 컴포넌트
│   │   │   ├── GenomeCanvas.tsx   # 메인 캔버스 래퍼
│   │   │   ├── TooltipLayer.tsx   # 마우스 오버 툴팁
│   │   │   └── Controls.tsx       # 줌/팬 컨트롤러
│   │   ├── ui/              # 공통 UI (Button, Input 등 - Shadcn/UI 추천)
│   │   └── layout/          # Header, Sidebar 등
│   ├── hooks/               # 커스텀 훅
│   │   ├── useCanvas.ts     # Canvas Context 제어 훅
│   │   └── useGenomeData.ts # 데이터 페칭 (SWR/TanStack Query)
│   ├── lib/                 # 🧮 알고리즘 및 유틸 함수
│   │   ├── math/            # 좌표 변환, 행렬 연산 (Affine Transform)
│   │   ├── parsers/         # API 데이터 파싱
│   │   └── algorithms/      # 프론트엔드용 최적화 (Binary Search, Greedy Layout)
│   ├── store/               # 전역 상태 관리 (Zustand)
│   │   └── useViewStore.ts  # 줌 레벨, 뷰포트 위치 상태
│   ├── types/               # TypeScript 타입 정의
│   │   └── api.ts           # 백엔드 데이터 인터페이스
│   └── services/            # API 호출 함수 (Axios)
├── .eslintrc.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 시작하기 (Getting Started)

### 사전 요구사항
* Node.js 18.17.0 이상
* npm 또는 yarn

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone [https://github.com/Seq-Lab/PrimerFlow-FE.git](https://github.com/Seq-Lab/PrimerFlow-FE.git)

# 2. 프로젝트 폴더로 이동
cd PrimerFlow-FE

# 3. 패키지 설치
npm install

# 4. 환경 변수 설정 (.env.local 생성)
# (백엔드 API 주소 설정 예시)
# echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# 5. 개발 서버 실행
npm run dev
```

