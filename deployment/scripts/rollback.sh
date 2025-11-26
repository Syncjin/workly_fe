#!/bin/bash

################################################################################
# 롤백 스크립트
# 
# 배포 실패 시 이전 활성 환경으로 트래픽을 전환하고 실패한 컨테이너를 중지합니다.
# Web 서버와 Admin 서버 모두에서 사용 가능합니다.
#
# 요구사항: 9.1, 9.2, 9.3, 9.4, 9.5
################################################################################

set -e  # 에러 발생 시 즉시 종료

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# 로깅 함수
################################################################################

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}"
}

log_info() {
    log "INFO" "${BLUE}$@${NC}"
}

log_success() {
    log "SUCCESS" "${GREEN}$@${NC}"
}

log_warning() {
    log "WARNING" "${YELLOW}$@${NC}"
}

log_error() {
    log "ERROR" "${RED}$@${NC}"
}

################################################################################
# 사용법 출력
################################################################################

usage() {
    cat << EOF
사용법: $0 <server-type> [options]

서버 타입:
  web       Web 서버 롤백
  admin     Admin 서버 롤백

옵션:
  -r, --reason <reason>    롤백 사유 (선택)
  -h, --help              도움말 표시

예제:
  $0 web
  $0 admin --reason "헬스 체크 실패"
  $0 web -r "배포 후 에러 발생"

EOF
    exit 1
}

################################################################################
# 환경 관리 함수
################################################################################

# 현재 활성 환경 가져오기
get_active_environment() {
    local state_file=$1
    if [ -f "$state_file" ]; then
        cat "$state_file"
    else
        log_error "활성 환경 상태 파일을 찾을 수 없습니다: $state_file"
        exit 1
    fi
}

# 활성 환경 설정
set_active_environment() {
    local state_file=$1
    local env=$2
    echo "$env" > "$state_file"
    log_info "활성 환경을 $env로 설정했습니다"
}

# 이전 환경 가져오기
get_previous_environment() {
    local current=$1
    if [ "$current" = "blue" ]; then
        echo "green"
    else
        echo "blue"
    fi
}

################################################################################
# Nginx 설정 관리 함수
################################################################################

# Nginx 설정 복원
restore_nginx_config() {
    local nginx_conf=$1
    local backup_file="${nginx_conf}.backup"
    
    log_info "Nginx 설정 복원 중..."
    
    if [ -f "$backup_file" ]; then
        cp "$backup_file" "$nginx_conf"
        log_success "✓ Nginx 설정 복원 완료"
        return 0
    else
        log_warning "백업 파일을 찾을 수 없습니다. upstream을 수동으로 업데이트합니다."
        return 1
    fi
}

# Nginx upstream 업데이트
update_nginx_upstream() {
    local nginx_conf=$1
    local target_env=$2
    local server_type=$3
    local target_container="${server_type}-${target_env}"
    
    log_info "Nginx upstream을 $target_container로 업데이트 중..."
    
    # upstream 설정 업데이트
    sed -i.tmp "s/server ${server_type}-[a-z]*:3000;/server ${target_container}:3000;/" "$nginx_conf"
    rm -f "${nginx_conf}.tmp"
    
    log_success "Nginx 설정 업데이트 완료"
}

# Nginx 설정 검증
validate_nginx_config() {
    local nginx_container=$1
    
    log_info "Nginx 설정 검증 중..."
    
    if docker exec "$nginx_container" nginx -t > /dev/null 2>&1; then
        log_success "✓ Nginx 설정이 유효합니다"
        return 0
    else
        log_error "✗ Nginx 설정이 유효하지 않습니다"
        return 1
    fi
}

# Nginx 리로드
reload_nginx() {
    local nginx_container=$1
    
    log_info "Nginx 리로드 중..."
    
    if docker exec "$nginx_container" nginx -s reload; then
        log_success "✓ Nginx 리로드 완료"
        return 0
    else
        log_error "✗ Nginx 리로드 실패"
        return 1
    fi
}

################################################################################
# Docker 관리 함수
################################################################################

# 컨테이너 중지
stop_container() {
    local deployment_dir=$1
    local service_name=$2
    local container_name=$3
    
    log_info "실패한 컨테이너 중지 중: $container_name"
    
    cd "$deployment_dir"
    if docker-compose stop "$service_name" 2>/dev/null; then
        log_success "✓ 컨테이너 중지 완료"
        return 0
    else
        log_warning "컨테이너 중지 실패 (이미 중지되었을 수 있음)"
        return 0
    fi
}

# 컨테이너 시작
start_container() {
    local deployment_dir=$1
    local service_name=$2
    local container_name=$3
    
    log_info "이전 컨테이너 시작 중: $container_name"
    
    cd "$deployment_dir"
    if docker-compose up -d "$service_name"; then
        log_success "✓ 컨테이너 시작 완료"
        return 0
    else
        log_error "✗ 컨테이너 시작 실패"
        return 1
    fi
}

################################################################################
# 롤백 함수
################################################################################

# 롤백 로그 기록
log_rollback() {
    local log_file=$1
    local reason=$2
    local current_env=$3
    local previous_env=$4
    
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    cat >> "$log_file" << EOF

========================================
롤백 실행
========================================
시간: $timestamp
사유: $reason
현재 환경: $current_env
롤백 대상: $previous_env
========================================

EOF
}

# 메인 롤백 함수
rollback() {
    local server_type=$1
    local reason=${2:-"수동 롤백"}
    
    log_info "========================================="
    log_warning "롤백 시작 ($server_type 서버)"
    log_info "========================================="
    log_info "롤백 사유: $reason"
    
    # 서버 타입에 따른 경로 설정
    local deployment_dir
    local nginx_container
    local container_prefix
    
    case "$server_type" in
        web)
            deployment_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../web" && pwd)"
            nginx_container="workly-nginx"
            container_prefix="web"
            ;;
        admin)
            deployment_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../admin" && pwd)"
            nginx_container="workly-admin-nginx"
            container_prefix="admin"
            ;;
        *)
            log_error "알 수 없는 서버 타입: $server_type"
            usage
            ;;
    esac
    
    local state_file="$deployment_dir/.active-environment"
    local nginx_conf="$deployment_dir/nginx/conf.d/default.conf"
    local log_file="$deployment_dir/logs/rollback-$(date +%Y%m%d-%H%M%S).log"
    
    # 로그 디렉토리 생성
    mkdir -p "$(dirname "$log_file")"
    
    # 현재 환경 확인
    local current_env=$(get_active_environment "$state_file")
    local previous_env=$(get_previous_environment "$current_env")
    local current_container="workly-${container_prefix}-${current_env}"
    local previous_container="workly-${container_prefix}-${previous_env}"
    
    log_info "현재 활성 환경: $current_env ($current_container)"
    log_info "롤백 대상 환경: $previous_env ($previous_container)"
    
    # 롤백 로그 기록
    log_rollback "$log_file" "$reason" "$current_env" "$previous_env"
    
    # 1. 이전 컨테이너 시작 (순차 배포의 경우 중지되어 있음)
    log_info "========================================="
    log_info "1단계: 이전 컨테이너 시작"
    log_info "========================================="
    start_container "$deployment_dir" "${container_prefix}-${previous_env}" "$previous_container"
    
    # 2. Nginx 설정 복원 또는 업데이트
    log_info "========================================="
    log_info "2단계: Nginx 설정 복원"
    log_info "========================================="
    
    if ! restore_nginx_config "$nginx_conf"; then
        # 백업이 없으면 수동으로 업데이트
        update_nginx_upstream "$nginx_conf" "$previous_env" "$container_prefix"
    fi
    
    # 3. Nginx 설정 검증
    if ! validate_nginx_config "$nginx_container"; then
        log_error "Nginx 설정 검증 실패"
        exit 1
    fi
    
    # 4. Nginx 리로드
    if ! reload_nginx "$nginx_container"; then
        log_error "Nginx 리로드 실패"
        exit 1
    fi
    
    # 5. 실패한 컨테이너 중지
    log_info "========================================="
    log_info "3단계: 실패한 컨테이너 중지"
    log_info "========================================="
    stop_container "$deployment_dir" "${container_prefix}-${current_env}" "$current_container"
    
    # 6. 활성 환경 업데이트
    set_active_environment "$state_file" "$previous_env"
    
    # 롤백 완료
    log_info "========================================="
    log_success "롤백 완료!"
    log_info "========================================="
    log_info "활성 환경: $previous_env ($previous_container)"
    log_info "롤백 로그: $log_file"
    log_info "========================================="
    
    # 알림 발송 (선택적)
    send_notification "$server_type" "$reason" "$previous_env"
}

################################################################################
# 알림 함수
################################################################################

# 알림 발송
send_notification() {
    local server_type=$1
    local reason=$2
    local environment=$3
    
    log_info "알림 발송 중..."
    
    # Slack 웹훅이 설정되어 있으면 알림 발송
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        local message="🔄 *롤백 완료*\n서버: ${server_type}\n환경: ${environment}\n사유: ${reason}"
        
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"$message\"}" \
            > /dev/null 2>&1 || log_warning "Slack 알림 발송 실패"
    fi
    
    # Discord 웹훅이 설정되어 있으면 알림 발송
    if [ -n "${DISCORD_WEBHOOK_URL:-}" ]; then
        local message="🔄 **롤백 완료**\n서버: ${server_type}\n환경: ${environment}\n사유: ${reason}"
        
        curl -X POST "$DISCORD_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"content\":\"$message\"}" \
            > /dev/null 2>&1 || log_warning "Discord 알림 발송 실패"
    fi
    
    log_success "✓ 알림 발송 완료"
}

################################################################################
# 메인 실행
################################################################################

# 인자 파싱
if [ $# -eq 0 ]; then
    usage
fi

SERVER_TYPE=""
REASON="수동 롤백"

while [ $# -gt 0 ]; do
    case "$1" in
        web|admin)
            SERVER_TYPE="$1"
            shift
            ;;
        -r|--reason)
            REASON="$2"
            shift 2
            ;;
        -h|--help)
            usage
            ;;
        *)
            log_error "알 수 없는 옵션: $1"
            usage
            ;;
    esac
done

# 서버 타입 확인
if [ -z "$SERVER_TYPE" ]; then
    log_error "서버 타입을 지정해야 합니다"
    usage
fi

# 롤백 실행
rollback "$SERVER_TYPE" "$REASON"
