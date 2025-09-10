
import { server } from '@/tests/msw/server';
import { withProviders } from '@/tests/utils/Providers';
import { SuspenseWrap } from '@/tests/utils/SuspenseWrap';
import { BoardSidebar } from '@/widgets/board-sidebar/ui/BoardSidebar';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';

const wrapper = (ui: React.ReactNode) => withProviders(<SuspenseWrap>{ui}</SuspenseWrap>);

beforeEach(() => {
    server.use(
        http.get('/api/board-category', async () => {
            await delay(10);
            return HttpResponse.json({
                status: 200, code: 'OK', message: 'ok',
                data: [
                    { categoryId: 1, categoryName: '공지사항', sortOrder: 0 },
                    { categoryId: 2, categoryName: '자유게시판', sortOrder: 1 },
                ],
            });
        }),
        http.get('/api/boards', async () => {
            await delay(10);
            return HttpResponse.json({
                status: 200, code: 'OK', message: 'ok',
                data: [
                    { boardId: 4, boardName: '공지 모음', sortOrder: 0, categoryId: 1 },
                    { boardId: 3, boardName: '속닥속닥', sortOrder: 0, categoryId: 2 },
                ],
            });
        })
    );
});

it('로딩→데이터 렌더→보드 선택 동작', async () => {
    render(wrapper(<BoardSidebar />));
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

    expect(screen.getByText('공지사항')).toBeInTheDocument();
    expect(screen.getByText('자유게시판')).toBeInTheDocument();

    fireEvent.click(screen.getByText('속닥속닥'));
    // 라우팅 or 콜백 검증 (BoardSidebar 구현에 맞게)
});