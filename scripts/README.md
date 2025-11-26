# Docker 이미지 빌드 및 테스트 가이드

이 디렉토리에는 Workly 애플리케이션의 Docker 이미지를 빌드하고 테스트하기 위한 스크립트가 포함되어 있습니다.

## 사전 요구사항

- Docker Desktop 설치 및 실행 중
- 충분한 디스크 공간 (최소 5GB 권장)

## 사용 방법

### Windows (PowerShell)

```powershell
# Web 앱만 빌드
.\scripts\build-docker-images.ps1 web

# Admin 앱만 빌드
.\scripts\build-docker-images.ps1 admin

# 모든 앱 빌드
.\scripts\build-docker-images.ps1 all
```

### Linux/Mac (Bash)

```bash
# 실행 권한 부여
chmod +x scripts/build-docker-images.sh

# Web 앱만 빌드
./scripts/build-docker-images.sh web

# Admin 앱만 빌드
./scripts/build-docker-images.sh admin

# 모든 앱 빌드
./scripts/build-docker-images.sh all
```

## 빌드 프로세스

스크립트는 다음 작업을 수행합니다:

1. **Docker 이미지 빌드**
   - 멀티 스테이지 빌드 사용
   - 의존성 설치 및 캐싱
   - 프로덕션 빌드 생성

2. **이미지 크기 확인**
   - 목표: 500MB 이하
   - 초과 시 경고 표시

3. **이미지 테스트 (선택사항)**
   - 컨테이너 실행
   - 헬스 체크 수행
   - 로그 확인
   - 자동 정리

## 수동 빌드

스크립트를 사용하지 않고 수동으로 빌드하려면:

```bash
# Web 앱 빌드
docker build -t workly-web:latest -f apps/web/Dockerfile .

# Admin 앱 빌드
docker build -t workly-admin:latest -f apps/admin/Dockerfile .
```

## 수동 테스트

```bash
# 컨테이너 실행
docker run -d --name workly-web-test -p 3000:3000 workly-web:latest

# 헬스 체크
curl http://localhost:3000/api/health

# 로그 확인
docker logs workly-web-test

# 컨테이너 정리
docker stop workly-web-test
docker rm workly-web-test
```

## 이미지 크기 최적화 팁

현재 이미지가 500MB를 초과하는 경우:

1. **불필요한 의존성 제거**
   - devDependencies가 프로덕션 빌드에 포함되지 않는지 확인
   - 사용하지 않는 패키지 제거

2. **.dockerignore 확인**
   - 불필요한 파일이 빌드 컨텍스트에 포함되지 않도록 확인

3. **멀티 스테이지 빌드 최적화**
   - 각 스테이지에서 필요한 파일만 복사
   - 빌드 캐시 활용

4. **Alpine 이미지 사용**
   - 이미 Node.js 20 Alpine을 사용 중
   - 추가 최적화 가능

## 문제 해결

### Docker가 인식되지 않음

**Windows:**
- Docker Desktop이 설치되어 있는지 확인
- Docker Desktop이 실행 중인지 확인
- PowerShell을 관리자 권한으로 실행

**Linux/Mac:**
```bash
# Docker 설치 확인
docker --version

# Docker 서비스 시작
sudo systemctl start docker  # Linux
```

### 빌드 실패

1. **메모리 부족**
   - Docker Desktop 설정에서 메모리 할당 증가 (최소 4GB 권장)

2. **디스크 공간 부족**
   ```bash
   # 사용하지 않는 이미지 정리
   docker system prune -a
   ```

3. **의존성 설치 실패**
   - 인터넷 연결 확인
   - pnpm 버전 확인 (9.9.0)

### 컨테이너 실행 실패

1. **포트 충돌**
   ```bash
   # 포트 사용 중인 프로세스 확인
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000                 # Linux/Mac
   ```

2. **메모리 부족**
   - Docker Desktop 설정에서 메모리 할당 증가

## 다음 단계

이미지 빌드가 성공하면:

1. GitHub Container Registry에 푸시
2. Vultr 서버에 배포
3. docker-compose 설정 구성

자세한 내용은 `deployment/README.md`를 참조하세요.
