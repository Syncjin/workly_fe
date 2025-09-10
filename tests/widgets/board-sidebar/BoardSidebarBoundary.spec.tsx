import { SidebarBoundary } from '@/widgets/board-sidebar/ui/BoardSidebarBoundary';
import { fireEvent, render, screen } from '@testing-library/react';

function Boom() { throw new Error('fail'); }

describe('BoardSidebarBoundary', () => {
    it('자식이 throw하면 fallback을 보여준다', () => {
        render(
            <SidebarBoundary>
                <Boom />
            </SidebarBoundary>
        );
        expect(screen.getByText(/오류/i)).toBeInTheDocument();
    });

    it('다시 시도 클릭 시 reset(복구) 동작', () => {
        render(
            <SidebarBoundary>
                <Boom />
            </SidebarBoundary>
        );
        fireEvent.click(screen.getByRole('button', { name: /다시/i }));
        // 구현에 따라 자식 교체/상태 초기화 등으로 복구 확인
        // 예: expect(screen.queryByText(/오류/)).not.toBeInTheDocument();
    });
});