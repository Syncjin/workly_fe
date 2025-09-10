import type { SidebarGroup } from '@/widgets/board-sidebar/model/useSidebarBoard';
import CollapsibleBoardTree from '@/widgets/board-sidebar/ui/CollapsibleBoardTree';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

// Icon 컴포넌트는 UI에 영향 없으니 가볍게 목업
vi.mock('@/shared/ui/Icon', () => ({
    __esModule: true,
    default: () => <span data-testid="icon" />,
}));



const data: SidebarGroup[] = [
    {
        category: { id: 1, name: '공지사항', order: 0 },
        boards: [{ id: 4, name: '공지 모음', order: 0, categoryId: 1 }],
    },
    {
        category: { id: 2, name: '자유게시판', order: 1 },
        boards: [{ id: 3, name: '속닥속닥', order: 0, categoryId: 2 }],
    },
];

describe('CollapsibleBoardTree (presentational)', () => {
    test('트리/카테고리/보드 라벨 렌더 및 기본은 모두 접힘', () => {
        render(<CollapsibleBoardTree data={data} />);

        // 트리 역할
        expect(screen.getByRole('tree')).toBeInTheDocument();
        // 라벨
        expect(screen.getByText('공지사항')).toBeInTheDocument();
        expect(screen.getByText('자유게시판')).toBeInTheDocument();
        expect(screen.getByText('공지 모음')).toBeInTheDocument();
        expect(screen.getByText('속닥속닥')).toBeInTheDocument();

        // 기본 접힘: panel hidden + 헤더/아이템 aria-expanded=false
        const panel1 = document.getElementById('panel-1')!;
        const panel2 = document.getElementById('panel-2')!;
        expect(panel1).toHaveAttribute('hidden');
        expect(panel2).toHaveAttribute('hidden');

        const header1 = screen.getByRole('button', { name: '공지사항' });
        const header2 = screen.getByRole('button', { name: '자유게시판' });
        expect(header1).toHaveAttribute('aria-expanded', 'false');
        expect(header2).toHaveAttribute('aria-expanded', 'false');
    });

    test('카테고리 헤더 클릭으로 토글(열림/닫힘) 동작', () => {
        render(<CollapsibleBoardTree data={data} />);

        const item = screen
            .getAllByRole('treeitem')
            .find(el => within(el).queryByText('공지사항', { selector: 'span' }));
        expect(item).toBeTruthy();

        const headerBtn = within(item!).getByRole('button');

        const panel1 = document.getElementById('panel-1');

        // 열기
        fireEvent.click(headerBtn);
        expect(headerBtn).toHaveAttribute('aria-expanded', 'true');
        expect(panel1).not.toHaveAttribute('hidden');

        // 닫기
        fireEvent.click(headerBtn);
        expect(headerBtn).toHaveAttribute('aria-expanded', 'false');
        expect(panel1).toHaveAttribute('hidden');
    });

    test('키보드(Enter/Space)로 토글 가능', () => {
        render(<CollapsibleBoardTree data={data} />);

        const item = screen
            .getAllByRole('treeitem')
            .find(el => within(el).queryByText('자유게시판', { selector: 'span' }));
        expect(item).toBeTruthy();

        const headerBtn = within(item!).getByRole('button');
        const panel2 = document.getElementById('panel-2')!;

        headerBtn.focus();
        fireEvent.keyDown(headerBtn, { key: 'Enter' });
        expect(headerBtn).toHaveAttribute('aria-expanded', 'true');
        expect(panel2).not.toHaveAttribute('hidden');

        fireEvent.keyDown(headerBtn, { key: ' ' });
        expect(headerBtn).toHaveAttribute('aria-expanded', 'false');
        expect(panel2).toHaveAttribute('hidden');
    });

    test('defaultExpandedCategoryIds가 있으면 해당 카테고리만 초기 확장', () => {
        const { container } = render(<CollapsibleBoardTree data={data} defaultExpandedCategoryIds={[1]} />);

        const buttons = within(container).getAllByRole('button');
        const header1 = buttons.find(btn =>
            btn.getAttribute('data-role') === 'category-header' &&
            within(btn).queryByText('공지사항')
        )!;
        const header2 = buttons.find(btn =>
            btn.getAttribute('data-role') === 'category-header' &&
            within(btn).queryByText('자유게시판')
        )!;

        // 버튼의 aria-expanded 확인
        expect(header1).toHaveAttribute('aria-expanded', 'true');
        expect(header2).toHaveAttribute('aria-expanded', 'false');

        // 패널 상태도 확인 (ID로 직접 찾기)
        const panel1 = container.querySelector('#panel-1');
        const panel2 = container.querySelector('#panel-2');

        // 패널 상태 확인
        expect(panel1).not.toHaveAttribute('hidden');
        expect(panel2).toHaveAttribute('hidden');

        // treeitem도 같은 상태여야 함
        const treeitems = within(container).getAllByRole('treeitem');
        const item1 = treeitems.find(el =>
            within(el).queryByText('공지사항', { selector: 'span' })
        );
        const item2 = treeitems.find(el =>
            within(el).queryByText('자유게시판', { selector: 'span' })
        );

        expect(item1).toHaveAttribute('aria-expanded', 'true');
        expect(item2).toHaveAttribute('aria-expanded', 'false');
    });

    test('defaultExpandedCategoryIds가 없고 activeBoardId가 있으면 해당 카테고리 자동 확장', () => {
        // activeBoardId=3은 "자유게시판"에 속함 → 카테고리 2가 자동 확장
        const { container } = render(<CollapsibleBoardTree data={data} activeBoardId={3} />);
        const panel1 = container.querySelector('#panel-1');
        const panel2 = container.querySelector('#panel-2');
        expect(panel1).toHaveAttribute('hidden');
        expect(panel2).not.toHaveAttribute('hidden');

        const buttons = within(container).getAllByRole('button');
        const header2 = buttons.find(btn =>
            btn.getAttribute('data-role') === 'category-header' &&
            within(btn).queryByText('자유게시판')
        );
        expect(header2).toHaveAttribute('aria-expanded', 'true');
    });

    test('activeBoardId가 설정되면 해당 보드 버튼에 aria-current="true"', () => {
        const { container } = render(<CollapsibleBoardTree data={data} activeBoardId={3} defaultExpandedCategoryIds={[1, 2]} />);

        // 패널 2는 자동으로 열려 있으므로 보드 버튼을 찾을 수 있음
        const buttons = within(container).getAllByRole('button');
        const activeBtn = buttons.find(btn =>
            btn.getAttribute('aria-current') === 'true' &&
            within(btn).queryByText('속닥속닥')
        );

        expect(activeBtn).toHaveAttribute('aria-current', 'true');

        // 다른 보드는 aria-current 없어야 함 (모든 패널을 열어서 접근 가능하게 함)
        buttons.filter(btn =>
            btn.getAttribute('aria-current') !== 'true'
        ).forEach(btn => {
            expect(btn).not.toHaveAttribute('aria-current');
        })
    });

});
