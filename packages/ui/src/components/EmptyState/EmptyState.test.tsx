import { fireEvent, render, screen } from "@testing-library/react";
import { EmptyState } from "./index";

describe("EmptyState", () => {
  it("renders with title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(<EmptyState title="No items found" description="Try adjusting your search criteria" />);
    expect(screen.getByText("Try adjusting your search criteria")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    render(<EmptyState title="No items found" icon={customIcon} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders with action button and handles click", () => {
    const mockAction = jest.fn();
    render(<EmptyState title="No items found" action={{ label: "Create New", onClick: mockAction }} />);

    const button = screen.getByText("Create New");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(<EmptyState title="No items found" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
