import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./index";

describe("Button 컴포넌트", () => {
  it("텍스트와 함께 버튼이 렌더링된다", () => {
    render(<Button>클릭하세요</Button>);
    expect(screen.getByRole("button", { name: "클릭하세요" })).toBeInTheDocument();
  });

  it("클릭 이벤트를 처리한다", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭하세요</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("커스텀 클래스명을 적용한다", () => {
    render(<Button className="custom-class">버튼</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("비활성화될 수 있다", () => {
    render(<Button disabled>비활성화된 버튼</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("다양한 크기를 지원한다", () => {
    const { rerender } = render(<Button size="sm">작은 버튼</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button size="md">중간 버튼</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button size="lg">큰 버튼</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("다양한 색상을 지원한다", () => {
    const { rerender } = render(<Button color="brand-600">브랜드 버튼</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button color="gray-600">회색 버튼</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("로딩 상태를 표시한다", () => {
    render(<Button loading>로딩 중</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("unstyled 속성을 지원한다", () => {
    render(
      <Button unstyled className="custom-unstyled">
        스타일 없는 버튼
      </Button>
    );
    expect(screen.getByRole("button")).toHaveClass("custom-unstyled");
  });
});
