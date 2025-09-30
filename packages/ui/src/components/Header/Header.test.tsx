import { render } from "@testing-library/react";
import { Header } from "./index";

// Mock the CSS module
jest.mock("./Header.css", () => ({
  header: "mock-header-class",
  leftSection: "mock-left-section",
  rightSection: "mock-right-section",
  logo: "mock-logo",
  iconButton: "mock-icon-button",
}));

// Mock the Icon component
jest.mock("@/shared/ui/Icon", () => {
  return function MockIcon({ name }: { name: string }) {
    return <span data-testid={`icon-${name}`}>{name}</span>;
  };
});

// Mock the Avatar component
jest.mock("../Avatar", () => {
  return function MockAvatar({ src, alt, size }: { src?: string; alt?: string; size: string }) {
    return (
      <div data-testid="avatar" data-src={src} data-alt={alt} data-size={size}>
        Avatar
      </div>
    );
  };
});

describe("Header Component", () => {
  it("should render with default styles when no className is provided", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");

    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("mock-header-class"); // Should contain the default style
  });

  it("should apply custom className alongside default styles", () => {
    const customClass = "custom-header-class";
    const { container } = render(<Header className={customClass} />);
    const header = container.querySelector("header");

    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("mock-header-class"); // Should contain the default style
    expect(header?.className).toContain(customClass); // Should contain the custom class
  });

  it("should handle empty className gracefully", () => {
    const { container } = render(<Header className="" />);
    const header = container.querySelector("header");

    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("mock-header-class"); // Should contain the default style
    expect(header?.className).not.toContain("  "); // Should not have double spaces
  });

  it("should handle undefined className gracefully", () => {
    const { container } = render(<Header className={undefined} />);
    const header = container.querySelector("header");

    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("mock-header-class"); // Should contain the default style
  });

  it("should preserve all existing functionality with className prop", () => {
    const mockHandlers = {
      onLogoClick: jest.fn(),
      onMenuClick: jest.fn(),
      onSettingsClick: jest.fn(),
      onNotificationsClick: jest.fn(),
      onAvatarClick: jest.fn(),
    };

    const { container } = render(<Header className="test-class" avatarUrl="test-avatar.jpg" {...mockHandlers} />);

    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain("mock-header-class");
    expect(header?.className).toContain("test-class");

    // Verify all elements are still rendered
    expect(container.querySelector('[data-testid="icon-menu-line"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon-logo-horizontal"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon-checkbox-line"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon-settings-2-line"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="avatar"]')).toBeInTheDocument();
  });
});
