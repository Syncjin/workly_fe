import type { SidebarGroup } from '@/widgets/board-sidebar/model/useSidebarBoard';
import CollapsibleBoardTree from '@/widgets/board-sidebar/ui/CollapsibleBoardTree';
import { fireEvent, render, screen } from '@testing-library/react';

// Icon 컴포넌트는 UI에 영향 없으니 가볍게 목업
jest.mock('@/shared/ui/Icon', () => ({
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

        const header1 = screen.getByRole('button', { name: '공지사항' });
        const panel1 = document.getElementById('panel-1')!;

        // 열기
        fireEvent.click(header1);
        expect(header1).toHaveAttribute('aria-expanded', 'true');
        expect(panel1).not.toHaveAttribute('hidden');

        // 닫기
        fireEvent.click(header1);
        expect(header1).toHaveAttribute('aria-expanded', 'false');
        expect(panel1).toHaveAttribute('hidden');
    });

    test('키보드(Enter/Space)로 토글 가능', () => {
        render(<CollapsibleBoardTree data={data} />);

        const header2 = screen.getByRole('button', { name: '자유게시판' });
        const panel2 = document.getElementById('panel-2')!;

        header2.focus();
        fireEvent.keyDown(header2, { key: 'Enter' });
        expect(header2).toHaveAttribute('aria-expanded', 'true');
        expect(panel2).not.toHaveAttribute('hidden');

        fireEvent.keyDown(header2, { key: ' ' });
        expect(header2).toHaveAttribute('aria-expanded', 'false');
        expect(panel2).toHaveAttribute('hidden');
    });

    test('defaultExpandedCategoryIds가 있으면 해당 카테고리만 초기 확장', () => {
        render(<CollapsibleBoardTree data={data} defaultExpandedCategoryIds={[1]} />);

        const panel1 = document.getElementById('panel-1')!;
        const panel2 = document.getElementById('panel-2')!;
        expect(panel1).not.toHaveAttribute('hidden');
        expect(panel2).toHaveAttribute('hidden');

        const header1 = screen.getByRole('button', { name: '공지사항' });
        const header2 = screen.getByRole('button', { name: '자유게시판' });
        expect(header1).toHaveAttribute('aria-expanded', 'true');
        expect(header2).toHaveAttribute('aria-expanded', 'false');
    });

    test('defaultExpandedCategoryIds가 없고 activeBoardId가 있으면 해당 카테고리 자동 확장', () => {
        // activeBoardId=3은 "자유게시판"에 속함 → 카테고리 2가 자동 확장
        render(<CollapsibleBoardTree data={data} activeBoardId={3} />);

        const panel1 = document.getElementById('panel-1')!;
        const panel2 = document.getElementById('panel-2')!;
        expect(panel1).toHaveAttribute('hidden');
        expect(panel2).not.toHaveAttribute('hidden');

        const header2 = screen.getByRole('button', { name: '자유게시판' });
        expect(header2).toHaveAttribute('aria-expanded', 'true');
    });

    test('activeBoardId가 설정되면 해당 보드 버튼에 aria-current="true"', () => {
        render(<CollapsibleBoardTree data={data} activeBoardId={3} />);

        // 패널 2는 자동으로 열려 있으므로 보드 버튼을 찾을 수 있음
        const activeBoardBtn = screen.getByRole('button', { name: '속닥속닥' });
        expect(activeBoardBtn).toHaveAttribute('aria-current', 'true');

        // 다른 보드는 aria-current 없어야 함
        const otherBoardBtn = screen.getByRole('button', { name: '공지 모음' });
        expect(otherBoardBtn).not.toHaveAttribute('aria-current');
    });

    test('보드 클릭 시 onSelectBoard로 보드 객체를 전달', () => {
        const onSelectBoard = jest.fn();
        render(<CollapsibleBoardTree data={data} onSelectBoard={onSelectBoard} defaultExpandedCategoryIds={[1, 2]} />);

        fireEvent.click(screen.getByRole('button', { name: '속닥속닥' }));
        expect(onSelectBoard).toHaveBeenCalledTimes(1);

        // 콜백으로 넘어온 보드 확인
        const arg = onSelectBoard.mock.calls[0][0];
        expect(arg).toMatchObject({ id: 3, name: '속닥속닥', categoryId: 2 });
    });

    test('className이 nav에 합쳐진다', () => {
        const { container } = render(<CollapsibleBoardTree data={data} className="extra-class" />);
        const nav = container.querySelector('nav[data-ui="board-tree"]')!;
        expect(nav.className).toContain('extra-class');
    });
});
