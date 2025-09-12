import { serialize } from 'cookie';
import { delay, http, HttpResponse } from 'msw';


export const commonAuthHandlers = [
    http.post(`/api/auth/refresh`, async ({ request, requestId }) => {
        const headers = (request as any).headers;
        const cookie = headers.get('cookie');
        const hasCookieRT = cookie?.includes('refreshToken=');

        await delay(10);

        const cookies = [
            serialize('refreshToken', 'RT-TEST', {
                httpOnly: true,
                path: '/',
                maxAge: 1800,
                secure: false,
            }),
            serialize('csrfToken', 'CSRF-TEST', {
                httpOnly: false,
                path: '/',
                maxAge: 1800,
                secure: false,
            }),
        ];

        if (hasCookieRT) {
            // 쿠키 기반 호출 → 갱신 결과 JSON + 쿠키 세팅
            return HttpResponse.json(
                { status: 200, code: 'OK', message: 'ok', data: { refreshToken: 'RT-TEST', expiresIn: 1800 } },
                { headers: { 'Set-Cookie': cookies as unknown as any } } // 배열 허용
            );
        } else {
            // 바디 기반 호출 → 토큰 바디 + 쿠키 세팅
            return HttpResponse.json(
                {
                    status: 200, code: "OK", message: 'ok', data: {
                        accessToken: 'AT-TEST',
                        refreshToken: 'RT-TEST',
                        csrfToken: 'CSRF-TEST',
                        tokenType: 'Bearer',
                        expiresIn: 108000,
                    }
                },
                { headers: { 'Set-Cookie': cookies as unknown as any } }
            );
        }
    }),
];
