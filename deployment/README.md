# Deployment Configuration

이 디렉토리는 web과 admin 애플리케이션의 배포 설정을 포함합니다.

## 구조

```
deployment/
├── web/
│   ├── docker-compose.yml    # Web 앱 Docker Compose 설정
│   ├── nginx/                 # Nginx 설정
│   └── scripts/               # 배포 스크립트
├── admin/
│   ├── docker-compose.yml    # Admin 앱 Docker Compose 설정
│   ├── nginx/                 # Nginx 설정
│   └── scripts/               # 배포 스크립트
└── scripts/                   # 공통 스크립트
```

## 환경 변수

모든 환경별 설정은 GitHub Secrets와 Variables로 관리됩니다.

### 필수 GitHub Secrets

**Web App:**
- `WEB_STAGING_SSH_KEY` - Staging 서버 SSH 키
- `WEB_STAGING_HOST` - Staging 서버 호스트
- `WEB_PRODUCTION_SSH_KEY` - Production 서버 SSH 키
- `WEB_PRODUCTION_HOST` - Production 서버 호스트

**Admin App:**
- `ADMIN_STAGING_SSH_KEY` - Staging 서버 SSH 키
- `ADMIN_STAGING_HOST` - Staging 서버 호스트
- `ADMIN_PRODUCTION_SSH_KEY` - Production 서버 SSH 키
- `ADMIN_PRODUCTION_HOST` - Production 서버 호스트

### 필수 GitHub Variables

**Web Staging:**
- `WEB_STAGING_DOMAIN` - 도메인 (예: staging.worklyteam.cloud)
- `WEB_STAGING_API_URL` - API URL (예: https://api-staging.workly.app)
- `WEB_STAGING_EMAIL` - SSL 인증서 이메일

**Web Production:**
- `WEB_PRODUCTION_DOMAIN` - 도메인 (예: worklyteam.cloud)
- `WEB_PRODUCTION_API_URL` - API URL (예: https://api.workly.app)
- `WEB_PRODUCTION_EMAIL` - SSL 인증서 이메일

**Admin Staging:**
- `ADMIN_STAGING_DOMAIN` - 도메인 (예: admin-staging.worklyteam.cloud)
- `ADMIN_STAGING_API_URL` - API URL (예: https://api-staging.workly.app)
- `ADMIN_STAGING_EMAIL` - SSL 인증서 이메일

**Admin Production:**
- `ADMIN_PRODUCTION_DOMAIN` - 도메인 (예: admin.worklyteam.cloud)
- `ADMIN_PRODUCTION_API_URL` - API URL (예: https://api.workly.app)
- `ADMIN_PRODUCTION_EMAIL` - SSL 인증서 이메일

**공통:**
- `GITHUB_REPOSITORY` - GitHub 저장소 (예: Syncjin/workly_fe)

## Docker Compose 사용법

환경 변수를 설정하고 실행:

```bash
# Staging 환경
export GITHUB_REPOSITORY=Syncjin/workly_fe
export DEPLOY_ENV=staging
export NEXT_PUBLIC_API_URL=https://api-staging.workly.app

docker-compose up -d

# Production 환경
export GITHUB_REPOSITORY=Syncjin/workly_fe
export DEPLOY_ENV=production
export NEXT_PUBLIC_API_URL=https://api.workly.app

docker-compose up -d
```

## CI/CD 워크플로우

GitHub Actions에서 자동으로 환경 변수를 주입하여 배포합니다.

- `main` 브랜치 머지 → Staging 자동 배포
- Production 태그 생성 → Production 수동 배포 (승인 필요)
