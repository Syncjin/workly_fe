import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Avatar from "./index";

describe("Avatar 컴포넌트", () => {
  it("기본 아바타가 렌더링된다", () => {
    const { container } = render(<Avatar />);
    const avatar = container.firstChild;
    expect(avatar).toBeInTheDocument();
  });

  it("이미지 소스와 함께 렌더링된다", () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="사용자 아바타" />);
    const img = screen.getByRole("img", { name: "사용자 아바타" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("다양한 크기를 지원한다", () => {
    const { container, rerender } = render(<Avatar size="xs" />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Avatar size="sm" />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Avatar size="md" />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Avatar size="lg" />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Avatar size="xl" />);
    expect(container.firstChild).toBeInTheDocument();

    rerender(<Avatar size="2xl" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("커스텀 클래스명을 적용한다", () => {
    const { container } = render(<Avatar className="custom-avatar" />);
    expect(container.firstChild).toHaveClass("custom-avatar");
  });

  it("이미지가 있을 때 img 태그를 렌더링한다", () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="사용자 아바타" />);
    const img = screen.getByRole("img", { name: "사용자 아바타" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("아이콘을 표시할 수 있다", () => {
    render(<Avatar icon={<div>icon</div>} />);
    expect(screen.getByText("icon")).toBeInTheDocument();
  });

  it("dot을 표시할 수 있다", () => {
    const { container } = render(<Avatar showDot />);
    const avatar = container.firstChild;
    expect(avatar).toBeInTheDocument();
    // dot이 있는지 확인 (CSS 클래스로)
    expect(container.querySelector(".avatar_avatarDot__f3x5iv9")).toBeInTheDocument();
  });

  it("커스텀 dot 색상을 지원한다", () => {
    const { container } = render(<Avatar showDot dotColor="red" />);
    const dot = container.querySelector(".avatar_avatarDot__f3x5iv9");
    expect(dot).toHaveStyle({ background: "red" });
  });

  it("tabIndex를 지원한다", () => {
    const { container } = render(<Avatar tabIndex={0} />);
    const avatar = container.firstChild;
    expect(avatar).toHaveAttribute("tabIndex", "0");
  });

  it("인라인 스타일을 지원한다", () => {
    const { container } = render(<Avatar style={{ margin: "10px" }} />);
    const avatar = container.firstChild;
    expect(avatar).toHaveStyle({ margin: "10px" });
  });
});
