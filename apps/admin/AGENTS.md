<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# JellySafe Admin Rules

## Scope

이 폴더는 관리자용 JellySafe 대시보드다.

- 데스크톱 중심의 독립 서비스다.
- Public 라우트와 내비게이션을 추가하지 않는다.
- `apps/public`의 코드를 직접 import하지 않는다.
- 공통 토큰과 UI는 `@jellysafe/design-system`을 재사용한다.

## Structure

다음 구조를 사용한다.

    src/
      app/
      features/
      shared/

- `app`: 라우트, 레이아웃, Provider, 페이지 조립
- `features`: 관리자 기능과 업무 단위
- `shared`: Admin 내부에서 재사용하는 UI, 훅, 유틸리티, 타입

관리자 전용 사이드바, 테이블, 차트, 필터, 관리 폼은 이 앱 내부에 둔다.

## Responsive Rules

현재 Figma에는 데스크톱 디자인만 존재한다.

- 데스크톱 Figma 화면을 기준으로 정확히 구현한다.
- 모바일 대시보드를 임의로 만들지 않는다.
- 테이블을 임의로 카드 형태로 변경하지 않는다.
- 컬럼, 필터, 주요 액션과 정보 밀도를 유지한다.
- 좁은 화면에서는 최소 너비나 내부 가로 스크롤을 사용한다.
- Figma에 없는 사이드바 접기나 Drawer 동작을 임의로 추가하지 않는다.
- 테이블만 스크롤되어야 하는 경우 페이지 전체에 가로 스크롤이 생기지 않게 한다.

## Authentication

Admin은 정해진 아이디와 비밀번호를 입력하는 로그인 화면만 존재하며 회원가입은 없다.

백엔드 인증 방식은 아직 정해지지 않았다.

- API 정보가 오기 전에는 로그인 UI만 구현한다.
- 인증 엔드포인트나 응답 구조를 임의로 만들지 않는다.
- JWT, 쿠키, 세션, localStorage 사용을 임의로 결정하지 않는다.
- 실제 아이디와 비밀번호를 코드에 하드코딩하지 않는다.
- 회원가입, 비밀번호 찾기, 소셜 로그인 기능을 추가하지 않는다.

## UI Rules

- 디자인 시스템에 동일한 컴포넌트가 있으면 새로 만들지 않는다.
- Button, TextField, Chip, Badge, Dropdown, Combobox, Tab 등은 디자인 시스템을 우선 사용한다.
- Figma에서 제공하는 SVG, 이미지, 아이콘을 그대로 사용한다.
- 범용 아이콘 라이브러리를 임의로 설치하지 않는다.
- 테이블과 데이터 화면은 loading, empty, error, overflow 상태를 고려한다.
- 필터, 검색, 정렬, 페이지네이션 상태는 일관되게 관리한다.
- 백엔드 계약이 나오기 전까지 API 구조를 임의로 만들지 않는다.

## Verification

Admin 앱만 수정한 경우 다음을 실행한다.

    pnpm --filter @jellysafe/admin lint
    pnpm --filter @jellysafe/admin typecheck
    pnpm --filter @jellysafe/admin build

디자인 시스템을 수정한 경우 Public 앱도 함께 검증한다.