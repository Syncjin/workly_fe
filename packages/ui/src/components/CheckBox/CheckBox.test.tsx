import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CheckBox } from "./index";

// CSS 모듈 모킹
vi.mock("./checkbox.css", () => ({
  checkboxBase: "mock-checkbox-base",
  checkboxChecked: "mock-checkbox-checked",
  checkboxContainer: "mock-checkbox-container",
  checkboxIconWrapper: "mock-checkbox-icon-wrapper",
  checkboxSize: {
    sm: "mock-checkbox-sm",
    md: "mock-checkbox-md",
    lg: "mock-checkbox-lg",
  },
}));

// Icon 컴포넌트 모킹
vi.mock("../Icon", () => ({
  default: function MockIcon({ name }: { name: string }) {
    return <span data-testid={`icon-${name}`}>{name}</span>;
  },
}));

describe("CheckBox 컴포넌트", () => {
  it("중간 상태(indeterminate)로 렌더링된다", () => {
    render(<CheckBox indeterminate={true} data-testid="checkbox" />);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const checkbox = screen.getByTestId("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("중간 상태일 때 중간 상태 아이콘을 표시한다", () => {
    render(<CheckBox indeterminate={true} />);

    // 중간 상태 아이콘이 렌더링되어야 함
    const icon = screen.getByTestId("icon-checkbox-indeterminate-line");
    expect(icon).toBeInTheDocument();
  });

  it("체크 상태이고 중간 상태가 아닐 때 체크 아이콘을 표시한다", () => {
    const handleChange = vi.fn();
    render(<CheckBox checked={true} indeterminate={false} onChange={handleChange} />);

    // 체크 아이콘이 렌더링되어야 함
    const icon = screen.getByTestId("icon-check-line");
    expect(icon).toBeInTheDocument();
  });

  it("중간 상태가 체크 상태보다 우선순위가 높다", () => {
    const handleChange = vi.fn();
    render(<CheckBox checked={true} indeterminate={true} onChange={handleChange} />);

    // 중간 상태 아이콘이 표시되고 체크 아이콘은 표시되지 않아야 함
    const indeterminateIcon = screen.queryByTestId("icon-checkbox-indeterminate-line");
    const checkIcon = screen.queryByTestId("icon-check-line");

    expect(indeterminateIcon).toBeInTheDocument();
    expect(checkIcon).not.toBeInTheDocument();
  });

  it("중간 상태일 때 체크된 스타일을 적용한다", () => {
    const { container } = render(<CheckBox indeterminate={true} />);

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("mock-checkbox-checked");
  });

  it("체크 상태일 때 체크된 스타일을 적용한다", () => {
    const handleChange = vi.fn();
    const { container } = render(<CheckBox checked={true} onChange={handleChange} />);

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("mock-checkbox-checked");
  });

  it("체크되지 않고 중간 상태도 아닐 때 체크된 스타일을 적용하지 않는다", () => {
    const handleChange = vi.fn();
    const { container } = render(<CheckBox checked={false} indeterminate={false} onChange={handleChange} />);

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).not.toHaveClass("mock-checkbox-checked");
  });
});
