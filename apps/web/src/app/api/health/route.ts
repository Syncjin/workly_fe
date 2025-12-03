import { NextResponse } from "next/server";

/**
 * Health Check API
 *
 * 컨테이너 헬스 체크 및 배포 검증용 엔드포인트
 * Docker healthcheck와 GitHub Actions에서 사용
 */
export async function GET() {
  try {
    // 기본 헬스 체크
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NEXT_PUBLIC_ENV || "unknown",
      nodeVersion: process.version,
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    // 에러 발생 시
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
