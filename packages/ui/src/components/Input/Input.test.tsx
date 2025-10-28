import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input 컴포넌트", () => {
  it("기본 입력 필드가 렌더링된다", () => {
    render(<Input placeholder="텍스트를 입력하세요" />);
    expect(screen.getByPlaceholderText("텍스트를 입력하세요")).toBeInTheDocument();
  });

  it("값 변경을 처리한다", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "새로운 값" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("다양한 타입을 지원한다", () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "text");

    rerender(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");

    rerender(<Input type="password" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "password");
  });

  it("비활성화될 수 있다", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("읽기 전용으로 설정할 수 있다", () => {
    render(<Input readOnly value="읽기 전용 값" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveValue("읽기 전용 값");
  });

  it("다양한 크기를 지원한다", () => {
    const { rerender } = render(<Input size="sm" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();

    rerender(<Input size="md" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();

    rerender(<Input size="lg" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("다양한 상태를 지원한다", () => {
    const { rerender } = render(<Input status="default" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();

    rerender(<Input status="success" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();

    rerender(<Input status="error" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("왼쪽 요소를 지원한다", () => {
    render(<Input left={<span data-testid="left-element">@</span>} />);
    expect(screen.getByTestId("left-element")).toBeInTheDocument();
  });

  it("오른쪽 요소를 지원한다", () => {
    render(<Input right={<span data-testid="right-element">.com</span>} />);
    expect(screen.getByTestId("right-element")).toBeInTheDocument();
  });

  it("왼쪽과 오른쪽 요소를 동시에 지원한다", () => {
    render(<Input left={<span data-testid="left-element">@</span>} right={<span data-testid="right-element">.com</span>} />);
    expect(screen.getByTestId("left-element")).toBeInTheDocument();
    expect(screen.getByTestId("right-element")).toBeInTheDocument();
  });

  it("커스텀 오프셋을 지원한다", () => {
    render(<Input left={<span data-testid="left-element">@</span>} lefttOffset={20} rightOffset={30} />);
    expect(screen.getByTestId("left-element")).toBeInTheDocument();
  });
});
