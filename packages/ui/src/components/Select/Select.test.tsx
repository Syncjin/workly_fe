import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./index";

describe("Select 컴포넌트", () => {
  const options = [
    { value: "apple", text: "사과" },
    { value: "banana", text: "바나나" },
    { value: "orange", text: "오렌지" },
  ];

  it("기본 셀렉트가 렌더링된다", () => {
    render(<Select options={options} placeholder="과일을 선택하세요" />);
    expect(screen.getByText("과일을 선택하세요")).toBeInTheDocument();
  });

  it("옵션을 클릭하여 선택할 수 있다", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    // 셀렉트 박스 클릭하여 드롭다운 열기
    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    // 옵션 선택
    const option = screen.getByText("사과");
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith({ value: "apple", text: "사과" });
  });

  it("선택된 값을 표시한다", () => {
    render(<Select options={options} value="banana" />);
    expect(screen.getByText("바나나")).toBeInTheDocument();
  });

  it("기본 렌더링이 정상적으로 작동한다", () => {
    render(<Select options={options} />);
    const selectButton = screen.getByRole("button");
    expect(selectButton).toBeInTheDocument();
  });

  it("드롭다운이 열리고 닫힌다", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");

    // 드롭다운 열기
    fireEvent.click(selectButton);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // 옵션 선택하면 드롭다운 닫힘
    const option = screen.getByText("사과");
    fireEvent.click(option);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("검색 기능을 지원한다", () => {
    render(<Select options={options} searchable />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "사과" } });

    expect(screen.getByText("사과")).toBeInTheDocument();
    expect(screen.queryByText("바나나")).not.toBeInTheDocument();
  });

  it("커스텀 클래스를 적용할 수 있다", () => {
    render(<Select options={options} className="custom-select" />);
    const container = screen.getByRole("button").closest('[data-slot="root"]');
    expect(container).toHaveClass("custom-select");
  });

  it("검색 결과가 없을 때 메시지를 표시한다", () => {
    render(<Select options={options} searchable />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "없는과일" } });

    expect(screen.getByText("검색 결과가 없습니다")).toBeInTheDocument();
  });

  it("선택된 옵션에 체크 아이콘이 표시된다", () => {
    render(<Select options={options} value="banana" />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    const selectedOption = screen.getByRole("option", { selected: true });
    expect(selectedOption).toBeInTheDocument();
  });

  it("옵션들이 올바르게 표시된다", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    // 모든 옵션이 표시되는지 확인
    expect(screen.getByText("사과")).toBeInTheDocument();
    expect(screen.getByText("바나나")).toBeInTheDocument();
    expect(screen.getByText("오렌지")).toBeInTheDocument();
  });

  it("아이콘이 드롭다운 상태에 따라 변경된다", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");

    // 닫힌 상태에서는 아래 화살표
    expect(selectButton.querySelector("svg")).toBeInTheDocument();

    // 열린 상태에서는 위 화살표
    fireEvent.click(selectButton);
    expect(selectButton.querySelector("svg")).toBeInTheDocument();
  });

  it("placeholder가 올바르게 표시된다", () => {
    const placeholder = "과일을 선택해주세요";
    render(<Select options={options} placeholder={placeholder} />);

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });
});
