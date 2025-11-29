#!/bin/bash

# Nginx 설정 검증 스크립트
# 이 스크립트는 Nginx 설정 파일의 문법을 검증하고 필요한 파일들이 존재하는지 확인합니다.

set -e

# 색상 코드
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

# 사용법 출력
usage() {
    echo "Usage: $0 [web|admin|all]"
    echo ""
    echo "Options:"
    echo "  web   - Validate Web server Nginx configuration"
    echo "  admin - Validate Admin server Nginx configuration"
    echo "  all   - Validate both Web and Admin configurations (default)"
    exit 1
}

# 설정 파일 존재 여부 확인
check_config_files() {
    local server_type=$1
    local base_path="deployment/${server_type}/nginx"
    local all_exist=true

    log_info "Checking ${server_type} server configuration files..."

    # nginx.conf 확인
    if [ -f "${base_path}/nginx.conf" ]; then
        log_info "✓ ${base_path}/nginx.conf exists"
    else
        log_error "✗ ${base_path}/nginx.conf not found"
        all_exist=false
    fi

    # conf.d/default.conf 확인
    if [ -f "${base_path}/conf.d/default.conf" ]; then
        log_info "✓ ${base_path}/conf.d/default.conf exists"
    else
        log_error "✗ ${base_path}/conf.d/default.conf not found"
        all_exist=false
    fi

    if [ "$all_exist" = false ]; then
        return 1
    fi

    return 0
}

# Nginx 설정 문법 검증 (Docker 컨테이너 사용)
validate_nginx_syntax() {
    local server_type=$1
    local base_path="deployment/${server_type}/nginx"

    log_info "Validating ${server_type} server Nginx syntax..."

    # Docker를 사용하여 Nginx 설정 검증
    # 실제 파일 경로를 컨테이너에 마운트하여 검증
    if docker run --rm \
        -v "$(pwd)/${base_path}/nginx.conf:/etc/nginx/nginx.conf:ro" \
        -v "$(pwd)/${base_path}/conf.d:/etc/nginx/conf.d:ro" \
        nginx:alpine nginx -t 2>&1; then
        log_info "✓ ${server_type} server Nginx configuration is valid"
        return 0
    else
        log_error "✗ ${server_type} server Nginx configuration has syntax errors"
        return 1
    fi
}

# 설정 파일 내용 검증
validate_config_content() {
    local server_type=$1
    local base_path="deployment/${server_type}/nginx"
    local default_conf="${base_path}/conf.d/default.conf"
    local all_valid=true

    log_info "Validating ${server_type} server configuration content..."

    # HTTP → HTTPS 리다이렉트 확인
    if grep -q "return 301 https://" "${default_conf}"; then
        log_info "✓ HTTP to HTTPS redirect configured"
    else
        log_warn "⚠ HTTP to HTTPS redirect not found"
        all_valid=false
    fi

    # ACME 챌린지 경로 확인
    if grep -q "/.well-known/acme-challenge/" "${default_conf}"; then
        log_info "✓ ACME challenge path configured"
    else
        log_warn "⚠ ACME challenge path not found"
        all_valid=false
    fi

    # SSL 설정 확인
    if grep -q "ssl_certificate" "${default_conf}"; then
        log_info "✓ SSL certificate configuration found"
    else
        log_warn "⚠ SSL certificate configuration not found"
        all_valid=false
    fi

    # TLS 1.2 이상 확인
    if grep -q "TLSv1.2" "${default_conf}"; then
        log_info "✓ TLS 1.2+ configured"
    else
        log_warn "⚠ TLS 1.2+ not configured"
        all_valid=false
    fi

    # 프록시 헤더 확인
    if grep -q "proxy_set_header" "${default_conf}"; then
        log_info "✓ Proxy headers configured"
    else
        log_warn "⚠ Proxy headers not found"
        all_valid=false
    fi

    # HSTS 헤더 확인
    if grep -q "Strict-Transport-Security" "${default_conf}"; then
        log_info "✓ HSTS header configured"
    else
        log_warn "⚠ HSTS header not found"
        all_valid=false
    fi

    if [ "$all_valid" = false ]; then
        return 1
    fi

    return 0
}

# 메인 검증 함수
validate_server() {
    local server_type=$1
    local validation_failed=false

    echo ""
    log_info "=========================================="
    log_info "Validating ${server_type} server configuration"
    log_info "=========================================="
    echo ""

    # 1. 설정 파일 존재 여부 확인
    if ! check_config_files "${server_type}"; then
        validation_failed=true
    fi

    echo ""

    # 2. 설정 파일 내용 검증
    if ! validate_config_content "${server_type}"; then
        validation_failed=true
    fi

    echo ""

    # 3. Nginx 문법 검증 (Docker 사용)
    if command -v docker &> /dev/null; then
        if ! validate_nginx_syntax "${server_type}"; then
            validation_failed=true
        fi
    else
        log_warn "Docker not found. Skipping syntax validation."
        log_warn "Install Docker to enable syntax validation."
    fi

    echo ""

    if [ "$validation_failed" = true ]; then
        log_error "${server_type} server validation FAILED"
        return 1
    else
        log_info "${server_type} server validation PASSED"
        return 0
    fi
}

# 메인 실행
main() {
    local target="${1:-all}"
    local exit_code=0

    case "$target" in
        web)
            if ! validate_server "web"; then
                exit_code=1
            fi
            ;;
        admin)
            if ! validate_server "admin"; then
                exit_code=1
            fi
            ;;
        all)
            if ! validate_server "web"; then
                exit_code=1
            fi
            if ! validate_server "admin"; then
                exit_code=1
            fi
            ;;
        *)
            usage
            ;;
    esac

    echo ""
    if [ $exit_code -eq 0 ]; then
        log_info "=========================================="
        log_info "All validations PASSED ✓"
        log_info "=========================================="
    else
        log_error "=========================================="
        log_error "Some validations FAILED ✗"
        log_error "=========================================="
    fi

    exit $exit_code
}

# 스크립트 실행
main "$@"
