# Workly

Workly는 Next.js와 디자인 시스템 기반으로 한 협업 웹 애플리케이션 포트폴리오입니다. TypeScript, Vanilla Extract CSS, 그리고 재사용 가능한 UI를 만들어 두었고 /guide 페이지 에서 예제를 볼 수 있습니다.

## 🚀 기술 스택

- **Framework**: Next.js 15.4.1
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Vanilla Extract CSS
- **Icons**: SVG 기반 아이콘 시스템
- **Linting**: ESLint

## 📦 주요 기능

### UI 컴포넌트 라이브러리

- **Button**: 다양한 스타일과 색상 변형을 지원하는 버튼 컴포넌트
- **Input**: 텍스트 입력 필드와 관련 컴포넌트들
- **CheckBox**: 체크박스 및 체크박스 필드 컴포넌트
- **Radio**: 라디오 버튼 및 라디오 그룹 컴포넌트
- **Select**: 드롭다운 선택 컴포넌트
- **Badge**: 배지 컴포넌트
- **Avatar**: 아바타 및 아바타 그룹 컴포넌트
- **Icon**: SVG 아이콘 시스템
- **Dropdown**: 드롭다운 메뉴 컴포넌트
- **InputHint**: 입력 힌트 컴포넌트

### 아이콘 시스템

- 100개 이상의 SVG 아이콘
- TypeScript 타입 자동 생성
- SVGO를 통한 최적화

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
# 개발 모드로 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 린팅

```bash
# ESLint 실행
npm run lint
```

## 📁 프로젝트 구조

```
workly/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── assets/
│   │   └── images/
│   │       └── icons/      # SVG 아이콘들
│   ├── shared/
│   │   ├── ui/             # UI 컴포넌트 라이브러리
│   │   ├── config/         # 설정 파일들
│   │   ├── providers/      # React Provider들
│   │   └── styles/         # 스타일 관련 파일들
│   ├── entities/           # 비즈니스 엔티티
│   ├── features/           # 기능별 모듈
│   ├── hooks/              # 커스텀 React 훅
│   ├── pages/              # 페이지 컴포넌트
│   └── widgets/            # 위젯 컴포넌트
├── public/                 # 정적 파일들
│   └── fonts/             # Pretendard 폰트
├── scripts/               # 유틸리티 스크립트
└── package.json
```

## 🎨 스타일링

이 프로젝트는 **Vanilla Extract CSS**를 사용하여 타입 안전한 CSS-in-JS 솔루션을 제공합니다.

### CSS 파일 구조

- 각 컴포넌트는 자체 `.css.ts` 파일을 가집니다
- 예: `Button/button.css.ts`, `CheckBox/checkbox.css.ts`

### 색상 시스템

- `src/shared/styles/colorTypes.ts`: 색상 타입 정의
- `src/shared/styles/colorVariants.ts`: 색상 변형 정의

## 🔧 스크립트

### 아이콘 타입 생성

```bash
npm run gen:icons
```

### SVG 최적화

```bash
npm run svgo
```

## 📝 개발 가이드

### 새로운 컴포넌트 추가

1. `src/shared/ui/` 디렉토리에 새 컴포넌트 폴더 생성
2. `index.tsx` 파일에 컴포넌트 로직 작성
3. `component.css.ts` 파일에 스타일 정의
4. 필요한 경우 타입 정의 추가

### 아이콘 추가

1. `src/assets/images/icons/` 디렉토리에 SVG 파일 추가
2. `npm run gen:icons` 실행하여 타입 자동 생성
3. `npm run svgo` 실행하여 SVG 최적화

## 🚀 배포

이 프로젝트는 github action을 통해 docker로 배포됩니다.

```bash
# 프로덕션 빌드
npm run build

# 로컬에서 프로덕션 서버 실행
npm start
```
