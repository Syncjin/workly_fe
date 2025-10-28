import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea 컴포넌트", () => {
  it("기본 텍스트 영역이 렌더링된다", () => {
    render(<Textarea placeholder="내용을 입력하세요" />);
    expect(screen.getByPlaceholderText("내용을 입력하세요")).toBeInTheDocument();
  });

  it("값 변경을 처리한다", () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "새로운 내용" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("초기값을 설정할 수 있다", () => {
    render(<Textarea value="초기 내용" readOnly />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("초기 내용");
  });

  it("비활성화될 수 있다", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("읽기 전용으로 설정할 수 있다", () => {
    render(<Textarea readOnly value="읽기 전용 내용" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readonly");
    expect(textarea).toHaveValue("읽기 전용 내용");
  });

  it("다양한 크기를 지원한다", () => {
    const { rerender } = render(<Textarea size="sm" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<Textarea size="md" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<Textarea size="lg" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<Textarea size="xl" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();
  });

  it("다양한 상태를 지원한다", () => {
    const { rerender } = render(<Textarea status="default" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<Textarea status="success" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<Textarea status="error" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();
  });

  it("행과 열을 설정할 수 있다", () => {
    render(<Textarea rows={5} cols={30} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("cols", "30");
  });

  it("최대 길이를 설정할 수 있다", () => {
    render(<Textarea maxLength={100} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("maxlength", "100");
  });

  it("커스텀 클래스명을 적용할 수 있다", () => {
    render(<Textarea className="custom-textarea" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveClass("custom-textarea");
  });

  it("커스텀 스타일을 적용할 수 있다", () => {
    render(<Textarea style={{ backgroundColor: "red" }} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveStyle({ backgroundColor: "red" });
  });

  it("포커스 이벤트를 처리한다", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalled();
  });
});
