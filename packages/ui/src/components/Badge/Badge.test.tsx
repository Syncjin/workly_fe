import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./index";

describe("Badge 컴포넌트", () => {
  it("텍스트와 함께 배지가 렌더링된다", () => {
    render(<Badge>새로운</Badge>);
    expect(screen.getByText("새로운")).toBeInTheDocument();
  });

  it("다양한 크기를 지원한다", () => {
    const { rerender } = render(<Badge size="sm">작은</Badge>);
    expect(screen.getByText("작은")).toBeInTheDocument();

    rerender(<Badge size="md">중간</Badge>);
    expect(screen.getByText("중간")).toBeInTheDocument();

    rerender(<Badge size="lg">큰</Badge>);
    expect(screen.getByText("큰")).toBeInTheDocument();
  });

  it("다양한 색상을 지원한다", () => {
    const { rerender } = render(<Badge color="brand-600">브랜드</Badge>);
    expect(screen.getByText("브랜드")).toBeInTheDocument();

    rerender(<Badge color="success-500">성공</Badge>);
    expect(screen.getByText("성공")).toBeInTheDocument();

    rerender(<Badge color="warning-500">경고</Badge>);
    expect(screen.getByText("경고")).toBeInTheDocument();

    rerender(<Badge color="error-500">오류</Badge>);
    expect(screen.getByText("오류")).toBeInTheDocument();
  });

  it("아이콘 위치를 지원한다", () => {
    const icon = <span data-testid="badge-icon">🔥</span>;
    const { rerender } = render(
      <Badge icon={icon} iconPosition="left">
        왼쪽
      </Badge>
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText("왼쪽")).toBeInTheDocument();

    rerender(
      <Badge icon={icon} iconPosition="right">
        오른쪽
      </Badge>
    );
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText("오른쪽")).toBeInTheDocument();
  });

  it("커스텀 클래스명을 적용한다", () => {
    render(<Badge className="custom-badge">커스텀</Badge>);
    expect(screen.getByText("커스텀")).toHaveClass("custom-badge");
  });

  it("아이콘과 함께 렌더링된다", () => {
    const icon = <span data-testid="badge-icon">🔥</span>;
    render(<Badge icon={icon}>핫</Badge>);
    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText("핫")).toBeInTheDocument();
  });

  it("인라인 스타일을 지원한다", () => {
    render(<Badge style={{ margin: "10px" }}>스타일</Badge>);
    expect(screen.getByText("스타일")).toHaveStyle({ margin: "10px" });
  });

  it("HTML 속성을 지원한다", () => {
    render(
      <Badge data-testid="custom-badge" title="배지 제목">
        속성
      </Badge>
    );
    const badge = screen.getByTestId("custom-badge");
    expect(badge).toHaveAttribute("title", "배지 제목");
  });
});
