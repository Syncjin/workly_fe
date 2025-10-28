import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Icon from "./index";

// SVG 파일 모킹
vi.mock("@workly/icons/svgs/add-line.svg", () => ({
  default: (props: any) => <svg {...props} data-testid="mocked-svg" />,
}));

vi.mock("@workly/icons/svgs/check-line.svg", () => ({
  default: (props: any) => <svg {...props} data-testid="mocked-svg" />,
}));

describe("Icon 컴포넌트", () => {
  it("기본 아이콘이 렌더링된다", () => {
    render(<Icon name="add-line" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("다양한 크기를 지원한다", () => {
    render(<Icon name="add-line" size={{ width: 24, height: 24 }} data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
  });

  it("색상을 지원한다", () => {
    render(<Icon name="add-line" color="red" data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("fill", "red");
  });

  it("커스텀 클래스명을 적용한다", () => {
    render(<Icon name="add-line" className="custom-icon" data-testid="icon" />);
    expect(screen.getByTestId("icon")).toHaveClass("custom-icon");
  });

  it("접근성 속성을 지원한다", () => {
    render(<Icon name="add-line" aria-label="추가 아이콘" data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("aria-label", "추가 아이콘");
  });

  it("aria-hidden 속성을 지원한다", () => {
    render(<Icon name="add-line" aria-hidden="true" data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("인라인 스타일로 회전을 지원한다", () => {
    render(<Icon name="add-line" style={{ transform: "rotate(90deg)" }} data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveStyle({ transform: "rotate(90deg)" });
  });

  it("인라인 스타일로 수평 뒤집기를 지원한다", () => {
    render(<Icon name="add-line" style={{ transform: "scaleX(-1)" }} data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveStyle({ transform: "scaleX(-1)" });
  });

  it("인라인 스타일로 수직 뒤집기를 지원한다", () => {
    render(<Icon name="add-line" style={{ transform: "scaleY(-1)" }} data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveStyle({ transform: "scaleY(-1)" });
  });

  it("복합 변환을 지원한다", () => {
    render(<Icon name="add-line" style={{ transform: "rotate(45deg) scale(1.2)" }} data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveStyle({ transform: "rotate(45deg) scale(1.2)" });
  });

  it("로딩 중에는 기본 SVG를 표시한다", () => {
    render(<Icon name="add-line" data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("색상 변수를 지원한다", () => {
    render(<Icon name="add-line" color="gray-500" data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("fill", "var(--color-gray-500)");
  });

  it("인라인 스타일을 지원한다", () => {
    render(<Icon name="add-line" style={{ margin: "10px" }} data-testid="icon" />);
    const icon = screen.getByTestId("icon");
    expect(icon).toHaveStyle({ margin: "10px" });
  });
});
