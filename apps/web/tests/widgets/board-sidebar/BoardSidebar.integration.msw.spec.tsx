
import { setScenario } from '@/tests/msw/server';
import { withProviders } from '@/tests/utils/Providers';
import { SuspenseWrap } from '@/tests/utils/SuspenseWrap';
import { BoardSidebar } from '@/widgets/board-sidebar/ui/BoardSidebar';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { boardSidebarHandlers } from '../../msw/handlers/widgets.board-sidebar.handlers';
import { ErrorBoundaryWrap } from '../../utils/ErrorBoundaryWrap';

let capturedError: any = null;

vi.mock("@/shared/ui/Icon", () => ({
    default: () => <svg data-testid="icon-mock" />,
}));

const renderUI = (ui: React.ReactNode) =>
    render(
        withProviders(
            <ErrorBoundaryWrap errorTestId="error" onError={(err) => (capturedError = err)}>
                <SuspenseWrap>{ui}</SuspenseWrap>
            </ErrorBoundaryWrap>
        )
    );


beforeEach(() => {
    setScenario(boardSidebarHandlers.success);
});

it('로딩→데이터 렌더→보드 선택 동작', async () => {
    renderUI(<BoardSidebar />);

    const loader = screen.getByTestId('loading');
    await waitForElementToBeRemoved(loader);

    expect(screen.queryByTestId("error")).toBeNull();

    expect(screen.getByText('공지사항')).toBeInTheDocument();
    expect(screen.getByText('자유게시판')).toBeInTheDocument();

    fireEvent.click(screen.getByText('속닥속닥'));
});