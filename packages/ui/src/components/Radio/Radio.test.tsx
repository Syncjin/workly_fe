import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Radio } from "./index";
import { radioDot } from "./radio.css";

describe("Radio 컴포넌트", () => {
  it("기본 라디오 버튼이 렌더링된다", () => {
    render(<Radio name="test" value="option1" />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  it("클릭 시 onChange가 호출된다 (uncontrolled)", () => {
    const onChange = vi.fn();
    render(<Radio name="test" value="option1" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio"));
    expect(onChange).toHaveBeenCalled();
  });

  it("defaultChecked가 true면 체크되고 점(dot)이 보인다 (uncontrolled)", () => {
    const { container } = render(<Radio name="test" value="option1" defaultChecked />);
    const radio = screen.getByRole("radio");
    expect(radio).toBeChecked();
    expect(container.querySelector(`.${radioDot}`)).toBeInTheDocument();
  });

  it("checked prop으로 제어된다 (controlled)", () => {
    const onChange = vi.fn();
    const { rerender, container } = render(<Radio name="test" value="option1" checked={false} onChange={onChange} />);
    expect(screen.getByRole("radio")).not.toBeChecked();
    expect(container.querySelector(`.${radioDot}`)).not.toBeInTheDocument();

    rerender(<Radio name="test" value="option1" checked onChange={onChange} />);
    expect(screen.getByRole("radio")).toBeChecked();
    expect(container.querySelector(`.${radioDot}`)).toBeInTheDocument();
  });

  it("비활성화될 수 있다", () => {
    render(<Radio name="test" value="option1" disabled />);
    expect(screen.getByRole("radio")).toBeDisabled();
  });

  it("disabled + checked일 때 dot 색상이 비활성화 색상으로 설정된다", () => {
    const { container } = render(<Radio name="test" value="option1" checked disabled />);
    const dot = container.querySelector(`.${radioDot}`) as HTMLElement;
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ background: "var(--color-gray-200)" });
  });

  it("size에 따라 input의 width/height 스타일이 반영된다", () => {
    const { rerender } = render(<Radio name="s" value="1" size="sm" />);
    expect(screen.getByRole("radio")).toHaveStyle({ width: "16px", height: "16px" });

    rerender(<Radio name="m" value="1" size="md" />);
    expect(screen.getByRole("radio")).toHaveStyle({ width: "20px", height: "20px" });

    rerender(<Radio name="l" value="1" size="lg" />);
    expect(screen.getByRole("radio")).toHaveStyle({ width: "24px", height: "24px" });
  });

  it("커스텀 className을 input에 적용한다", () => {
    render(<Radio name="test" value="option1" className="custom-radio" />);
    expect(screen.getByRole("radio")).toHaveClass("custom-radio");
  });

  it("커스텀 style을 input에 병합 적용한다", () => {
    render(<Radio name="test" value="option1" style={{ border: "1px solid red" }} />);
    expect(screen.getByRole("radio")).toHaveStyle({ border: "1px solid red" });
  });

  it("라디오 그룹에서 하나만 선택된다 (native 동작)", () => {
    render(
      <>
        <Radio name="group" value="option1" />
        <Radio name="group" value="option2" />
        <Radio name="group" value="option3" />
      </>
    );

    const [r1, r2] = screen.getAllByRole("radio");
    fireEvent.click(r1);
    expect(r1).toBeChecked();

    fireEvent.click(r2);
    expect(r2).toBeChecked();
    expect(r1).not.toBeChecked();
  });

  it("체크되지 않은 상태에서는 dot이 보이지 않는다", () => {
    const { container } = render(<Radio name="test" value="option1" />);
    expect(container.querySelector(`.${radioDot}`)).not.toBeInTheDocument();
  });
});
