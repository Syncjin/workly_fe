# Workly 배포 스크립트

이 디렉토리에는 Workly 애플리케이션을 Vultr 서버에 배포하기 위한 스크립트들이 포함되어 있습니다.

## 스크립트 목록

### 1. setup-server.sh
서버 초기 설정을 자동화하는 스크립트입니다.

**기능:**
- 시스템 패키지 업데이트
- Docker 및 Docker Compose 설치
- Swap 메모리 설정 (1GB)
- 방화벽 설정 (SSH, HTTP, HTTPS)
- 디렉토리 구조 생성
- Docker 자동 시작 설정
- 로그 로테이션 설정

**사용법:**
```bash
# 서버에 접속
ssh root@<server-ip>

# 스크립트 다운로드
curl -O https://raw.githubusercontent.com/Syncjin/workly_fe/main/deployment/scripts/setup-server.sh

# 실행 권한 부여
chmod +x setup-server.sh

# 실행
sudo bash setup-server.sh
```

**실행 시간:** 약 5-10분

**요구사항:**
- Ubuntu 20.04 LTS 이상
- Root 권한
- 인터넷 연결

### 2. monitor-memory.sh
시스템 메모리 사용량을 모니터링하는 스크립트입니다.

**기능:**
- 메모리 사용량 체크
- 80% 초과 시 경고 로그
- 90% 초과 시 알림 발송
- Docker 컨테이너 메모리 사용량 표시

**사용법:**
```bash
# 수동 실행
sudo bash /opt/workly/scripts/monitor-memory.sh

# 로그 확인
tail -f /opt/workly/logs/memory-monitor.log

# 알림 로그 확인
tail -f /opt/workly/logs/memory-alerts.log
```

**알림 설정 (선택적):**
```bash
# Slack 알림
export SLACK_WEBHOOK_URL='https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

# Discord 알림
export DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/YOUR/WEBHOOK/URL'

# 이메일 알림
export ALERT_EMAIL='your-email@example.com'
```

환경 변수를 `/etc/environment`에 추가하여 영구 설정:
```bash
echo 'SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"' | sudo tee -a /etc/environment
```

### 3. install-memory-monitor.sh
메모리 모니터링을 Cron에 등록하는 스크립트입니다.

**기능:**
- monitor-memory.sh를 Cron에 등록
- 5분마다 자동 실행
- 로그 디렉토리 생성

**사용법:**
```bash
# 실행
sudo bash /opt/workly/scripts/install-memory-monitor.sh

# Cron 작업 확인
crontab -l
```

### 4. deploy-sequential.sh
순차 배포를 수행하는 스크립트입니다. (Web/Admin 각각)

**위치:**
- `/opt/workly/deployment/web/scripts/deploy-sequential.sh`
- `/opt/workly/deployment/admin/scripts/deploy-sequential.sh`

**기능:**
- 현재 활성 환경 식별
- 활성 컨테이너 중지 (메모리 확보)
- 새 이미지 풀
- 비활성 컨테이너 시작
- 헬스 체크 수행
- 트래픽 전환
- 배포 로그 기록

**사용법:**
```bash
# Web 서버 배포
cd /opt/workly/deployment/web
sudo bash scripts/deploy-sequential.sh

# Admin 서버 배포
cd /opt/workly/deployment/admin
sudo bash scripts/deploy-sequential.sh
```

### 5. rollback.sh
배포 실패 시 롤백을 수행하는 스크립트입니다.

**기능:**
- 이전 활성 환경으로 트래픽 전환
- Nginx 설정 복원
- 실패한 컨테이너 중지
- 롤백 로그 기록

**사용법:**
```bash
# Web 서버 롤백
cd /opt/workly/deployment/web
sudo bash /opt/workly/scripts/rollback.sh web

# Admin 서버 롤백
cd /opt/workly/deployment/admin
sudo bash /opt/workly/scripts/rollback.sh admin
```

### 6. validate-nginx.sh
Nginx 설정을 검증하는 스크립트입니다.

**기능:**
- Nginx 설정 문법 검증
- 설정 파일 존재 여부 확인

**사용법:**
```bash
# Web 서버 Nginx 검증
sudo bash /opt/workly/scripts/validate-nginx.sh /opt/workly/deployment/web/nginx

# Admin 서버 Nginx 검증
sudo bash /opt/workly/scripts/validate-nginx.sh /opt/workly/deployment/admin/nginx
```

## 서버 초기 설정 가이드

### 1단계: 서버 생성
1. Vultr 대시보드에서 새 서버 생성
2. OS: Ubuntu 20.04 LTS 선택
3. 사양: 1 vCPU, 1GB RAM, 25GB SSD
4. 리전: 서울 또는 도쿄 (한국 사용자)
5. SSH 키 등록 (선택적)

### 2단계: 초기 설정 실행
```bash
# 서버 접속
ssh root@<server-ip>

# setup-server.sh 다운로드 및 실행
curl -O https://raw.githubusercontent.com/Syncjin/workly_fe/main/deployment/scripts/setup-server.sh
chmod +x setup-server.sh
sudo bash setup-server.sh
```

### 3단계: SSH 키 등록
```bash
# 로컬에서 SSH 키 생성
ssh-keygen -t ed25519 -C "github-actions"

# 공개 키를 서버에 추가
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@<server-ip>

# 개인 키를 GitHub Secrets에 등록
# WEB_STAGING_SSH_KEY, WEB_PRODUCTION_SSH_KEY,
# ADMIN_STAGING_SSH_KEY, ADMIN_PRODUCTION_SSH_KEY
cat ~/.ssh/id_ed25519
```

### 4단계: 배포 파일 업로드
```bash
# 로컬에서 배포 파일 업로드
scp -r deployment/web root@<web-server-ip>:/opt/workly/deployment/
scp -r deployment/admin root@<admin-server-ip>:/opt/workly/deployment/
scp deployment/scripts/* root@<server-ip>:/opt/workly/scripts/
```

### 5단계: 환경 변수 설정
```bash
# 서버에서 환경 변수 파일 생성
cat > /opt/workly/.env << EOF
GITHUB_REPOSITORY=Syncjin/workly_fe
DEPLOY_ENV=production
DOMAIN=worklyteam.cloud
EMAIL=dldndldms@gmail.com
EOF
```

### 6단계: 메모리 모니터링 설치
```bash
# 메모리 모니터링 Cron 등록
sudo bash /opt/workly/scripts/install-memory-monitor.sh

# 알림 설정 (선택적)
echo 'SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"' | sudo tee -a /etc/environment
```

## 트러블슈팅

### Docker 설치 실패
```bash
# Docker 저장소 수동 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### Swap 메모리 설정 실패
```bash
# 수동 Swap 설정
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 방화벽 설정 확인
```bash
# UFW 상태 확인
sudo ufw status

# 포트 수동 허용
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 메모리 부족 문제
```bash
# 메모리 사용량 확인
free -h

# Docker 컨테이너 메모리 확인
docker stats --no-stream

# 불필요한 컨테이너 중지
docker-compose stop <container-name>

# 서버 업그레이드 권장 (1GB → 2GB)
```

## 로그 확인

### 시스템 로그
```bash
# 시스템 로그
journalctl -xe

# Docker 로그
journalctl -u docker

# Cron 로그
grep CRON /var/log/syslog
```

### 애플리케이션 로그
```bash
# 배포 로그
tail -f /opt/workly/logs/deploy.log

# 메모리 모니터링 로그
tail -f /opt/workly/logs/memory-monitor.log

# 알림 로그
tail -f /opt/workly/logs/memory-alerts.log

# Docker 컨테이너 로그
docker-compose logs -f web-blue
docker-compose logs -f web-green
docker-compose logs -f nginx
```

## 유지보수

### 정기 점검 항목
- [ ] 메모리 사용량 확인 (주 1회)
- [ ] 디스크 공간 확인 (주 1회)
- [ ] Docker 이미지 정리 (월 1회)
- [ ] 시스템 업데이트 (월 1회)
- [ ] SSL 인증서 만료일 확인 (월 1회)
- [ ] 로그 파일 크기 확인 (월 1회)

### 시스템 업데이트
```bash
# 패키지 업데이트
sudo apt-get update
sudo apt-get upgrade -y

# Docker 업데이트
sudo apt-get install --only-upgrade docker-ce docker-ce-cli containerd.io

# 재부팅 (필요시)
sudo reboot
```

### Docker 이미지 정리
```bash
# 사용하지 않는 이미지 삭제
docker image prune -a

# 사용하지 않는 볼륨 삭제
docker volume prune

# 사용하지 않는 네트워크 삭제
docker network prune
```

## 보안 권장사항

1. **SSH 키 인증만 사용**
   ```bash
   # 비밀번호 인증 비활성화
   sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
   sudo systemctl restart sshd
   ```

2. **정기적인 시스템 업데이트**
   ```bash
   # 자동 업데이트 설정
   sudo apt-get install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

3. **Fail2ban 설치 (선택적)**
   ```bash
   sudo apt-get install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **로그 모니터링**
   - 정기적으로 로그 확인
   - 비정상적인 접근 시도 감지
   - 알림 설정

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Vultr 문서](https://www.vultr.com/docs/)
- [Ubuntu 서버 가이드](https://ubuntu.com/server/docs)
- [Nginx 문서](https://nginx.org/en/docs/)
