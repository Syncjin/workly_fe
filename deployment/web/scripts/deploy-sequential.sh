#!/bin/bash

################################################################################
# 순차 배포 스크립트 (Web 서버) - 1GB RAM 최적화
# 
# 이 스크립트는 메모리 제약이 있는 환경에서 순차적으로 배포를 수행합니다.
# Blue-Green 배포와 달리 활성 컨테이너를 먼저 중지하여 메모리를 확보한 후
# 새 컨테이너를 시작합니다. 이로 인해 5-10초의 다운타임이 발생합니다.
#
# 요구사항: 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3, 8.4, 8.5
################################################################################

set -e  # 에러 발생 시 즉시 종료

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOYMENT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$DEPLOYMENT_DIR/docker-compose.yml"
NGINX_CONF="$DEPLOYMENT_DIR/nginx/conf.d/default.conf"
LOG_FILE="$DEPLOYMENT_DIR/logs/deploy-$(date +%Y%m%d-%H%M%S).log"
STATE_FILE="$DEPLOYMENT_DIR/.active-environment"

# 헬스 체크 설정
MAX_HEALTH_RETRIES=30
HEALTH_CHECK_INTERVAL=10
HEALTH_CHECK_TIMEOUT=5

# 로그 디렉토리 생성
mkdir -p "$(dirname "$LOG_FILE")"

################################################################################
# 로깅 함수
################################################################################

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
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
# 환경 관리 함수
################################################################################

# 현재 활성 환경 가져오기
get_active_environment() {
    if [ -f "$STATE_FILE" ]; then
        cat "$STATE_FILE"
    else
        # 기본값: blue
        echo "blue"
    fi
}

# 활성 환경 설정
set_active_environment() {
    local env=$1
    echo "$env" > "$STATE_FILE"
    log_info "활성 환경을 $env로 설정했습니다"
}

# 비활성 환경 가져오기
get_inactive_environment() {
    local active=$(get_active_environment)
    if [ "$active" = "blue" ]; then
        echo "green"
    else
        echo "blue"
    fi
}

# 컨테이너 이름 가져오기
get_container_name() {
    local env=$1
    echo "workly-web-${env}"
}

# 컨테이너 포트 가져오기
get_container_port() {
    local env=$1
    if [ "$env" = "blue" ]; then
        echo "3000"
    else
        echo "3001"
    fi
}

################################################################################
# 헬스 체크 함수
################################################################################

# 컨테이너 헬스 체크
wait_for_healthy() {
    local container=$1
    local port=$2
    local max_retries=$MAX_HEALTH_RETRIES
    local interval=$HEALTH_CHECK_INTERVAL
    
    log_info "컨테이너 $container 헬스 체크 시작 (최대 ${max_retries}회, ${interval}초 간격)"
    
    for i in $(seq 1 $max_retries); do
        log_info "헬스 체크 시도 $i/$max_retries..."
        
        # curl로 헬스 체크 엔드포인트 호출
        if curl -f -s --max-time $HEALTH_CHECK_TIMEOUT "http://localhost:${port}/api/health" > /dev/null 2>&1; then
            log_success "✓ 헬스 체크 성공! 컨테이너가 정상 작동 중입니다"
            return 0
        fi
        
        # 컨테이너 상태 확인
        if ! docker ps --filter "name=$container" --filter "status=running" | grep -q "$container"; then
            log_error "✗ 컨테이너가 실행 중이지 않습니다"
            return 1
        fi
        
        if [ $i -lt $max_retries ]; then
            log_warning "헬스 체크 실패, ${interval}초 후 재시도..."
            sleep $interval
        fi
    done
    
    log_error "✗ 헬스 체크 실패: 최대 재시도 횟수 초과"
    return 1
}

################################################################################
# Nginx 설정 관리 함수
################################################################################

# Nginx 설정에서 upstream 업데이트
update_nginx_upstream() {
    local target_env=$1
    local target_container="web-${target_env}"
    
    log_info "Nginx upstream을 $target_container로 업데이트 중..."
    
    # 백업 생성
    cp "$NGINX_CONF" "${NGINX_CONF}.backup"
    
    # upstream 설정 업데이트
    sed -i.tmp "s/server web-[a-z]*:3000;/server ${target_container}:3000;/" "$NGINX_CONF"
    rm -f "${NGINX_CONF}.tmp"
    
    log_success "Nginx 설정 업데이트 완료"
}

# Nginx 설정 검증
validate_nginx_config() {
    log_info "Nginx 설정 검증 중..."
    
    if docker exec workly-nginx nginx -t > /dev/null 2>&1; then
        log_success "✓ Nginx 설정이 유효합니다"
        return 0
    else
        log_error "✗ Nginx 설정이 유효하지 않습니다"
        return 1
    fi
}

# Nginx 리로드
reload_nginx() {
    log_info "Nginx 리로드 중..."
    
    if docker exec workly-nginx nginx -s reload; then
        log_success "✓ Nginx 리로드 완료"
        return 0
    else
        log_error "✗ Nginx 리로드 실패"
        return 1
    fi
}

# Nginx 설정 롤백
rollback_nginx_config() {
    log_warning "Nginx 설정을 이전 상태로 롤백 중..."
    
    if [ -f "${NGINX_CONF}.backup" ]; then
        mv "${NGINX_CONF}.backup" "$NGINX_CONF"
        reload_nginx
        log_success "Nginx 설정 롤백 완료"
    else
        log_error "백업 파일을 찾을 수 없습니다"
    fi
}

################################################################################
# Docker 관리 함수
################################################################################

# Docker 이미지 풀
pull_image() {
    local env=$1
    local image_tag="${env}"
    
    log_info "Docker 이미지 풀 중: ${image_tag}"
    
    cd "$DEPLOYMENT_DIR"
    if docker compose pull "web-${env}"; then
        log_success "✓ 이미지 풀 완료"
        return 0
    else
        log_error "✗ 이미지 풀 실패"
        return 1
    fi
}

# 컨테이너 중지
stop_container() {
    local env=$1
    local container=$(get_container_name "$env")
    
    log_info "컨테이너 중지 중: $container"
    
    cd "$DEPLOYMENT_DIR"
    if docker compose stop "web-${env}"; then
        log_success "✓ 컨테이너 중지 완료"
        return 0
    else
        log_warning "컨테이너 중지 실패 (이미 중지되었을 수 있음)"
        return 0
    fi
}

# 컨테이너 시작
start_container() {
    local env=$1
    local container=$(get_container_name "$env")
    
    log_info "컨테이너 시작 중: $container"
    
    cd "$DEPLOYMENT_DIR"
    if docker compose up -d "web-${env}"; then
        log_success "✓ 컨테이너 시작 완료"
        return 0
    else
        log_error "✗ 컨테이너 시작 실패"
        return 1
    fi
}

################################################################################
# 배포 함수
################################################################################

# 배포 전 검증
pre_deployment_checks() {
    log_info "배포 전 검증 시작..."
    
    # docker-compose 파일 존재 확인
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "docker-compose.yml 파일을 찾을 수 없습니다: $COMPOSE_FILE"
        return 1
    fi
    
    # Nginx 설정 파일 존재 확인
    if [ ! -f "$NGINX_CONF" ]; then
        log_error "Nginx 설정 파일을 찾을 수 없습니다: $NGINX_CONF"
        return 1
    fi
    
    # Docker 실행 확인
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker가 실행 중이지 않습니다"
        return 1
    fi
    
    log_success "✓ 배포 전 검증 완료"
    return 0
}

# 메인 배포 함수
deploy() {
    local start_time=$(date +%s)
    
    log_info "========================================="
    log_info "순차 배포 시작 (Web 서버)"
    log_info "========================================="
    
    # 배포 전 검증
    if ! pre_deployment_checks; then
        log_error "배포 전 검증 실패"
        exit 1
    fi
    
    # 현재 환경 확인
    local active_env=$(get_active_environment)
    local inactive_env=$(get_inactive_environment)
    local active_container=$(get_container_name "$active_env")
    local inactive_container=$(get_container_name "$inactive_env")
    local inactive_port=$(get_container_port "$inactive_env")
    
    log_info "현재 활성 환경: $active_env ($active_container)"
    log_info "배포 대상 환경: $inactive_env ($inactive_container)"
    
    # 1. 새 이미지 풀
    log_info "========================================="
    log_info "1단계: 새 이미지 풀"
    log_info "========================================="
    if ! pull_image "$inactive_env"; then
        log_error "이미지 풀 실패"
        exit 1
    fi
    
    # 2. 활성 컨테이너 중지 (메모리 확보)
    log_info "========================================="
    log_info "2단계: 활성 컨테이너 중지 (메모리 확보)"
    log_info "========================================="
    log_warning "⚠️  서비스 다운타임 시작 (약 5-10초 예상)"
    stop_container "$active_env"
    
    # 3. 비활성 컨테이너 시작
    log_info "========================================="
    log_info "3단계: 새 컨테이너 시작"
    log_info "========================================="
    if ! start_container "$inactive_env"; then
        log_error "컨테이너 시작 실패"
        log_warning "활성 컨테이너를 다시 시작합니다..."
        start_container "$active_env"
        exit 1
    fi
    
    # 4. 헬스 체크
    log_info "========================================="
    log_info "4단계: 헬스 체크"
    log_info "========================================="
    if ! wait_for_healthy "$inactive_container" "$inactive_port"; then
        log_error "헬스 체크 실패"
        log_warning "새 컨테이너를 중지하고 이전 컨테이너를 다시 시작합니다..."
        stop_container "$inactive_env"
        start_container "$active_env"
        exit 1
    fi
    
    # 5. 트래픽 전환
    log_info "========================================="
    log_info "5단계: 트래픽 전환"
    log_info "========================================="
    update_nginx_upstream "$inactive_env"
    
    # 6. Nginx 설정 검증
    if ! validate_nginx_config; then
        log_error "Nginx 설정 검증 실패"
        rollback_nginx_config
        stop_container "$inactive_env"
        start_container "$active_env"
        exit 1
    fi
    
    # 7. Nginx 리로드
    if ! reload_nginx; then
        log_error "Nginx 리로드 실패"
        rollback_nginx_config
        stop_container "$inactive_env"
        start_container "$active_env"
        exit 1
    fi
    
    log_success "✓ 서비스 다운타임 종료"
    
    # 8. 활성 환경 업데이트
    set_active_environment "$inactive_env"
    
    # 배포 완료
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_info "========================================="
    log_success "배포 완료!"
    log_info "========================================="
    log_info "새 활성 환경: $inactive_env ($inactive_container)"
    log_info "배포 소요 시간: ${duration}초"
    log_info "로그 파일: $LOG_FILE"
    log_info "========================================="
}

################################################################################
# 메인 실행
################################################################################

# 인자 처리
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    status)
        active=$(get_active_environment)
        echo "현재 활성 환경: $active"
        ;;
    *)
        echo "사용법: $0 {deploy|status}"
        exit 1
        ;;
esac
