# @workly/icons

Workly 프로젝트의 아이콘 패키지입니다. SVG 아이콘들과 TypeScript 타입 정의를 제공합니다.

## 📁 구조

```
packages/icons/
├── svgs/                    # SVG 아이콘 파일들 (169개)
├── scripts/
│   ├── optimize-svgs.js     # SVG 최적화 스크립트
│   └── generate-types.js    # IconName 타입 생성 스크립트
├── src/
│   ├── types.ts            # IconName 타입 정의 (자동 생성)
│   └── index.ts            # 패키지 엔트리포인트
└── dist/                   # 빌드 결과물
```

## 🚀 사용법

### 기본 사용법

```tsx
import Icon from '@workly/ui/Icon';
import { IconName } from '@workly/icons';

// 기본 사용
<Icon name="add-line" />

// 크기 지정
<Icon name="arrow-right-line" size={24} />

// 색상 지정
<Icon name="check-line" color="green-500" />

// 객체 형태 크기 지정
<Icon name="close-line" size={{ width: 20, height: 20 }} />
```

### 타입 안전성

```tsx
// IconName 타입으로 자동완성 지원
const iconName: IconName = "add-line"; // ✅ 유효한 아이콘 이름
const invalidIcon: IconName = "invalid-icon"; // ❌ 타입 에러
```

## 🛠️ 개발 스크립트

### SVG 최적화

```bash
npm run optimize-svgs
```

SVG 파일들을 최적화합니다:
- 불필요한 메타데이터 제거
- 파일 크기 최소화
- 일관된 형식으로 정리

### 타입 생성

```bash
npm run generate-types
```

SVG 파일명을 기반으로 `IconName` 타입을 자동 생성합니다.

### 빌드

```bash
npm run build
```

타입 생성 후 패키지를 빌드합니다.

## 📝 아이콘 추가하기

1. **SVG 파일 추가**: `svgs/` 폴더에 새로운 SVG 파일을 추가합니다.
   ```bash
   # 예: new-icon.svg 추가
   ```

2. **SVG 최적화**: 
   ```bash
   npm run optimize-svgs
   ```

3. **타입 업데이트**:
   ```bash
   npm run generate-types
   ```

4. **빌드**:
   ```bash
   npm run build
   ```

새로운 아이콘이 `IconName` 타입에 자동으로 추가되어 타입 안전성을 보장합니다.

## 🎨 아이콘 명명 규칙

- kebab-case 사용: `arrow-right-line`
- 의미있는 이름: `add-circle-line`, `delete-bin-line`
- 일관된 접미사: `-line`, `-fill` 등

## 📦 패키지 정보

- **타입 정의**: TypeScript 지원
- **트리 셰이킹**: ESM 모듈로 최적화
- **SVG 접근**: 직접 SVG 파일 import 가능
- **자동 타입 생성**: 아이콘 추가 시 타입 자동 업데이트

## 🔗 관련 패키지

- `@workly/ui`: 실제 Icon 컴포넌트 구현
- `@workly/api`: API 타입 정의
- `@workly/editor`: 에디터 컴포넌트

## 📋 현재 아이콘 목록

총 169개의 아이콘이 포함되어 있습니다:

- **화살표**: `arrow-*-line`
- **액션**: `add-*`, `delete-*`, `edit-*`
- **UI**: `menu-*`, `close-*`, `check-*`
- **미디어**: `play-*`, `pause-*`, `stop-*`
- **기타**: `user-*`, `settings-*`, `search-*`

전체 아이콘 목록은 `src/types.ts` 파일에서 확인할 수 있습니다.