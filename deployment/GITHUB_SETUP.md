# GitHub Secrets 및 Variables 설정 가이드

이 문서는 CI/CD 파이프라인에 필요한 GitHub Secrets와 Variables 설정 방법을 안내합니다.

## 설정 위치

GitHub 저장소 → Settings → Secrets and variables → Actions

## 필수 Secrets

### Web Staging
```
WEB_STAGING_SSH_KEY
- 설명: Staging 서버 SSH 개인 키
- 형식: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----

WEB_STAGING_HOST
- 설명: Staging 서버 IP 주소 또는 호스트명
- 예시: 123.45.67.89
```

### Web Production
```
WEB_PRODUCTION_SSH_KEY
- 설명: Production 서버 SSH 개인 키
- 형식: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----

WEB_PRODUCTION_HOST
- 설명: Production 서버 IP 주소 또는 호스트명
- 예시: 123.45.67.90
```

### Admin Staging
```
ADMIN_STAGING_SSH_KEY
- 설명: Admin Staging 서버 SSH 개인 키
- 형식: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----

ADMIN_STAGING_HOST
- 설명: Admin Staging 서버 IP 주소 또는 호스트명
- 예시: 123.45.67.91
```

### Admin Production
```
ADMIN_PRODUCTION_SSH_KEY
- 설명: Admin Production 서버 SSH 개인 키
- 형식: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----

ADMIN_PRODUCTION_HOST
- 설명: Admin Production 서버 IP 주소 또는 호스트명
- 예시: 123.45.67.92
```

## 필수 Variables

### 공통
```
REPOSITORY_NAME
- 설명: GitHub 저장소 경로 (GITHUB_ prefix 사용 불가)
- 예시: Syncjin/workly_fe

SSL_EMAIL
- 설명: SSL 인증서 발급용 이메일 (모든 환경 공통)
- 예시: admin@worklyteam.cloud
```

### Web Staging
```
WEB_STAGING_DOMAIN
- 설명: Web Staging 도메인 (서버 접속용 호스트와 다름)
- 예시: staging.worklyteam.cloud
- 참고: WEB_STAGING_HOST(Secrets)는 서버 IP, 이것은 실제 서비스 도메인

WEB_STAGING_API_URL
- 설명: Web Staging 일반 API URL (빌드 시 NEXT_PUBLIC_API_URL로 주입)
- 예시: https://api-staging.workly.app
- 사용처: Web 앱 빌드, E2E 테스트

WEB_STAGING_ADMIN_API_URL
- 설명: Web Staging Admin API URL (빌드 시 NEXT_PUBLIC_API2_URL로 주입)
- 예시: https://admin-api-staging.workly.app
- 사용처: Web 앱 빌드, E2E 테스트
```

### Web Production
```
WEB_PRODUCTION_DOMAIN
- 설명: Web Production 도메인 (서버 접속용 호스트와 다름)
- 예시: worklyteam.cloud
- 참고: WEB_PRODUCTION_HOST(Secrets)는 서버 IP, 이것은 실제 서비스 도메인

WEB_PRODUCTION_API_URL
- 설명: Web Production 일반 API URL (빌드 시 NEXT_PUBLIC_API_URL로 주입)
- 예시: https://api.workly.app
- 사용처: Web 앱 빌드

WEB_PRODUCTION_ADMIN_API_URL
- 설명: Web Production Admin API URL (빌드 시 NEXT_PUBLIC_API2_URL로 주입)
- 예시: https://admin-api.workly.app
- 사용처: Web 앱 빌드
```

### Admin Staging
```
ADMIN_STAGING_DOMAIN
- 설명: Admin Staging 도메인 (서버 접속용 호스트와 다름)
- 예시: admin-staging.worklyteam.cloud
- 참고: ADMIN_STAGING_HOST(Secrets)는 서버 IP, 이것은 실제 서비스 도메인

ADMIN_STAGING_API_URL
- 설명: Admin Staging 일반 API URL (빌드 시 NEXT_PUBLIC_API_URL로 주입)
- 예시: https://api-staging.workly.app
- 사용처: Admin 앱 빌드

ADMIN_STAGING_ADMIN_API_URL
- 설명: Admin Staging Admin API URL (빌드 시 NEXT_PUBLIC_API2_URL로 주입)
- 예시: https://admin-api-staging.workly.app
- 사용처: Admin 앱 빌드
```

### Admin Production
```
ADMIN_PRODUCTION_DOMAIN
- 설명: Admin Production 도메인 (서버 접속용 호스트와 다름)
- 예시: admin.worklyteam.cloud
- 참고: ADMIN_PRODUCTION_HOST(Secrets)는 서버 IP, 이것은 실제 서비스 도메인

ADMIN_PRODUCTION_API_URL
- 설명: Admin Production 일반 API URL (빌드 시 NEXT_PUBLIC_API_URL로 주입)
- 예시: https://api.workly.app
- 사용처: Admin 앱 빌드

ADMIN_PRODUCTION_ADMIN_API_URL
- 설명: Admin Production Admin API URL (빌드 시 NEXT_PUBLIC_API2_URL로 주입)
- 예시: https://admin-api.workly.app
- 사용처: Admin 앱 빌드
```

## 설정 방법

### 1. Secrets 추가

1. GitHub 저장소 페이지로 이동
2. Settings → Secrets and variables → Actions 클릭
3. "New repository secret" 버튼 클릭
4. Name과 Secret 입력
5. "Add secret" 버튼 클릭

### 2. Variables 추가

1. GitHub 저장소 페이지로 이동
2. Settings → Secrets and variables → Actions 클릭
3. "Variables" 탭 클릭
4. "New repository variable" 버튼 클릭
5. Name과 Value 입력
6. "Add variable" 버튼 클릭

## SSH 키 생성 방법

서버에 접속할 SSH 키가 없다면 다음 명령어로 생성:

```bash
# 키 생성
ssh-keygen -t ed25519 -C "github-actions@workly" -f ~/.ssh/workly_deploy

# 공개 키를 서버에 복사
ssh-copy-id -i ~/.ssh/workly_deploy.pub root@SERVER_IP

# 개인 키 내용 확인 (GitHub Secret에 입력)
cat ~/.ssh/workly_deploy
```

## 환경별 배포 트리거

### Staging 배포
- `main` 브랜치에 푸시하면 자동 배포
- 변경된 앱(web/admin)만 배포

### Production 배포
- GitHub Actions에서 수동 실행
- "Deploy Production" 워크플로우 선택
- "Run workflow" 버튼 클릭

## HOST vs DOMAIN 차이점

**혼란스러울 수 있는 부분 설명:**

- **HOST (Secrets)**: SSH로 서버에 접속할 때 사용하는 IP 주소 또는 호스트명
  - 예: `123.45.67.89` 또는 `server1.example.com`
  - GitHub Actions가 서버에 SSH 접속할 때 사용
  
- **DOMAIN (Variables)**: 실제 사용자가 접속하는 서비스 도메인
  - 예: `staging.worklyteam.cloud`
  - Nginx 설정, SSL 인증서 발급, 헬스 체크에 사용

**예시:**
```
서버 IP: 123.45.67.89 (WEB_STAGING_HOST - Secret)
서비스 도메인: staging.worklyteam.cloud (WEB_STAGING_DOMAIN - Variable)

→ GitHub Actions는 123.45.67.89로 SSH 접속
→ 사용자는 https://staging.worklyteam.cloud 로 접속
```

## 환경 변수 매핑

GitHub Variables가 실제 애플리케이션에서 어떻게 사용되는지:

```
GitHub Variables → 빌드/배포 시 주입되는 환경 변수

[Web Staging]
WEB_STAGING_API_URL → NEXT_PUBLIC_API_URL
WEB_STAGING_ADMIN_API_URL → NEXT_PUBLIC_API2_URL

[Web Production]
WEB_PRODUCTION_API_URL → NEXT_PUBLIC_API_URL
WEB_PRODUCTION_ADMIN_API_URL → NEXT_PUBLIC_API2_URL

[Admin Staging]
ADMIN_STAGING_API_URL → NEXT_PUBLIC_API_URL
ADMIN_STAGING_ADMIN_API_URL → NEXT_PUBLIC_API2_URL

[Admin Production]
ADMIN_PRODUCTION_API_URL → NEXT_PUBLIC_API_URL
ADMIN_PRODUCTION_ADMIN_API_URL → NEXT_PUBLIC_API2_URL
```

**중요:** `NEXT_PUBLIC_API_URL`과 `NEXT_PUBLIC_API2_URL`은 더 이상 직접 설정하지 않습니다. 
대신 환경별 API URL Variables를 설정하면 워크플로우에서 자동으로 주입합니다.

**API URL 설명:**
- `NEXT_PUBLIC_API_URL`: 일반 API 서버 주소
- `NEXT_PUBLIC_API2_URL`: Admin API 서버 주소

## 검증

설정이 완료되면 다음을 확인:

1. **Secrets 목록에 8개의 항목이 있는지 확인** (SSH 키 4개 + 호스트 4개)
   - WEB_STAGING_SSH_KEY
   - WEB_STAGING_HOST
   - WEB_PRODUCTION_SSH_KEY
   - WEB_PRODUCTION_HOST
   - ADMIN_STAGING_SSH_KEY
   - ADMIN_STAGING_HOST
   - ADMIN_PRODUCTION_SSH_KEY
   - ADMIN_PRODUCTION_HOST

2. **Variables 목록에 14개의 변수가 있는지 확인**
   - REPOSITORY_NAME
   - SSL_EMAIL
   - WEB_STAGING_DOMAIN
   - WEB_STAGING_API_URL
   - WEB_STAGING_ADMIN_API_URL
   - WEB_PRODUCTION_DOMAIN
   - WEB_PRODUCTION_API_URL
   - WEB_PRODUCTION_ADMIN_API_URL
   - ADMIN_STAGING_DOMAIN
   - ADMIN_STAGING_API_URL
   - ADMIN_STAGING_ADMIN_API_URL
   - ADMIN_PRODUCTION_DOMAIN
   - ADMIN_PRODUCTION_API_URL
   - ADMIN_PRODUCTION_ADMIN_API_URL

3. **삭제해야 할 Variables (있다면)**
   - ~~NEXT_PUBLIC_API_URL~~ (환경별 API_URL로 대체)
   - ~~NEXT_PUBLIC_API2_URL~~ (환경별 ADMIN_API_URL로 대체)

4. 테스트 배포를 실행하여 정상 작동 확인

## 문제 해결

### SSH 연결 실패
- SSH 키가 올바르게 설정되었는지 확인
- 서버의 `~/.ssh/authorized_keys`에 공개 키가 있는지 확인
- 방화벽에서 SSH 포트(22)가 열려있는지 확인

### 환경 변수 누락
- Variables 탭에서 모든 변수가 설정되었는지 확인
- 변수 이름의 대소문자가 정확한지 확인

### Docker 이미지 풀 실패
- GITHUB_TOKEN이 자동으로 제공되므로 별도 설정 불필요
- 저장소가 private인 경우 패키지 권한 확인
