#!/bin/bash

# Docker 이미지 빌드 스크립트
# 사용법: ./scripts/build-docker-images.sh [web|admin|all]

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 함수: 이미지 크기 확인
check_image_size() {
    local image_name=$1
    local max_size_mb=500
    
    echo -e "${YELLOW}이미지 크기 확인 중...${NC}"
    
    # 이미지 크기 가져오기 (MB 단위)
    local size_bytes=$(docker image inspect "$image_name" --format='{{.Size}}')
    local size_mb=$((size_bytes / 1024 / 1024))
    
    echo -e "이미지 크기: ${size_mb}MB"
    
    if [ $size_mb -gt $max_size_mb ]; then
        echo -e "${RED}⚠️  경고: 이미지 크기가 목표치(${max_size_mb}MB)를 초과했습니다!${NC}"
        return 1
    else
        echo -e "${GREEN}✓ 이미지 크기가 목표치 이내입니다.${NC}"
        return 0
    fi
}

# 함수: Web 앱 빌드
build_web() {
    echo -e "${GREEN}=== Web 앱 Docker 이미지 빌드 시작 ===${NC}"
    
    docker build \
        -t workly-web:latest \
        -t workly-web:test \
        -f apps/web/Dockerfile \
        .
    
    echo -e "${GREEN}✓ Web 앱 이미지 빌드 완료${NC}"
    check_image_size "workly-web:latest"
}

# 함수: Admin 앱 빌드
build_admin() {
    echo -e "${GREEN}=== Admin 앱 Docker 이미지 빌드 시작 ===${NC}"
    
    # Admin 앱이 존재하는지 확인
    if [ ! -d "apps/admin/src" ]; then
        echo -e "${YELLOW}⚠️  Admin 앱이 아직 생성되지 않았습니다. 건너뜁니다.${NC}"
        return 0
    fi
    
    docker build \
        -t workly-admin:latest \
        -t workly-admin:test \
        -f apps/admin/Dockerfile \
        .
    
    echo -e "${GREEN}✓ Admin 앱 이미지 빌드 완료${NC}"
    check_image_size "workly-admin:latest"
}

# 함수: 이미지 테스트
test_image() {
    local image_name=$1
    local container_name=$2
    local port=$3
    
    echo -e "${GREEN}=== ${image_name} 이미지 테스트 시작 ===${NC}"
    
    # 컨테이너 실행
    echo "컨테이너 시작 중..."
    docker run -d \
        --name "$container_name" \
        -p "$port:3000" \
        -e NODE_ENV=production \
        "$image_name"
    
    # 헬스 체크 대기
    echo "애플리케이션 시작 대기 중..."
    sleep 10
    
    # 헬스 체크
    echo "헬스 체크 수행 중..."
    if curl -f http://localhost:$port/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 헬스 체크 성공${NC}"
    else
        echo -e "${YELLOW}⚠️  헬스 체크 실패 (헬스 체크 엔드포인트가 아직 구현되지 않았을 수 있습니다)${NC}"
    fi
    
    # 컨테이너 로그 확인
    echo -e "\n컨테이너 로그:"
    docker logs "$container_name" | tail -n 20
    
    # 컨테이너 중지 및 제거
    echo -e "\n컨테이너 정리 중..."
    docker stop "$container_name"
    docker rm "$container_name"
    
    echo -e "${GREEN}✓ 테스트 완료${NC}"
}

# 메인 로직
case "${1:-all}" in
    web)
        build_web
        echo -e "\n${YELLOW}이미지 테스트를 실행하시겠습니까? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            test_image "workly-web:latest" "workly-web-test" 3000
        fi
        ;;
    admin)
        build_admin
        echo -e "\n${YELLOW}이미지 테스트를 실행하시겠습니까? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            test_image "workly-admin:latest" "workly-admin-test" 3001
        fi
        ;;
    all)
        build_web
        build_admin
        
        echo -e "\n${GREEN}=== 빌드 완료 ===${NC}"
        echo -e "\n빌드된 이미지 목록:"
        docker images | grep workly
        
        echo -e "\n${YELLOW}이미지 테스트를 실행하시겠습니까? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            test_image "workly-web:latest" "workly-web-test" 3000
            if [ -d "apps/admin/src" ]; then
                test_image "workly-admin:latest" "workly-admin-test" 3001
            fi
        fi
        ;;
    *)
        echo -e "${RED}사용법: $0 [web|admin|all]${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}=== 모든 작업 완료 ===${NC}"
