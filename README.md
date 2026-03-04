# 결혼 청첩장 예시

> 순수 HTML/CSS/JavaScript로 제작한 모바일 청첩장 웹사이트입니다.
> GitHub Pages로 무료 배포 중입니다.

**[청첩장 보기 →](https://songhongseob.github.io/friend-wedding/)**

---

## 주요 기능

| 섹션 | 설명 |
|------|------|
| Hero | 신랑·신부 이름, 커플 사진, 배경음악 플로팅 버튼 |
| Save the Date | 결혼식까지 D-Day 카운트다운 (실시간, 일/시간/분/초) |
| 초대 | 청첩장 문구 및 양가 부모님 소개 |
| 갤러리 | 웨딩 사진 그리드 + 라이트박스 (스와이프 지원) |
| 캘린더 | 결혼 당월 달력 렌더링, 결혼일 하이라이트 |
| 오시는 길 | 카카오맵 임베드 + 지하철/버스 안내 + 지도 앱 링크 |
| 마음 전하실 곳 | 신랑·신부 양측 계좌번호 (접기/펼치기, 클립보드 복사) |
| 방명록 | 축하 메시지 작성/수정/삭제 + 실시간 동기화 (Firebase Firestore) |

**추가 기능**

- 스크롤 진입 시 섹션 페이드인 애니메이션 (IntersectionObserver)
- 카카오톡 공유 링크 미리보기 (Open Graph)
- 반응형 레이아웃 (모바일 최적화)
- 배경음악 재생/정지 플로팅 버튼

---

## 기술 스택

- **Frontend**: Vanilla HTML5 / CSS3 / JavaScript (ES6+, 프레임워크 없음)
- **지도**: Kakao Maps JavaScript API
- **폰트**: Google Fonts (Noto Serif KR, Noto Sans KR, Playfair Display)
- **배포**: GitHub Pages
- **데이터베이스**: Firebase Firestore (방명록 실시간 저장/조회/수정/삭제)

---

## 프로젝트 구조

```
friend-wedding/
├── index.html          # 메인 청첩장 페이지
├── assets/
│   ├── css/
│   │   └── style.css   # 전체 스타일시트
│   ├── js/
│   │   └── main.js     # 모든 인터랙션 로직
│   └── images/
│       ├── couple-main.jpg      # 히어로 커플 사진
│       └── gallery/
│           └── photo-01~28.jpg  # 갤러리 사진
└── audio/
    └── audio_test.mp3  # 배경음악
```

---

## 커스터마이징 방법

### 1. 기본 정보 변경 (`index.html`)

```html
<!-- 신랑·신부 이름 -->
<span class="hero__groom">신랑이름</span>
<span class="hero__bride">신부이름</span>

<!-- 결혼식 날짜/시간/장소 -->
<p class="save-date__date">2026. 11. 15. SUN</p>
<p class="location__venue">예식장명 (홀)</p>
<p class="location__address">주소</p>
```

### 2. 날짜·장소 설정 (`assets/js/main.js`)

```js
const CONFIG = {
  weddingDate: new Date('2026-11-15T14:00:00+09:00'), // 결혼식 일시 (ISO 8601)
  venue: {
    name: '루클라비더화이트',
    address: '서울 강남구 논현로 742',
    lat: 37.518471,   // 카카오맵 위도
    lng: 127.029254   // 카카오맵 경도
  }
};
```

### 3. 사진 추가

- `assets/images/couple-main.jpg` — 히어로 커플 사진 교체
- `assets/images/gallery/photo-01.jpg` ~ `photo-28.jpg` — 갤러리 사진 추가
- `index.html` 갤러리 섹션의 `<!-- ... -->` 주석을 해제하여 이미지 활성화

### 4. 배경음악

`audio/audio_test.mp3` 파일을 교체합니다.

### 5. 계좌번호

`index.html` 의 `data-account` 속성과 계좌 정보를 실제 계좌번호로 수정합니다.

### 6. 카카오맵 API 키

`index.html` 상단 스크립트 URL의 `appkey` 값을 발급받은 키로 교체합니다:

```html
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY"></script>
```

---

## 배포 방법 (GitHub Pages)

1. 이 저장소를 Fork 또는 본인 저장소로 Push
2. GitHub → Settings → Pages
3. Source: `main` 브랜치, `/ (root)` 선택 후 Save
4. 잠시 후 `https://{username}.github.io/{repo-name}/` 으로 접속 가능

---

## 라이선스

개인 프로젝트입니다. 자유롭게 참고하되 사진, 음악 등 저작권 있는 콘텐츠는 직접 교체하여 사용해주세요.
