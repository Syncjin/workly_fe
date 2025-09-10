
import { delay, http, HttpResponse } from 'msw';

export const apiResponse = <T>(data: T, status = 200) => ({
    status,
    code: status === 200 ? 'OK' : 'ERROR',
    message: '',
    data,
    timestamp: new Date().toISOString(),
});

export const commonHandlers = [
    http.get('/api/health', () => HttpResponse.text('ok')),

    http.get('/api/session', () =>
        HttpResponse.json(apiResponse({ userId: 1, name: 'Test User' }))
    ),

    http.get('/api/feature-flags', () =>
        HttpResponse.json(apiResponse({ sidebarNew: true, showBeta: false }))
    ),

    http.get('/api/slow', async () => {
        await delay(300);
        return HttpResponse.json(apiResponse({ ok: true }));
    }),
];