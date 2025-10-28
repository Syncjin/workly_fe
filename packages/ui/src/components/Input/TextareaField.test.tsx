import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextareaField } from "./TextareaField";

describe("TextareaField 컴포넌트", () => {
  it("기본 텍스트 영역이 렌더링된다", () => {
    render(<TextareaField placeholder="내용을 입력하세요" />);
    expect(screen.getByPlaceholderText("내용을 입력하세요")).toBeInTheDocument();
  });

  it("라벨과 함께 렌더링된다", () => {
    render(<TextareaField label="설명" />);
    expect(screen.getByText("설명")).toBeInTheDocument();
  });

  it("설명 텍스트를 표시한다", () => {
    render(<TextareaField description="자세한 설명을 입력하세요" />);
    expect(screen.getByText("자세한 설명을 입력하세요")).toBeInTheDocument();
  });

  it("도움말 텍스트를 표시한다", () => {
    render(<TextareaField helperText="최대 500자까지 입력 가능합니다" />);
    expect(screen.getByText("최대 500자까지 입력 가능합니다")).toBeInTheDocument();
  });

  it("오류 상태와 오류 메시지를 표시한다", () => {
    render(<TextareaField status="error" errorText="내용을 입력해주세요" />);
    expect(screen.getByText("내용을 입력해주세요")).toBeInTheDocument();
  });

  it("성공 상태와 성공 메시지를 표시한다", () => {
    render(<TextareaField status="success" successText="올바르게 입력되었습니다" />);
    expect(screen.getByText("올바르게 입력되었습니다")).toBeInTheDocument();
  });

  it("값 변경을 처리한다", () => {
    const handleChange = vi.fn();
    render(<TextareaField onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "새로운 내용" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("다양한 크기를 지원한다", () => {
    const { rerender } = render(<TextareaField size="sm" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<TextareaField size="md" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<TextareaField size="lg" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();

    rerender(<TextareaField size="xl" data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeInTheDocument();
  });

  it("비활성화될 수 있다", () => {
    render(<TextareaField disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("읽기 전용으로 설정할 수 있다", () => {
    render(<TextareaField readOnly value="읽기 전용 내용" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readonly");
    expect(textarea).toHaveValue("읽기 전용 내용");
  });

  it("행과 열을 설정할 수 있다", () => {
    render(<TextareaField rows={8} cols={50} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("rows", "8");
    expect(textarea).toHaveAttribute("cols", "50");
  });

  it("라벨, 설명, 도움말을 모두 표시한다", () => {
    render(<TextareaField label="피드백" description="서비스에 대한 의견을 자유롭게 작성해주세요" helperText="최소 10자 이상 작성해주세요" />);

    expect(screen.getByText("피드백")).toBeInTheDocument();
    expect(screen.getByText("서비스에 대한 의견을 자유롭게 작성해주세요")).toBeInTheDocument();
    expect(screen.getByText("최소 10자 이상 작성해주세요")).toBeInTheDocument();
  });

  it("오류 상태일 때 오류 메시지만 표시한다", () => {
    render(<TextareaField status="error" errorText="내용이 너무 짧습니다" helperText="도움말 텍스트" successText="성공 메시지" />);

    expect(screen.getByText("내용이 너무 짧습니다")).toBeInTheDocument();
    expect(screen.getByText("도움말 텍스트")).toBeInTheDocument();
    expect(screen.queryByText("성공 메시지")).not.toBeInTheDocument();
  });

  it("성공 상태일 때 성공 메시지를 표시한다", () => {
    render(<TextareaField status="success" successText="완벽한 피드백입니다" helperText="도움말 텍스트" errorText="오류 메시지" />);

    expect(screen.getByText("완벽한 피드백입니다")).toBeInTheDocument();
    expect(screen.getByText("도움말 텍스트")).toBeInTheDocument();
    expect(screen.queryByText("오류 메시지")).not.toBeInTheDocument();
  });

  it("최대 길이를 설정할 수 있다", () => {
    render(<TextareaField maxLength={200} data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toHaveAttribute("maxlength", "200");
  });

  it("포커스 이벤트를 처리한다", () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    render(<TextareaField onFocus={handleFocus} onBlur={handleBlur} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalled();

    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalled();
  });

  it("키보드 이벤트를 처리한다", () => {
    const handleKeyDown = vi.fn();
    const handleKeyUp = vi.fn();
    render(<TextareaField onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(handleKeyDown).toHaveBeenCalled();

    fireEvent.keyUp(textarea, { key: "Enter" });
    expect(handleKeyUp).toHaveBeenCalled();
  });
});
