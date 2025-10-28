import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./index";

describe("EmptyState 컴포넌트", () => {
  it("제목과 함께 렌더링된다", () => {
    render(<EmptyState title="항목이 없습니다" />);
    expect(screen.getByText("항목이 없습니다")).toBeInTheDocument();
  });

  it("설명과 함께 렌더링된다", () => {
    render(<EmptyState title="항목이 없습니다" description="검색 조건을 조정해보세요" />);
    expect(screen.getByText("검색 조건을 조정해보세요")).toBeInTheDocument();
  });

  it("커스텀 아이콘과 함께 렌더링된다", () => {
    const customIcon = <div data-testid="custom-icon">커스텀 아이콘</div>;
    render(<EmptyState title="항목이 없습니다" icon={customIcon} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("액션 버튼과 함께 렌더링되고 클릭을 처리한다", () => {
    const mockAction = vi.fn();
    render(<EmptyState title="항목이 없습니다" action={{ label: "새로 만들기", onClick: mockAction }} />);

    const button = screen.getByText("새로 만들기");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("커스텀 클래스명을 적용한다", () => {
    const { container } = render(<EmptyState title="항목이 없습니다" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
