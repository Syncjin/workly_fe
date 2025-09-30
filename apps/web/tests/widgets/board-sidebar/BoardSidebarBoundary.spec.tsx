import { SidebarBoundary } from '@/widgets/board-sidebar/ui/BoardSidebarBoundary';
import { fireEvent, render, screen } from '@testing-library/react';
import { FC } from 'react';
import { describe, expect, it } from 'vitest';

const Boom: FC = () => {
    throw new Error('fail');
};

describe('BoardSidebarBoundary', () => {
    it('자식이 throw하면 fallback을 보여준다', () => {
        render(
            <SidebarBoundary>
                <Boom />
            </SidebarBoundary>
        );
        expect(screen.getByText(/사이드바를 불러오지 못했습니다./i)).toBeInTheDocument();
    });

    it('다시 시도 클릭 시 reset(복구) 동작', () => {
        render(
            <SidebarBoundary>
                <Boom />
            </SidebarBoundary>
        );
        const btn = screen.getByRole('button', { name: /다시 불러오기/i });

        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
    });
});
