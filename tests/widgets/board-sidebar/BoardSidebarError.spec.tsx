import { BoardSidebarError } from '@/widgets/board-sidebar/ui/errors/BoardSidebarError';
import { fireEvent, render, screen } from '@testing-library/react';

it('다시 시도 버튼이 onRetry를 호출한다', () => {
    const onRetry = jest.fn();
    render(<BoardSidebarError onRetry={onRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /다시/i }));
    expect(onRetry).toHaveBeenCalled();
});