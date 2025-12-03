#!/bin/bash

################################################################################
# Workly 서버 초기 설정 스크립트
# 
# 이 스크립트는 Vultr 서버를 Workly 배포를 위해 준비합니다.
# - Docker 및 Docker Compose 설치
# - Swap 메모리 설정 (1GB RAM 최적화)
# - 방화벽 설정
# - 디렉토리 구조 생성
# - 로그 로테이션 설정
#
# 사용법: sudo bash setup-server.sh
################################################################################

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Root 권한 확인
if [ "$EUID" -ne 0 ]; then 
    log_error "이 스크립트는 root 권한으로 실행해야 합니다."
    log_info "다음 명령으로 실행하세요: sudo bash setup-server.sh"
    exit 1
fi

log_info "Workly 서버 초기 설정을 시작합니다..."

################################################################################
# 1. 시스템 업데이트
################################################################################
log_info "시스템 패키지를 업데이트합니다..."
apt-get update -y
apt-get upgrade -y
log_info "✓ 시스템 업데이트 완료"

################################################################################
# 2. 필수 패키지 설치
################################################################################
log_info "필수 패키지를 설치합니다..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    ufw \
    logrotate
log_info "✓ 필수 패키지 설치 완료"

################################################################################
# 3. Docker 설치
################################################################################
log_info "Docker를 설치합니다..."

# Docker GPG 키 추가
if [ ! -f /usr/share/keyrings/docker-archive-keyring.gpg ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
        gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
fi

# Docker 저장소 추가
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

# Docker 서비스 시작 및 자동 시작 설정
systemctl start docker
systemctl enable docker

# Docker 설치 확인
if docker --version > /dev/null 2>&1; then
    log_info "✓ Docker 설치 완료: $(docker --version)"
else
    log_error "Docker 설치 실패"
    exit 1
fi

################################################################################
# 4. Docker Compose 설치
################################################################################
log_info "Docker Compose를 설치합니다..."

# 최신 안정 버전 설치
DOCKER_COMPOSE_VERSION="v2.24.0"
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

# 심볼릭 링크 생성 (docker compose 명령 지원)
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Docker Compose 설치 확인
if docker-compose --version > /dev/null 2>&1; then
    log_info "✓ Docker Compose 설치 완료: $(docker-compose --version)"
else
    log_error "Docker Compose 설치 실패"
    exit 1
fi

################################################################################
# 5. Swap 메모리 설정 (1GB RAM 최적화)
################################################################################
log_info "Swap 메모리를 설정합니다 (1GB)..."

# 기존 Swap 확인
if swapon --show | grep -q '/swapfile'; then
    log_warn "Swap 파일이 이미 존재합니다. 건너뜁니다."
else
    # Swap 파일 생성 (1GB)
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # 부팅 시 자동 마운트 설정
    if ! grep -q '/swapfile' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    
    # Swap 사용 최적화 (RAM 우선 사용)
    sysctl vm.swappiness=10
    if ! grep -q 'vm.swappiness' /etc/sysctl.conf; then
        echo 'vm.swappiness=10' >> /etc/sysctl.conf
    fi
    
    log_info "✓ Swap 메모리 설정 완료"
    log_info "  - Swap 크기: 1GB"
    log_info "  - Swappiness: 10 (RAM 우선 사용)"
fi

################################################################################
# 6. 방화벽 설정
################################################################################
log_info "방화벽을 설정합니다..."

# UFW 기본 정책 설정
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# 필수 포트 허용
ufw allow 22/tcp   comment 'SSH'
ufw allow 80/tcp   comment 'HTTP'
ufw allow 443/tcp  comment 'HTTPS'

# 방화벽 활성화
ufw --force enable

log_info "✓ 방화벽 설정 완료"
log_info "  - SSH (22/tcp): 허용"
log_info "  - HTTP (80/tcp): 허용"
log_info "  - HTTPS (443/tcp): 허용"

################################################################################
# 7. 디렉토리 구조 생성
################################################################################
log_info "디렉토리 구조를 생성합니다..."

# 기본 디렉토리 생성
mkdir -p /opt/workly/{nginx,certbot,scripts,logs}
mkdir -p /opt/workly/nginx/{conf.d,ssl}
mkdir -p /opt/workly/certbot/{etc,var,www}

# 권한 설정
chmod -R 755 /opt/workly

log_info "✓ 디렉토리 구조 생성 완료"
log_info "  - /opt/workly/nginx: Nginx 설정"
log_info "  - /opt/workly/certbot: SSL 인증서"
log_info "  - /opt/workly/scripts: 배포 스크립트"
log_info "  - /opt/workly/logs: 로그 파일"

################################################################################
# 8. Docker 로그 로테이션 설정
################################################################################
log_info "Docker 로그 로테이션을 설정합니다..."

cat > /etc/logrotate.d/docker << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
    notifempty
    maxsize 10M
}
EOF

log_info "✓ Docker 로그 로테이션 설정 완료"
log_info "  - 로테이션: 일일"
log_info "  - 보관 기간: 7일"
log_info "  - 최대 크기: 10MB"

################################################################################
# 9. 시스템 로그 로테이션 설정
################################################################################
log_info "Workly 로그 로테이션을 설정합니다..."

cat > /etc/logrotate.d/workly << 'EOF'
/opt/workly/logs/*.log {
    rotate 14
    daily
    compress
    missingok
    delaycompress
    notifempty
    maxsize 50M
    create 0644 root root
}
EOF

log_info "✓ Workly 로그 로테이션 설정 완료"
log_info "  - 로테이션: 일일"
log_info "  - 보관 기간: 14일"
log_info "  - 최대 크기: 50MB"

################################################################################
# 10. Docker 데몬 설정 최적화
################################################################################
log_info "Docker 데몬을 최적화합니다..."

mkdir -p /etc/docker

cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Docker 재시작
systemctl restart docker

log_info "✓ Docker 데몬 최적화 완료"
log_info "  - 로그 드라이버: json-file"
log_info "  - 최대 로그 크기: 10MB"
log_info "  - 최대 로그 파일: 3개"

################################################################################
# 11. 시스템 정보 출력
################################################################################
log_info "=========================================="
log_info "서버 초기 설정이 완료되었습니다!"
log_info "=========================================="
echo ""
log_info "시스템 정보:"
echo "  - OS: $(lsb_release -d | cut -f2)"
echo "  - Kernel: $(uname -r)"
echo "  - Docker: $(docker --version)"
echo "  - Docker Compose: $(docker-compose --version)"
echo ""
log_info "메모리 정보:"
free -h
echo ""
log_info "Swap 정보:"
swapon --show
echo ""
log_info "방화벽 상태:"
ufw status
echo ""
log_info "디렉토리 구조:"
tree -L 2 /opt/workly 2>/dev/null || ls -la /opt/workly
echo ""

################################################################################
# 12. 다음 단계 안내
################################################################################
log_info "=========================================="
log_info "다음 단계:"
log_info "=========================================="
echo ""
echo "1. GitHub에서 SSH 키 등록:"
echo "   - 로컬에서 SSH 키 생성: ssh-keygen -t ed25519 -C 'github-actions'"
echo "   - 공개 키를 서버에 추가: ssh-copy-id -i ~/.ssh/id_ed25519.pub root@<server-ip>"
echo ""
echo "2. 배포 파일 업로드:"
echo "   - docker-compose.yml을 /opt/workly/에 업로드"
echo "   - Nginx 설정을 /opt/workly/nginx/에 업로드"
echo "   - 배포 스크립트를 /opt/workly/scripts/에 업로드"
echo ""
echo "3. 환경 변수 설정:"
echo "   - /opt/workly/.env 파일 생성"
echo "   - 필요한 환경 변수 설정 (DOMAIN, EMAIL 등)"
echo ""
echo "4. SSL 인증서 발급:"
echo "   - init-ssl.sh 스크립트 실행"
echo ""
echo "5. 메모리 모니터링 설정:"
echo "   - monitor-memory.sh 스크립트 설치"
echo "   - Cron 작업 등록"
echo ""
log_info "서버가 배포 준비 상태입니다!"
