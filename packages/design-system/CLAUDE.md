@./AGENTS.md

# Claude Code Design System Rules

- 화면 구현보다 Figma의 foundation과 component set을 먼저 분석한다.
- 정확한 Figma 노드와 screenshot을 기준으로 작업한다.
- 부모·자식 구조, variant, property, constraint를 확인한 뒤 컴포넌트 경계를 정한다.
- 반복되는 Figma 레이어 이름을 중복 컴포넌트로 판단하지 않는다.
- 여러 내부 요소가 하나의 시각 컴포넌트를 구성하면 외부에는 하나의 컴포넌트만 공개한다.
- Figma에서 제공하는 에셋을 프로젝트에 영구 저장하고 임시 URL을 남기지 않는다.
- 사용자 승인 없이 UI 또는 아이콘 라이브러리를 설치하지 않는다.
- 패키지의 public export를 변경하기 전에 변경 대상과 영향을 받는 앱을 먼저 알린다.
- 작업 완료 후 토큰 매핑, variant, 에셋 위치, 검증 결과를 한국어로 보고한다.