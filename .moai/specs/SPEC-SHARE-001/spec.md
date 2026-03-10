---
id: SPEC-SHARE-001
version: 1.0.0
status: Planned
created: 2026-03-10
updated: 2026-03-10
author: 9bit
priority: High
tags: [share, kakao, camera, mobile, web-share-api]
---

# SPEC-SHARE-001: 모바일 사진 촬영 후 카카오톡 공유 기능

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-03-10 | 9bit | 초기 SPEC 작성 |

## 개요

결혼식 청첩장 웹사이트에서 모바일 사용자가 사진을 촬영하거나 갤러리에서 선택한 후, 카카오톡을 통해 청첩장을 공유할 수 있는 기능을 구현한다. Web Share API를 우선 사용하고, 미지원 환경(카카오톡 인앱 브라우저 등)에서는 Kakao Share SDK로 폴백하며, 두 방식 모두 실패 시 클립보드 복사로 최종 폴백한다.

## 목표

- 모바일 사용자가 직관적으로 사진을 촬영/선택하고 공유할 수 있는 UX 제공
- Web Share API + Kakao Share SDK + 클립보드 복사의 3단계 폴백 전략으로 높은 공유 성공률 확보
- 기존 코드베이스의 패턴(IIFE 클로저, 모달, 스크롤 잠금)을 재사용하여 일관성 유지
- 정적 사이트(GitHub Pages) 제약 내에서 클라이언트 사이드 전용으로 구현

## 요구사항

### REQ-SHARE-001 (Event-Driven)

**WHEN** 사용자가 "사진 찍고 공유하기" 버튼을 탭하면, **THE SYSTEM SHALL** `<input type="file" accept="image/*" capture="environment">`를 트리거하여 카메라 앱 또는 갤러리를 실행한다.

### REQ-SHARE-002 (Event-Driven)

**WHEN** 사진 선택/촬영이 완료되면, **THE SYSTEM SHALL** Canvas API로 이미지를 최대 1920px로 리사이징(JPEG quality 0.85)한 후 미리보기 모달에 표시한다.

### REQ-SHARE-003 (Ubiquitous)

미리보기 모달은 기존 방명록/갤러리 모달과 동일한 scroll lock 패턴(`body.style.overflow = 'hidden'`, `position: fixed`)을 **항상** 재사용해야 한다.

### REQ-SHARE-004 (Event-Driven)

**WHEN** 미리보기 모달에서 "공유하기" 버튼을 탭하면, **THE SYSTEM SHALL** `navigator.share({ files: [resizedBlob] })`를 호출하여 시스템 공유 시트를 표시한다.

### REQ-SHARE-005 (Unwanted Behavior)

**IF** `navigator.share` 또는 `navigator.canShare`가 미지원이면, **THE SYSTEM SHALL** Web Share API 버튼 대신 Kakao Share SDK 폴백 버튼을 표시한다.

### REQ-SHARE-006 (Event-Driven)

**WHEN** Web Share API에서 `AbortError`가 발생하면(사용자 취소), **THE SYSTEM SHALL** 에러 없이 미리보기 모달로 복귀한다.

### REQ-SHARE-007 (Unwanted Behavior)

**IF** 카메라/갤러리 접근이 불가하면, **THE SYSTEM SHALL** "카메라에 접근할 수 없습니다" 토스트 메시지를 3초간 표시한다.

### REQ-SHARE-008 (Event-Driven)

**WHEN** Kakao Share 폴백 버튼을 탭하면, **THE SYSTEM SHALL** `Kakao.Share.sendDefault()`를 호출하여 청첩장 URL + OG 이미지를 포함한 피드 메시지를 카카오톡으로 공유한다.

### REQ-SHARE-009 (Ubiquitous)

Kakao SDK 초기화 시 **항상** `Kakao.isInitialized()`를 확인한 후, 미초기화 상태일 때만 `Kakao.init(appKey)`를 호출해야 한다.

### REQ-SHARE-010 (Unwanted Behavior)

**IF** Kakao SDK 로딩 또는 공유 호출이 실패하면, **THE SYSTEM SHALL** 청첩장 URL을 클립보드에 복사하고 "링크가 복사되었습니다" 토스트를 표시한다.

## 기술 제약사항

### 인프라 제약

- GitHub Pages 정적 호스팅: 서버 사이드 로직 불가
- Firebase Storage 미사용: 촬영 사진은 서버에 업로드하지 않고 클라이언트에서만 처리
- 모든 이미지 처리는 브라우저 내 Canvas API로 수행

### SDK 제약

- 기존 Kakao Maps SDK (`//dapi.kakao.com/v2/maps/sdk.js`)는 공유 기능 미포함
- Kakao Share SDK (`https://t1.kakaocdn.net/kakaojs/v1/kakao.min.js`) 별도 추가 필요
- 동일 앱 키 사용: `ee2826711b4264015800d17421300f05`
- Kakao 개발자 콘솔에서 `songhongseob.github.io` 도메인 등록 필수 (선결 조건)

### 브라우저 호환성

- Web Share API: iOS Safari 15+, Android Chrome 75+ 지원
- KakaoTalk 인앱 브라우저: Web Share API 미지원 -> Kakao SDK 폴백 필수
- `<input capture>`: iOS/Android 모바일 브라우저 지원, 데스크톱 미지원

### 코드 구조

- 기존 IIFE 클로저 패턴(Module 1~9) 준수
- 새 모듈: PhotoShare (Module 10)
- 수정 대상 파일: `index.html`, `assets/js/main.js`, `assets/css/style.css`

## 범위 제외 (Out of Scope)

- 사진 서버 업로드 (Firebase Storage 미사용)
- 사진 필터/편집 기능
- 데스크톱 브라우저 카메라 지원
- 다중 사진 선택/공유
- 공유 횟수 트래킹/분석
- Instagram, Facebook 등 타 SNS 공유

## 추적성 (Traceability)

| 요구사항 ID | 구현 대상 | 수락 기준 |
|------------|-----------|-----------|
| REQ-SHARE-001 | PhotoShare.triggerCamera() | AC-SHARE-001 |
| REQ-SHARE-002 | PhotoShare.resizeImage() | AC-SHARE-002 |
| REQ-SHARE-003 | PhotoShare.openPreviewModal() | AC-SHARE-002 |
| REQ-SHARE-004 | PhotoShare.shareViaWebAPI() | AC-SHARE-003 |
| REQ-SHARE-005 | PhotoShare.detectShareSupport() | AC-SHARE-004 |
| REQ-SHARE-006 | PhotoShare.handleShareError() | AC-SHARE-005 |
| REQ-SHARE-007 | PhotoShare.handleCameraError() | AC-SHARE-001 |
| REQ-SHARE-008 | PhotoShare.shareViaKakao() | AC-SHARE-004 |
| REQ-SHARE-009 | PhotoShare.initKakaoSDK() | AC-SHARE-004 |
| REQ-SHARE-010 | PhotoShare.copyToClipboard() | AC-SHARE-006 |
