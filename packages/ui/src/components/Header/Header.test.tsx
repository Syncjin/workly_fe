import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Header } from "./index";

// CSS 모듈 모킹
vi.mock("./Header.css", () => ({
  header: "mock-header",
  leftSection: "mock-left-section",
  centerSection: "mock-center-section",
  rightSection: "mock-right-section",
  menuButton: "mock-menu-button",
  logo: "mock-logo",
  iconButton: "mock-icon-button",
  badge: "mock-badge",
  avatar: "mock-avatar",
}));

describe("Header 컴포넌트", () => {
  it("섹션들과 함께 Header가 렌더링된다", () => {
    render(
      <Header>
        <Header.Left>
          <div>왼쪽 콘텐츠</div>
        </Header.Left>
        <Header.Center>
          <div>중앙 콘텐츠</div>
        </Header.Center>
        <Header.Right>
          <div>오른쪽 콘텐츠</div>
        </Header.Right>
      </Header>
    );

    expect(screen.getByText("왼쪽 콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("중앙 콘텐츠")).toBeInTheDocument();
    expect(screen.getByText("오른쪽 콘텐츠")).toBeInTheDocument();
  });

  it("unstyled 속성을 올바르게 적용한다", () => {
    const { container } = render(
      <Header unstyled className="custom-header">
        <Header.Left className="custom-left">왼쪽</Header.Left>
      </Header>
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("custom-header");
    expect(header).not.toHaveClass("mock-header"); // 기본 스타일이 없어야 함
  });

  it("커스텀 as 속성을 지원한다", () => {
    render(
      <Header as="div" data-testid="custom-header">
        <Header.Left>왼쪽</Header.Left>
      </Header>
    );

    expect(screen.getByTestId("custom-header").tagName).toBe("DIV");
  });

  it("Header 컨텍스트 외부에서 사용 시 에러를 발생시킨다", () => {
    // 테스트를 위해 console.error 억제
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<Header.Left>왼쪽</Header.Left>);
    }).toThrow("Header 하위 컴포넌트는 Header 내부에서만 사용할 수 있습니다.");

    consoleSpy.mockRestore();
  });

  it("MenuButton 컴포넌트를 렌더링한다", () => {
    const handleClick = vi.fn();
    render(
      <Header>
        <Header.Left>
          <Header.MenuButton onClick={handleClick}>메뉴</Header.MenuButton>
        </Header.Left>
      </Header>
    );

    const menuButton = screen.getByRole("button", { name: "메뉴" });
    expect(menuButton).toBeInTheDocument();
  });
});
