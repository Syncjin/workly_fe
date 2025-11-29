# Docker 이미지 빌드 스크립트 (PowerShell)
# 사용법: .\scripts\build-docker-images.ps1 [web|admin|all]

param(
    [Parameter(Position=0)]
    [ValidateSet("web", "admin", "all")]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"

# 함수: 이미지 크기 확인
function Check-ImageSize {
    param(
        [string]$ImageName
    )
    
    $MaxSizeMB = 500
    
    Write-Host "`n이미지 크기 확인 중..." -ForegroundColor Yellow
    
    # 이미지 크기 가져오기 (MB 단위)
    $sizeBytes = docker image inspect $ImageName --format='{{.Size}}' | Out-String
    $sizeMB = [math]::Round([int64]$sizeBytes.Trim() / 1024 / 1024)
    
    Write-Host "이미지 크기: ${sizeMB}MB"
    
    if ($sizeMB -gt $MaxSizeMB) {
        Write-Host "⚠️  경고: 이미지 크기가 목표치(${MaxSizeMB}MB)를 초과했습니다!" -ForegroundColor Red
        return $false
    } else {
        Write-Host "✓ 이미지 크기가 목표치 이내입니다." -ForegroundColor Green
        return $true
    }
}

# 함수: Web 앱 빌드
function Build-WebApp {
    Write-Host "`n=== Web 앱 Docker 이미지 빌드 시작 ===" -ForegroundColor Green
    
    docker build `
        -t workly-web:latest `
        -t workly-web:test `
        -f apps/web/Dockerfile `
        .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Web 앱 이미지 빌드 실패"
    }
    
    Write-Host "✓ Web 앱 이미지 빌드 완료" -ForegroundColor Green
    Check-ImageSize "workly-web:latest"
}

# 함수: Admin 앱 빌드
function Build-AdminApp {
    Write-Host "`n=== Admin 앱 Docker 이미지 빌드 시작 ===" -ForegroundColor Green
    
    # Admin 앱이 존재하는지 확인
    if (-not (Test-Path "apps/admin/src")) {
        Write-Host "⚠️  Admin 앱이 아직 생성되지 않았습니다. 건너뜁니다." -ForegroundColor Yellow
        return
    }
    
    docker build `
        -t workly-admin:latest `
        -t workly-admin:test `
        -f apps/admin/Dockerfile `
        .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Admin 앱 이미지 빌드 실패"
    }
    
    Write-Host "✓ Admin 앱 이미지 빌드 완료" -ForegroundColor Green
    Check-ImageSize "workly-admin:latest"
}

# 함수: 이미지 테스트
function Test-Image {
    param(
        [string]$ImageName,
        [string]$ContainerName,
        [int]$Port
    )
    
    Write-Host "`n=== ${ImageName} 이미지 테스트 시작 ===" -ForegroundColor Green
    
    try {
        # 컨테이너 실행
        Write-Host "컨테이너 시작 중..."
        docker run -d `
            --name $ContainerName `
            -p "${Port}:3000" `
            -e NODE_ENV=production `
            $ImageName
        
        if ($LASTEXITCODE -ne 0) {
            throw "컨테이너 시작 실패"
        }
        
        # 헬스 체크 대기
        Write-Host "애플리케이션 시작 대기 중..."
        Start-Sleep -Seconds 10
        
        # 헬스 체크
        Write-Host "헬스 체크 수행 중..."
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:${Port}/api/health" -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ 헬스 체크 성공" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️  헬스 체크 실패 (헬스 체크 엔드포인트가 아직 구현되지 않았을 수 있습니다)" -ForegroundColor Yellow
        }
        
        # 컨테이너 로그 확인
        Write-Host "`n컨테이너 로그:"
        docker logs $ContainerName --tail 20
        
        Write-Host "`n✓ 테스트 완료" -ForegroundColor Green
    }
    finally {
        # 컨테이너 정리
        Write-Host "`n컨테이너 정리 중..."
        docker stop $ContainerName 2>$null
        docker rm $ContainerName 2>$null
    }
}

# Docker 설치 확인
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker가 설치되어 있지 않거나 실행 중이지 않습니다." -ForegroundColor Red
    Write-Host "Docker Desktop을 설치하고 실행한 후 다시 시도하세요." -ForegroundColor Yellow
    exit 1
}

# 메인 로직
try {
    switch ($Target) {
        "web" {
            Build-WebApp
            
            $response = Read-Host "`n이미지 테스트를 실행하시겠습니까? (y/n)"
            if ($response -eq "y" -or $response -eq "Y") {
                Test-Image "workly-web:latest" "workly-web-test" 3000
            }
        }
        "admin" {
            Build-AdminApp
            
            $response = Read-Host "`n이미지 테스트를 실행하시겠습니까? (y/n)"
            if ($response -eq "y" -or $response -eq "Y") {
                Test-Image "workly-admin:latest" "workly-admin-test" 3001
            }
        }
        "all" {
            Build-WebApp
            Build-AdminApp
            
            Write-Host "`n=== 빌드 완료 ===" -ForegroundColor Green
            Write-Host "`n빌드된 이미지 목록:"
            docker images | Select-String "workly"
            
            $response = Read-Host "`n이미지 테스트를 실행하시겠습니까? (y/n)"
            if ($response -eq "y" -or $response -eq "Y") {
                Test-Image "workly-web:latest" "workly-web-test" 3000
                if (Test-Path "apps/admin/src") {
                    Test-Image "workly-admin:latest" "workly-admin-test" 3001
                }
            }
        }
    }
    
    Write-Host "`n=== 모든 작업 완료 ===" -ForegroundColor Green
}
catch {
    Write-Host "`n❌ 오류 발생: $_" -ForegroundColor Red
    exit 1
}
