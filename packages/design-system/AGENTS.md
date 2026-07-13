# JellySafe Design System Rules

## Purpose

이 패키지는 Public과 Admin이 함께 사용하는 단일 디자인 시스템이다.

포함 가능:

- primitive 및 semantic token
- typography, spacing, radius, shadow
- 공통 아이콘과 에셋
- 재사용 가능한 UI 컴포넌트

포함 금지:

- 라우트
- API 호출
- 인증 로직
- 서비스 도메인 기능
- 애플리케이션 상태
- Public 또는 Admin 전용 컴포넌트

`apps/public`이나 `apps/admin`의 코드를 직접 import하지 않는다.

## Structure

필요한 폴더만 생성한다.

    src/
      assets/
        icons/
      components/
      styles/
      index.ts

## Figma Workflow

컴포넌트를 구현하기 전에 다음을 확인한다.

1. 정확한 Figma 컴포넌트 또는 Component Set
2. 부모·자식 레이어 구조
3. variant, size, state, property
4. 동일 노드의 screenshot
5. 기존 토큰과 코드 컴포넌트
6. 필요한 SVG와 이미지 에셋

Figma 레이어 이름이 반복돼도 중복 컴포넌트로 판단하지 않는다.

여러 개의 동일 이름 레이어가 하나의 컴포넌트를 구성할 수 있다. 예를 들어 여러 시각 요소가 하나의 로딩 스피너를 만들면, 코드에서는 하나의 `LoadingSpinner`만 외부에 공개하고 내부 요소로 구현한다.

레이어 이름만 보고 삭제, 병합, 중복 제거하지 않는다.

## Tokens

다음 순서로 구성한다.

    Primitive token
    → Semantic token
    → 필요한 경우 Component token

- TSX에 raw hex 값을 사용하지 않는다.
- 애플리케이션에서는 semantic token을 우선 사용한다.
- 기존 color, spacing, radius, shadow 값을 중복 생성하지 않는다.
- Figma의 font size, weight, line height, letter spacing을 유지한다.
- Figma에 없는 값을 임의로 만들지 않는다.
- 사용할 수 없는 폰트를 임의로 대체하지 말고 사용자에게 알린다.

## Components

- 컴포넌트명과 파일명은 `PascalCase`를 사용한다.
- 의미 있는 variant와 size는 명시적인 union type으로 정의한다.
- 관련 없는 boolean prop을 과도하게 만들지 않는다.
- 필요한 경우 `className` 확장을 지원한다.
- 가능한 경우 semantic HTML과 native element를 사용한다.
- 키보드 조작과 focus-visible 상태를 지원한다.
- 아이콘 전용 버튼에는 접근 가능한 이름을 제공한다.
- 도메인 문구, API 로직, 앱 상태를 포함하지 않는다.
- 내부 시각 요소를 불필요하게 별도 public component로 export하지 않는다.
- UI 또는 아이콘 라이브러리는 승인 없이 설치하지 않는다.

## Assets

- Figma의 SVG, 아이콘, 이미지, 일러스트를 그대로 사용한다.
- 비슷한 라이브러리 아이콘으로 교체하지 않는다.
- 임시 또는 만료 가능한 Figma URL을 최종 코드에 남기지 않는다.
- 공통 아이콘은 `src/assets/icons`에 저장한다.
- SVG의 `viewBox`를 보존한다.
- 파일명은 역할이 드러나는 영어 이름을 사용한다.
- 런타임 커스터마이징이 필요하지 않으면 모든 SVG를 React 컴포넌트로 변환하지 않는다.

## Exports

- 외부에서 사용할 항목은 `src/index.ts`를 통해 공개한다.
- 애플리케이션에서 내부 파일을 deep import하지 않게 한다.
- 불필요한 barrel file을 만들지 않는다.
- 순환 의존성이 생기지 않게 한다.

## Verification

디자인 시스템을 수정한 뒤 다음을 실행한다.

    pnpm lint
    pnpm typecheck
    pnpm build

Public과 Admin이 모두 정상적으로 빌드되어야 한다.