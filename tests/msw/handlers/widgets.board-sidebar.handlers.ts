import { delay, http, HttpResponse } from 'msw';


const OK = (data: any) =>
    HttpResponse.json({ status: 200, code: 'OK', message: 'ok', data, timestamp: new Date().toISOString() });

const ERR = (status: number, message = 'error', code = 'ERROR') =>
    HttpResponse.json({ status, code, message, data: null, timestamp: new Date().toISOString() }, { status });


export const boardSidebarHandlers = {
    success: [
        http.get('/api/v1/board-category', async () => {
            await delay(10);
            return OK([
                { categoryId: 2, categoryName: '자유게시판', sortOrder: 1 },
                { categoryId: 1, categoryName: '공지사항', sortOrder: 0 },
            ]);
        }),
        http.get('/api/v1/boards', async () => {
            await delay(10);
            return OK([
                { boardId: 3, boardName: '속닥속닥', description: '', visibility: 'PUBLIC', sortOrder: 0, categoryId: 2, createdDateTime: '', updatedDateTime: '' },
                { boardId: 4, boardName: '공지 모음', description: '', visibility: 'PUBLIC', sortOrder: 0, categoryId: 1, createdDateTime: '', updatedDateTime: '' },
            ]);
        }),
    ],
    empty: [
        http.get('/api/v1/board-category', async () => OK([])),
        http.get('/api/v1/boards', async () => OK([])),
    ],
    failed: [
        http.get('/api/v1/board-category', async () => ERR(400, '요청 파라미터가 올바르지 않습니다.', 'INVALID_REQUEST')),
        http.get('/api/v1/boards', async () => ERR(400, '요청 파라미터가 올바르지 않습니다.', 'INVALID_REQUEST')),
    ],
};