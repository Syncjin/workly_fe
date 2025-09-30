import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CheckBox from "./index";

// Mock the CSS module
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

// Mock the Icon component
vi.mock("@/shared/ui/Icon", () => ({
  default: function MockIcon({ name }: { name: string }) {
    return <span data-testid={`icon-${name}`}>{name}</span>;
  },
}));

describe("CheckBox Component", () => {
  it("renders with indeterminate state", () => {
    render(<CheckBox indeterminate={true} data-testid="checkbox" />);

    const checkbox = screen.getByTestId("checkbox") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it("shows indeterminate icon when indeterminate is true", () => {
    render(<CheckBox indeterminate={true} />);

    // The indeterminate icon should be rendered
    const icon = screen.getByTestId("icon-checkbox-indeterminate-line");
    expect(icon).toBeInTheDocument();
  });

  it("shows check icon when checked is true and indeterminate is false", () => {
    render(<CheckBox checked={true} indeterminate={false} />);

    // The check icon should be rendered
    const icon = screen.getByTestId("icon-check-line");
    expect(icon).toBeInTheDocument();
  });

  it("prioritizes indeterminate over checked state for icon display", () => {
    render(<CheckBox checked={true} indeterminate={true} />);

    // Should show indeterminate icon, not check icon
    const indeterminateIcon = screen.queryByTestId("icon-checkbox-indeterminate-line");
    const checkIcon = screen.queryByTestId("icon-check-line");

    expect(indeterminateIcon).toBeInTheDocument();
    expect(checkIcon).not.toBeInTheDocument();
  });

  it("applies checked styling when indeterminate is true", () => {
    const { container } = render(<CheckBox indeterminate={true} />);

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("mock-checkbox-checked");
  });

  it("applies checked styling when checked is true", () => {
    const { container } = render(<CheckBox checked={true} />);

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toHaveClass("mock-checkbox-checked");
  });

  it("does not apply checked styling when neither checked nor indeterminate", () => {
    const { container } = render(<CheckBox checked={false} indeterminate={false} />);

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).not.toHaveClass("mock-checkbox-checked");
  });
});
