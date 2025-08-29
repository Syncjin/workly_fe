// pages/api/[...proxy].ts
import { NextApiRequest, NextApiResponse } from 'next';

// 인증이 필요한 API 경로들
const protectedPaths = [
    '/board',
    '/admin',
    '/profile',
    '/dashboard',
    '/settings'
];

// 특별 처리가 필요한 경로들 (프록시하지 않음)
const specialPaths = [
    '/users/token',
    '/auth/refresh',
    '/users/logout'
];

// 토큰 갱신 Promise를 저장할 변수 (동시 요청 처리용)
let refreshPromise: Promise<string | null> | null = null;

// refreshToken으로 새 accessToken 가져오기
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refreshToken=${refreshToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.data?.accessToken || null;
        }
        return null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
    }
}

// 공유 토큰 갱신 함수 (동시 요청 시 한 번만 실행)
async function getRefreshedToken(refreshToken: string): Promise<string | null> {
    // 이미 진행 중인 토큰 갱신이 있다면 그 결과를 기다림
    if (refreshPromise) {
        return refreshPromise;
    }

    // 새로운 토큰 갱신 시작
    refreshPromise = refreshAccessToken(refreshToken);

    try {
        const result = await refreshPromise;
        return result;
    } finally {
        // 완료되면 Promise 초기화
        refreshPromise = null;
    }
}

// 백엔드 API 요청 함수
async function makeApiRequest(apiPath: string, req: NextApiRequest, authHeader?: string) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1${apiPath}`, {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader }),
            // 쿠키도 전달
            ...(req.headers.cookie && { 'Cookie': req.headers.cookie }),
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { proxy } = req.query;
    const apiPath = Array.isArray(proxy) ? `/${proxy.join('/')}` : `/${proxy}`;

    // 특별 처리 경로는 건너뛰기
    if (specialPaths.some(path => apiPath.startsWith(path))) {
        return res.status(404).json({
            status: 404,
            code: 'NOT_FOUND',
            message: 'API endpoint not found',
            timestamp: new Date().toISOString()
        });
    }

    // 인증이 필요한 경로인지 확인
    const needsAuth = protectedPaths.some(path => apiPath.startsWith(path));

    if (needsAuth) {
        // Authorization 헤더에서 토큰 확인
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) {
            return res.status(401).json({
                status: 401,
                code: 'MISSING_TOKEN',
                message: 'Access token is required',
                timestamp: new Date().toISOString()
            });
        }
    }

    // 백엔드 API로 프록시
    try {
        const authHeader = req.headers.authorization;

        // 첫 번째 요청 시도
        let response = await makeApiRequest(apiPath, req, authHeader);
        let data = await response.json();

        // 401 에러이고 인증이 필요한 경로인 경우 토큰 갱신 시도
        if (response.status === 401 && needsAuth) {
            // refreshToken 쿠키 확인
            const cookies = req.headers.cookie || '';
            const refreshTokenMatch = cookies.match(/refreshToken=([^;]+)/);
            const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

            if (refreshToken) {
                // 새 accessToken 가져오기 (동시 요청 시 한 번만 실행)
                const newAccessToken = await getRefreshedToken(refreshToken);

                if (newAccessToken) {
                    // 새 토큰으로 재시도
                    const newAuthHeader = `Bearer ${newAccessToken}`;
                    response = await makeApiRequest(apiPath, req, newAuthHeader);
                    data = await response.json();
                }
            }
        }

        // 백엔드의 Set-Cookie 헤더가 있다면 전달
        const backendCookies = response.headers.get('set-cookie');
        if (backendCookies) {
            res.setHeader('Set-Cookie', backendCookies);
        }

        // 백엔드 응답을 그대로 전달
        res.status(response.status).json(data);
    } catch (error) {
        console.error('API Proxy error:', error);
        res.status(500).json({
            status: 500,
            code: 'PROXY_ERROR',
            message: 'Failed to communicate with backend',
            timestamp: new Date().toISOString()
        });
    }
}