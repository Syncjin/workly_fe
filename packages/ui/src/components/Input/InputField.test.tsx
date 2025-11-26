import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InputField } from "./InputField";

describe("InputField 컴포넌트", () => {
  it("기본 입력 필드가 렌더링된다", () => {
    render(<InputField placeholder="텍스트를 입력하세요" />);
    expect(screen.getByPlaceholderText("텍스트를 입력하세요")).toBeInTheDocument();
  });

  it("라벨과 함께 렌더링된다", () => {
    render(<InputField label="이름" />);
    expect(screen.getByText("이름")).toBeInTheDocument();
  });

  it("설명 텍스트를 표시한다", () => {
    render(<InputField description="사용자 이름을 입력하세요" />);
    expect(screen.getByText("사용자 이름을 입력하세요")).toBeInTheDocument();
  });

  it("도움말 텍스트를 표시한다", () => {
    render(<InputField helperText="8자 이상 입력하세요" />);
    expect(screen.getByText("8자 이상 입력하세요")).toBeInTheDocument();
  });

  it("오류 상태와 오류 메시지를 표시한다", () => {
    render(<InputField status="error" errorText="필수 입력 항목입니다" />);
    expect(screen.getByText("필수 입력 항목입니다")).toBeInTheDocument();
  });

  it("성공 상태와 성공 메시지를 표시한다", () => {
    render(<InputField status="success" successText="올바른 형식입니다" />);
    expect(screen.getByText("올바른 형식입니다")).toBeInTheDocument();
  });

  it("값 변경을 처리한다", () => {
    const handleChange = vi.fn();
    render(<InputField onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "새로운 값" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("다양한 크기를 지원한다", () => {
    const { rerender } = render(<InputField size="sm" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();

    rerender(<InputField size="md" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();

    rerender(<InputField size="lg" data-testid="input" />);
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("비활성화될 수 있다", () => {
    render(<InputField disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("읽기 전용으로 설정할 수 있다", () => {
    render(<InputField readOnly value="읽기 전용 값" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveValue("읽기 전용 값");
  });

  it("왼쪽과 오른쪽 요소를 지원한다", () => {
    render(<InputField left={<span data-testid="left-element">@</span>} right={<span data-testid="right-element">.com</span>} />);
    expect(screen.getByTestId("left-element")).toBeInTheDocument();
    expect(screen.getByTestId("right-element")).toBeInTheDocument();
  });

  it("라벨, 설명, 도움말을 모두 표시한다", () => {
    render(<InputField label="이메일" description="회사 이메일 주소를 입력하세요" helperText="example@company.com 형식으로 입력" />);

    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("회사 이메일 주소를 입력하세요")).toBeInTheDocument();
    expect(screen.getByText("example@company.com 형식으로 입력")).toBeInTheDocument();
  });

  it("오류 상태일 때 오류 메시지만 표시한다", () => {
    render(<InputField status="error" errorText="잘못된 이메일 형식입니다" helperText="도움말 텍스트" successText="성공 메시지" />);

    expect(screen.getByText("잘못된 이메일 형식입니다")).toBeInTheDocument();
    expect(screen.getByText("도움말 텍스트")).toBeInTheDocument();
    expect(screen.queryByText("성공 메시지")).not.toBeInTheDocument();
  });

  it("성공 상태일 때 성공 메시지를 표시한다", () => {
    render(<InputField status="success" successText="올바른 이메일 형식입니다" helperText="도움말 텍스트" errorText="오류 메시지" />);

    expect(screen.getByText("올바른 이메일 형식입니다")).toBeInTheDocument();
    expect(screen.getByText("도움말 텍스트")).toBeInTheDocument();
    expect(screen.queryByText("오류 메시지")).not.toBeInTheDocument();
  });
});
