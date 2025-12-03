#!/bin/bash

################################################################################
# Workly 메모리 모니터링 스크립트
# 
# 이 스크립트는 시스템 메모리 사용량을 모니터링하고 임계값 초과 시 알림을 발송합니다.
# - 메모리 사용량 체크
# - 80% 초과 시 경고 로그
# - 90% 초과 시 알림 발송
#
# 사용법: bash monitor-memory.sh
# Cron 설정: */5 * * * * /opt/workly/scripts/monitor-memory.sh >> /opt/workly/logs/memory-monitor.log 2>&1
################################################################################

set -e

# 설정
WARNING_THRESHOLD=80  # 경고 임계값 (%)
CRITICAL_THRESHOLD=90 # 위험 임계값 (%)
LOG_FILE="/opt/workly/logs/memory-monitor.log"
ALERT_FILE="/opt/workly/logs/memory-alerts.log"

# 로그 디렉토리 생성
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$(dirname "$ALERT_FILE")"

# 색상 정의 (터미널 출력용)
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 타임스탬프 함수
timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# 로그 함수
log_info() {
    echo "[$(timestamp)] [INFO] $1" | tee -a "$LOG_FILE"
}

log_warn() {
    echo "[$(timestamp)] [WARN] $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo "[$(timestamp)] [ERROR] $1" | tee -a "$LOG_FILE" "$ALERT_FILE"
}

################################################################################
# 메모리 사용량 계산
################################################################################

# 전체 메모리 (KB)
TOTAL_MEM=$(grep MemTotal /proc/meminfo | awk '{print $2}')

# 사용 가능한 메모리 (KB)
AVAILABLE_MEM=$(grep MemAvailable /proc/meminfo | awk '{print $2}')

# 사용 중인 메모리 (KB)
USED_MEM=$((TOTAL_MEM - AVAILABLE_MEM))

# 메모리 사용률 (%)
MEMORY_USAGE=$((USED_MEM * 100 / TOTAL_MEM))

# Swap 정보
TOTAL_SWAP=$(grep SwapTotal /proc/meminfo | awk '{print $2}')
FREE_SWAP=$(grep SwapFree /proc/meminfo | awk '{print $2}')
USED_SWAP=$((TOTAL_SWAP - FREE_SWAP))

# Swap 사용률 (%)
if [ "$TOTAL_SWAP" -gt 0 ]; then
    SWAP_USAGE=$((USED_SWAP * 100 / TOTAL_SWAP))
else
    SWAP_USAGE=0
fi

################################################################################
# 메모리 정보 포맷팅
################################################################################

# KB를 MB로 변환
to_mb() {
    echo "scale=2; $1 / 1024" | bc
}

TOTAL_MEM_MB=$(to_mb $TOTAL_MEM)
USED_MEM_MB=$(to_mb $USED_MEM)
AVAILABLE_MEM_MB=$(to_mb $AVAILABLE_MEM)
TOTAL_SWAP_MB=$(to_mb $TOTAL_SWAP)
USED_SWAP_MB=$(to_mb $USED_SWAP)

################################################################################
# Docker 컨테이너 메모리 사용량
################################################################################

get_container_memory() {
    if command -v docker &> /dev/null; then
        docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}" 2>/dev/null || echo "Docker 정보 없음"
    else
        echo "Docker가 설치되지 않음"
    fi
}

################################################################################
# 상태 판단 및 로깅
################################################################################

if [ "$MEMORY_USAGE" -ge "$CRITICAL_THRESHOLD" ]; then
    # 위험 수준 (90% 이상)
    log_error "🚨 메모리 사용량이 위험 수준입니다!"
    log_error "  - 메모리 사용률: ${MEMORY_USAGE}%"
    log_error "  - 사용 중: ${USED_MEM_MB}MB / ${TOTAL_MEM_MB}MB"
    log_error "  - 사용 가능: ${AVAILABLE_MEM_MB}MB"
    log_error "  - Swap 사용률: ${SWAP_USAGE}%"
    log_error "  - Swap 사용 중: ${USED_SWAP_MB}MB / ${TOTAL_SWAP_MB}MB"
    
    # Docker 컨테이너 정보
    log_error ""
    log_error "Docker 컨테이너 메모리 사용량:"
    get_container_memory | while IFS= read -r line; do
        log_error "  $line"
    done
    
    # 조치 권장사항
    log_error ""
    log_error "권장 조치:"
    log_error "  1. 불필요한 컨테이너 중지"
    log_error "  2. 서버 사양 업그레이드 (1GB → 2GB RAM)"
    log_error "  3. 메모리 누수 확인"
    
    # 알림 발송 (선택적)
    send_alert "CRITICAL" "$MEMORY_USAGE"
    
elif [ "$MEMORY_USAGE" -ge "$WARNING_THRESHOLD" ]; then
    # 경고 수준 (80% 이상)
    log_warn "⚠️  메모리 사용량이 높습니다."
    log_warn "  - 메모리 사용률: ${MEMORY_USAGE}%"
    log_warn "  - 사용 중: ${USED_MEM_MB}MB / ${TOTAL_MEM_MB}MB"
    log_warn "  - 사용 가능: ${AVAILABLE_MEM_MB}MB"
    log_warn "  - Swap 사용률: ${SWAP_USAGE}%"
    
    # Docker 컨테이너 정보
    log_warn ""
    log_warn "Docker 컨테이너 메모리 사용량:"
    get_container_memory | while IFS= read -r line; do
        log_warn "  $line"
    done
    
    # 알림 발송 (선택적)
    send_alert "WARNING" "$MEMORY_USAGE"
    
else
    # 정상 수준
    log_info "✓ 메모리 사용량이 정상입니다."
    log_info "  - 메모리 사용률: ${MEMORY_USAGE}%"
    log_info "  - 사용 중: ${USED_MEM_MB}MB / ${TOTAL_MEM_MB}MB"
    log_info "  - 사용 가능: ${AVAILABLE_MEM_MB}MB"
    log_info "  - Swap 사용률: ${SWAP_USAGE}%"
fi

################################################################################
# 알림 발송 함수
################################################################################

send_alert() {
    local LEVEL=$1
    local USAGE=$2
    
    # Slack 알림 (선택적)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        send_slack_alert "$LEVEL" "$USAGE"
    fi
    
    # Discord 알림 (선택적)
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        send_discord_alert "$LEVEL" "$USAGE"
    fi
    
    # 이메일 알림 (선택적)
    if [ -n "$ALERT_EMAIL" ] && command -v mail &> /dev/null; then
        send_email_alert "$LEVEL" "$USAGE"
    fi
}

send_slack_alert() {
    local LEVEL=$1
    local USAGE=$2
    
    local COLOR
    local EMOJI
    
    if [ "$LEVEL" = "CRITICAL" ]; then
        COLOR="danger"
        EMOJI="🚨"
    else
        COLOR="warning"
        EMOJI="⚠️"
    fi
    
    local HOSTNAME=$(hostname)
    local MESSAGE="${EMOJI} Workly 서버 메모리 경고\n\n서버: ${HOSTNAME}\n메모리 사용률: ${USAGE}%\n상태: ${LEVEL}"
    
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"attachments\": [{
                \"color\": \"${COLOR}\",
                \"text\": \"${MESSAGE}\",
                \"footer\": \"Workly Memory Monitor\",
                \"ts\": $(date +%s)
            }]
        }" \
        2>/dev/null || log_error "Slack 알림 발송 실패"
}

send_discord_alert() {
    local LEVEL=$1
    local USAGE=$2
    
    local COLOR
    local EMOJI
    
    if [ "$LEVEL" = "CRITICAL" ]; then
        COLOR=15158332  # Red
        EMOJI="🚨"
    else
        COLOR=16776960  # Yellow
        EMOJI="⚠️"
    fi
    
    local HOSTNAME=$(hostname)
    
    curl -X POST "$DISCORD_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{
            \"embeds\": [{
                \"title\": \"${EMOJI} Workly 서버 메모리 경고\",
                \"description\": \"서버: ${HOSTNAME}\\n메모리 사용률: ${USAGE}%\\n상태: ${LEVEL}\",
                \"color\": ${COLOR},
                \"footer\": {
                    \"text\": \"Workly Memory Monitor\"
                },
                \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"
            }]
        }" \
        2>/dev/null || log_error "Discord 알림 발송 실패"
}

send_email_alert() {
    local LEVEL=$1
    local USAGE=$2
    
    local HOSTNAME=$(hostname)
    local SUBJECT="[${LEVEL}] Workly 서버 메모리 경고 - ${HOSTNAME}"
    local BODY="서버: ${HOSTNAME}
메모리 사용률: ${USAGE}%
상태: ${LEVEL}

사용 중: ${USED_MEM_MB}MB / ${TOTAL_MEM_MB}MB
사용 가능: ${AVAILABLE_MEM_MB}MB
Swap 사용률: ${SWAP_USAGE}%

타임스탬프: $(timestamp)
"
    
    echo "$BODY" | mail -s "$SUBJECT" "$ALERT_EMAIL" 2>/dev/null || \
        log_error "이메일 알림 발송 실패"
}

################################################################################
# 로그 파일 크기 제한
################################################################################

# 로그 파일이 10MB를 초과하면 로테이션
MAX_LOG_SIZE=$((10 * 1024 * 1024))  # 10MB in bytes

rotate_log_if_needed() {
    local LOG=$1
    
    if [ -f "$LOG" ]; then
        local SIZE=$(stat -f%z "$LOG" 2>/dev/null || stat -c%s "$LOG" 2>/dev/null || echo 0)
        
        if [ "$SIZE" -gt "$MAX_LOG_SIZE" ]; then
            mv "$LOG" "${LOG}.old"
            touch "$LOG"
            log_info "로그 파일 로테이션: $LOG"
        fi
    fi
}

rotate_log_if_needed "$LOG_FILE"
rotate_log_if_needed "$ALERT_FILE"

################################################################################
# 종료
################################################################################

exit 0
