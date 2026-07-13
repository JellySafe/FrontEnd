# JellySafe Public Rules

## Scope

이 폴더는 일반 사용자용 JellySafe 서비스다.

- 모바일 퍼스트 웹앱이다.
- 로그인과 회원가입 기능이 없다.
- Admin 라우트, 내비게이션, 인증 로직을 추가하지 않는다.
- `apps/admin`의 코드를 직접 import하지 않는다.
- 공통 토큰과 UI는 `@jellysafe/design-system`을 재사용한다.

## Structure

다음 구조를 사용한다.

    src/
      app/
      features/
      shared/

- `app`: 라우트, 레이아웃, Provider, 페이지 조립
- `features`: Public 서비스 기능
- `shared`: Public 내부에서만 재사용하는 UI, 훅, 유틸리티, 타입

해변 검색, 알림, 해파리 제보처럼 Public 서비스 의미가 포함된 컴포넌트는 이 앱 내부에 둔다.

## Responsive Rules

현재 Figma에는 모바일 디자인만 존재한다.

- 모바일 Figma 화면을 기준으로 정확히 구현한다.
- 별도의 데스크톱 정보 구조를 임의로 만들지 않는다.
- 넓은 화면에서는 모바일 웹앱 구조를 유지하고 가운데 정렬된 제한 너비 컨테이너를 사용한다.
- 모바일 요소를 화면 전체 너비로 무작정 늘리지 않는다.
- 고정 하단 내비게이션이 콘텐츠를 가리지 않게 한다.
- 필요한 경우 safe area를 반영한다.
- 의도하지 않은 가로 스크롤이 생기지 않게 한다.
- 터치 영역을 충분히 확보한다.

## Authentication

- 로그인 페이지를 만들지 않는다.
- 회원가입, 세션, 토큰, 역할, 인증 Guard를 추가하지 않는다.
- Public 라우트를 인증으로 막지 않는다.

## UI Rules

- 디자인 시스템에 동일한 컴포넌트가 있으면 새로 만들지 않는다.
- Button, TextField, Chip, Badge, Dropdown 등 공통 UI는 디자인 시스템을 우선 사용한다.
- Figma에서 제공하는 SVG, 이미지, 아이콘을 그대로 사용한다.
- 범용 아이콘 라이브러리를 임의로 설치하지 않는다.
- 서버 데이터 화면은 loading, empty, error, success 상태를 고려한다.
- 백엔드 계약이 나오기 전까지 API 구조를 임의로 만들지 않는다.

## Verification

Public 앱만 수정한 경우 다음을 실행한다.

    pnpm --filter @jellysafe/public lint
    pnpm --filter @jellysafe/public typecheck
    pnpm --filter @jellysafe/public build

디자인 시스템을 수정한 경우 Admin 앱도 함께 검증한다.