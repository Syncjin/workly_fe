import { delay, http, HttpResponse } from 'msw';

export const boardSidebarHandlers = {
    success: [
        http.get('/api/board-category', async () => {
            await delay(10);
            return HttpResponse.json({ status: 200, data: [] });
        }),
        http.get('/api/boards', async () => {
            await delay(10);
            return HttpResponse.json({ status: 200, data: [] });
        }),
    ],
    empty: [
        http.get('/api/board-category', () => HttpResponse.json({ status: 200, data: [] })),
        http.get('/api/boards', () => HttpResponse.json({ status: 200, data: [] })),
    ],
    failBoards: [
        http.get('/api/board-category', () => HttpResponse.json({ status: 200, data: [] })),
        http.get('/api/boards', () => new Response(null, { status: 500 })),
    ],
};