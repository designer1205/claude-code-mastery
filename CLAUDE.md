# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 저장소 개요

이 워크스페이스는 하나의 통합 프로젝트가 아니라, 서로 독립적인 소규모 정적 웹 프로젝트들의 모음입니다. 각 프로젝트는 자체 폴더 안에서 완결되며, 공통 빌드 시스템이나 패키지 매니저는 없습니다.

- **`bucket-list-main/bucket-list-main/`** — "나의 버킷 리스트": LocalStorage 기반 바닐라 JS 버킷리스트 CRUD 앱. 완성된 코드가 있으며, 상세 아키텍처는 해당 폴더의 `CLAUDE.md`에 문서화되어 있음 (아래 요약 참고).
- **`dev-resume/`** — 개발자 웹 이력서(포트폴리오) 사이트. 현재는 `ROADMAP.md`만 존재하는 기획 단계이며, 코드는 아직 작성되지 않음. Phase 2(프로젝트 셋업)부터 `index.html`/`css/`/`js/` 구조를 만들 예정.

각 프로젝트 폴더 안에서 작업할 때는 해당 폴더의 파일(및 있다면 하위 `CLAUDE.md`)을 우선 참고하세요.

## 실행 방법

두 프로젝트 모두 빌드/린트/테스트 도구가 없는 순수 정적 사이트입니다 (`package.json` 없음). 실행 방법은 동일합니다:

- `index.html`을 브라우저에서 더블클릭하여 직접 열기
- VS Code Live Server 확장으로 "Open with Live Server"
- `python -m http.server 8000` 실행 후 `http://localhost:8000` 접속

## bucket-list-main 아키텍처 요약

- `js/storage.js`의 `BucketStorage`: `localStorage`(키 `bucketList`)를 매번 통째로 읽고/쓰는 순수 데이터 계층 (인메모리 캐시 없음). CRUD, 통계(`getStats`), 필터링(`getFilteredList`) 담당.
- `js/app.js`의 `BucketListApp`: DOM 캐싱/이벤트 바인딩/렌더링 담당 클래스. `DOMContentLoaded` 시점에 전역 `app` 인스턴스로 생성됨.
- 렌더링은 가상 DOM 없이 상태 변경마다 `render()`가 리스트 전체 HTML을 재생성 (`innerHTML`). 규모가 작아 의도된 설계이므로 확장 시에도 부분 업데이트 로직을 새로 도입하지 말 것.
- 리스트 아이템 버튼은 `onclick="app.xxx(...)"` 형태의 인라인 핸들러로 전역 `app` 인스턴스를 호출하는 컨벤션을 따름 (`addEventListener` 위임 방식이 아님).
- 사용자 입력 문자열을 `innerHTML`에 넣기 전에는 `app.js`의 `escapeHtml()`로 반드시 이스케이프 (XSS 방지).
- 수정(edit)은 단일 모달(`#editModal`)을 재사용하며, `app.editingId`로 현재 수정 대상 아이템을 추적.
- Tailwind CSS는 CDN(`https://cdn.tailwindcss.com`) 스크립트 태그로만 로드됨 — `tailwind.config.js`는 빈 파일로 실제로 사용되지 않음. `css/styles.css`는 Tailwind 유틸리티로 처리 안 되는 애니메이션/필터 버튼 active 상태/다크모드 보정 등 보완용 CSS만 포함.

## dev-resume 아키텍처 방향

`dev-resume/ROADMAP.md`에 정의된 대로, bucket-list-main과 동일하게 **빌드 도구 없이 Tailwind CDN**을 사용하는 무빌드 방식으로 시작합니다. 예정 구조:

```
dev-resume/
├── index.html
├── css/styles.css   # Tailwind 보완용 커스텀 CSS
├── js/main.js       # 다크모드 토글, 모바일 메뉴, 스크롤 인터랙션
└── assets/
```

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성
- **변수명/함수명**: 영어 (코드 표준 준수)
