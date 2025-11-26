#!/bin/bash

################################################################################
# 메모리 모니터링 Cron 설치 스크립트
# 
# 이 스크립트는 메모리 모니터링을 Cron에 등록합니다.
# - 5분마다 메모리 사용량 체크
# - 로그 파일에 결과 기록
#
# 사용법: sudo bash install-memory-monitor.sh
################################################################################

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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
    exit 1
fi

log_info "메모리 모니터링 Cron 작업을 설치합니다..."

# 스크립트 경로
SCRIPT_PATH="/opt/workly/scripts/monitor-memory.sh"
LOG_PATH="/opt/workly/logs/memory-monitor.log"

# 스크립트 존재 확인
if [ ! -f "$SCRIPT_PATH" ]; then
    log_error "모니터링 스크립트를 찾을 수 없습니다: $SCRIPT_PATH"
    log_info "먼저 monitor-memory.sh를 /opt/workly/scripts/에 복사하세요."
    exit 1
fi

# 실행 권한 부여
chmod +x "$SCRIPT_PATH"
log_info "✓ 스크립트 실행 권한 부여"

# 로그 디렉토리 생성
mkdir -p "$(dirname "$LOG_PATH")"
log_info "✓ 로그 디렉토리 생성"

# Cron 작업 추가
CRON_JOB="*/5 * * * * $SCRIPT_PATH >> $LOG_PATH 2>&1"

# 기존 Cron 작업 확인
if crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH"; then
    log_warn "메모리 모니터링 Cron 작업이 이미 등록되어 있습니다."
    log_info "기존 작업을 유지합니다."
else
    # Cron 작업 추가
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    log_info "✓ Cron 작업 등록 완료"
fi

# 환경 변수 설정 안내
log_info ""
log_info "=========================================="
log_info "선택적 설정: 알림 발송"
log_info "=========================================="
echo ""
echo "알림을 받으려면 다음 환경 변수를 설정하세요:"
echo ""
echo "1. Slack 알림:"
echo "   export SLACK_WEBHOOK_URL='https://hooks.slack.com/services/YOUR/WEBHOOK/URL'"
echo ""
echo "2. Discord 알림:"
echo "   export DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/YOUR/WEBHOOK/URL'"
echo ""
echo "3. 이메일 알림:"
echo "   export ALERT_EMAIL='your-email@example.com'"
echo ""
echo "환경 변수를 /etc/environment 또는 ~/.bashrc에 추가하세요."
echo ""

# 현재 Cron 작업 표시
log_info "=========================================="
log_info "등록된 Cron 작업:"
log_info "=========================================="
crontab -l | grep "$SCRIPT_PATH" || echo "없음"
echo ""

# 수동 테스트 안내
log_info "=========================================="
log_info "테스트 방법:"
log_info "=========================================="
echo ""
echo "1. 수동 실행:"
echo "   sudo bash $SCRIPT_PATH"
echo ""
echo "2. 로그 확인:"
echo "   tail -f $LOG_PATH"
echo ""
echo "3. Cron 작업 확인:"
echo "   crontab -l"
echo ""

log_info "메모리 모니터링이 5분마다 자동 실행됩니다."
log_info "설치 완료!"
