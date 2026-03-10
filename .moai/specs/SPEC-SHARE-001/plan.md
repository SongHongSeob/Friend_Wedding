---
spec_id: SPEC-SHARE-001
version: 1.0.0
status: Planned
created: 2026-03-10
updated: 2026-03-10
---

# SPEC-SHARE-001 구현 계획

## 작업 분해

### Phase 1: HTML 마크업 (Primary Goal)

**목표**: 공유 섹션 UI 구조 추가

| 작업 | 파일 | 설명 |
|------|------|------|
| 1-1 | `index.html` | Kakao Share SDK `<script>` 태그 추가 |
| 1-2 | `index.html` | "청첩장 공유하기" 섹션 마크업 (footer 상단) |
| 1-3 | `index.html` | 미리보기 모달 마크업 |
| 1-4 | `index.html` | 토스트 알림 마크업 |
| 1-5 | `index.html` | `<input type="file" accept="image/*" capture="environment">` (숨김) |

**섹션 배치**: 기존 footer(`<footer class="footer">`) 바로 위에 새 섹션 삽입

**Kakao SDK 스크립트 추가**:
```html
<script src="https://t1.kakaocdn.net/kakaojs/v1/kakao.min.js"></script>
```
- 기존 Kakao Maps SDK와 별도로 추가
- `</body>` 직전, `main.js` 이전에 배치

### Phase 2: JavaScript 모듈 (Primary Goal)

**목표**: PhotoShare 모듈 구현 (Module 10)

| 작업 | 함수 | 설명 |
|------|------|------|
| 2-1 | `init()` | 이벤트 리스너 등록, Kakao SDK 초기화 |
| 2-2 | `initKakaoSDK()` | `Kakao.isInitialized()` 확인 후 조건부 init |
| 2-3 | `triggerCamera()` | hidden input의 click 트리거 |
| 2-4 | `handleFileSelect(e)` | change 이벤트 핸들러, 파일 유효성 검증 |
| 2-5 | `resizeImage(file)` | Canvas API 리사이징 (max 1920px, JPEG 0.85) |
| 2-6 | `openPreviewModal(blob)` | 미리보기 표시, scroll lock 적용 |
| 2-7 | `closePreviewModal()` | 모달 닫기, scroll lock 해제 |
| 2-8 | `detectShareSupport()` | `navigator.canShare` 여부 판별 |
| 2-9 | `shareViaWebAPI(blob)` | `navigator.share({ files })` 호출 |
| 2-10 | `shareViaKakao()` | `Kakao.Share.sendDefault()` 피드 공유 |
| 2-11 | `copyToClipboard()` | `navigator.clipboard.writeText()` 폴백 |
| 2-12 | `showToast(message)` | 토스트 메시지 3초 표시 |
| 2-13 | `handleShareError(err)` | 에러 분기 처리 (AbortError 등) |

**모듈 구조**: 기존 IIFE 클로저 패턴 준수
```javascript
// Module 10: PhotoShare
(function() {
    'use strict';
    // ... 구현
})();
```

**이미지 리사이징 로직**:
1. `FileReader`로 이미지 로드
2. `Image` 객체에 src 설정
3. 원본 비율 유지하며 최대 1920px 계산
4. Canvas에 drawImage
5. `canvas.toBlob(callback, 'image/jpeg', 0.85)`

**Kakao Share 피드 메시지 구조**:
```javascript
Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
        title: '송홍섭 & 신부 결혼식에 초대합니다',
        description: '청첩장을 확인해주세요',
        imageUrl: 'https://songhongseob.github.io/assets/img/og-image.jpg',
        link: {
            mobileWebUrl: 'https://songhongseob.github.io',
            webUrl: 'https://songhongseob.github.io'
        }
    },
    buttons: [{
        title: '청첩장 보기',
        link: {
            mobileWebUrl: 'https://songhongseob.github.io',
            webUrl: 'https://songhongseob.github.io'
        }
    }]
});
```

### Phase 3: CSS 스타일링 (Secondary Goal)

**목표**: 공유 섹션 및 모달 스타일링

| 작업 | 설명 |
|------|------|
| 3-1 | `.share-section` 섹션 스타일 (기존 섹션 디자인 톤 유지) |
| 3-2 | `.share-btn` 공유 버튼 스타일 (터치 영역 최소 44x44px) |
| 3-3 | `.preview-modal` 미리보기 모달 (풀스크린 오버레이) |
| 3-4 | `.preview-image` 이미지 미리보기 (object-fit: contain) |
| 3-5 | `.preview-actions` 모달 하단 액션 버튼 영역 |
| 3-6 | `.toast` 토스트 알림 스타일 (하단 중앙, 페이드 인/아웃) |
| 3-7 | 반응형 미디어 쿼리 (모바일 최적화) |

## 기술 스택 명세

### 신규 추가 SDK

| SDK | URL | 용도 |
|-----|-----|------|
| Kakao JavaScript SDK | `https://t1.kakaocdn.net/kakaojs/v1/kakao.min.js` | Share 기능 |

### 사용 Web API

| API | 지원 브라우저 | 용도 |
|-----|-------------|------|
| Web Share API (Level 2) | iOS Safari 15+, Chrome 75+ | 파일 포함 시스템 공유 |
| Canvas API | 모든 모던 브라우저 | 이미지 리사이징 |
| Clipboard API | iOS Safari 13.4+, Chrome 66+ | URL 복사 폴백 |
| File API / FileReader | 모든 모던 브라우저 | 이미지 파일 읽기 |

### 브라우저 호환성 매트릭스

| 기능 | iOS Safari | Android Chrome | KakaoTalk InApp | Samsung Internet |
|------|-----------|---------------|----------------|-----------------|
| `<input capture>` | O | O | O | O |
| Web Share API (files) | O (15+) | O (75+) | X | O (14+) |
| Kakao Share SDK | O | O | O | O |
| Clipboard API | O (13.4+) | O (66+) | O | O |
| Canvas API | O | O | O | O |

## 선결 조건 (Prerequisites)

### [필수] Kakao 개발자 콘솔 설정

1. [Kakao Developers](https://developers.kakao.com) 로그인
2. 기존 앱 설정 > 플랫폼 > Web 플랫폼
3. 사이트 도메인: `https://songhongseob.github.io` 등록
4. 카카오톡 공유 메시지 > 커스텀 메시지 활성화 확인
5. 앱 키 확인: `ee2826711b4264015800d17421300f05`

**검증 방법**: 개발자 콘솔에서 테스트 공유 실행

### [권장] OG 이미지 준비

- 경로: `assets/img/og-image.jpg` (카카오 공유 썸네일용)
- 권장 크기: 800x400px 이상
- 이미 `<meta property="og:image">`에 설정되어 있으면 해당 이미지 사용

## 위험 분석 및 대응

### Risk 1: KakaoTalk 인앱 브라우저 Web Share API 미지원

- **발생 가능성**: High
- **영향도**: High
- **대응**: `navigator.canShare` 체크 후 Kakao SDK 폴백 버튼 자동 전환
- **검증**: KakaoTalk 인앱에서 직접 테스트

### Risk 2: Kakao 개발자 콘솔 도메인 미등록

- **발생 가능성**: High
- **영향도**: Medium
- **대응**: 구현 전 개발자 콘솔 설정 완료 필수 (선결 조건)
- **검증**: `Kakao.Share.sendDefault()` 호출 시 에러 여부 확인

### Risk 3: 원본 사진 용량 초과 (10MB+)

- **발생 가능성**: Medium
- **영향도**: Medium
- **대응**: Canvas 리사이징으로 max 1920px, JPEG 0.85 압축 적용
- **예상 결과**: 원본 10MB -> 리사이징 후 약 300KB~1MB

### Risk 4: iOS Safari에서 Blob 파일명 이슈

- **발생 가능성**: Low
- **영향도**: Medium
- **대응**: `new File([blob], 'wedding-photo.jpg', { type: 'image/jpeg' })` 명시적 파일 생성
- **검증**: iOS Safari 실기기 테스트

## 참조 구현 (Reference Implementations)

### 기존 모달 패턴 (방명록)

- 위치: `assets/js/main.js` Module 8 (Guestbook)
- scroll lock: `document.body.style.overflow = 'hidden'`
- 모달 열기/닫기: CSS class toggle
- 배경 클릭 닫기: overlay click handler

### 기존 라이트박스 패턴 (갤러리)

- 위치: `assets/js/main.js` Module 6 (Gallery)
- 터치 제스처: swipe 핸들링
- 이미지 표시: `object-fit: contain`
- 풀스크린 오버레이: `position: fixed; inset: 0`

### 기존 Kakao SDK 사용 패턴

- 위치: `index.html` Kakao Maps SDK 초기화
- 앱 키: `ee2826711b4264015800d17421300f05`
- 초기화 패턴: script load -> SDK init -> API 호출

## 구현 순서

1. **[선결]** Kakao 개발자 콘솔 도메인 등록
2. **[Phase 1]** HTML 마크업 추가 (Kakao SDK script, 공유 섹션, 모달)
3. **[Phase 2]** JavaScript PhotoShare 모듈 구현
4. **[Phase 3]** CSS 스타일링
5. **[검증]** 실기기 테스트 (iOS Safari, Android Chrome, KakaoTalk InApp)

## 추적성

| 요구사항 | Phase | 작업 |
|---------|-------|------|
| REQ-SHARE-001 | Phase 1, 2 | 1-5, 2-3, 2-4 |
| REQ-SHARE-002 | Phase 2 | 2-5, 2-6 |
| REQ-SHARE-003 | Phase 2 | 2-6, 2-7 |
| REQ-SHARE-004 | Phase 2 | 2-8, 2-9 |
| REQ-SHARE-005 | Phase 2 | 2-8 |
| REQ-SHARE-006 | Phase 2 | 2-13 |
| REQ-SHARE-007 | Phase 2 | 2-4, 2-12 |
| REQ-SHARE-008 | Phase 2 | 2-10 |
| REQ-SHARE-009 | Phase 2 | 2-2 |
| REQ-SHARE-010 | Phase 2 | 2-11, 2-12 |
