import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "./index";

describe("LoadingSpinner", () => {
  it("기본 로딩 스피너가 렌더링된다", () => {
    render(<LoadingSpinner data-testid="loading" />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("접근성 속성이 올바르게 설정된다 (role=status, aria-live=polite)", () => {
    render(<LoadingSpinner data-testid="loading" />);
    const wrapper = screen.getByTestId("loading");
    expect(wrapper).toHaveAttribute("role", "status");
    expect(wrapper).toHaveAttribute("aria-live", "polite");
  });

  it("기본 라벨(스크린 리더용)이 렌더링된다", () => {
    render(<LoadingSpinner />);
    expect(screen.getByText("로딩 중…")).toBeInTheDocument();
  });

  it("커스텀 라벨을 표시한다", () => {
    render(<LoadingSpinner label="데이터를 불러오는 중..." />);
    expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
  });

  it("프리셋 size(sm/md/lg)를 지원한다 (DOM 존재 확인)", () => {
    const { rerender, container } = render(<LoadingSpinner size="sm" />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("숫자 size를 주면 width/height 인라인 스타일이 반영된다", () => {
    const { container } = render(<LoadingSpinner size={32} />);
    const spinner = container.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(spinner).toHaveStyle({ width: "32px", height: "32px" });
  });

  it("숫자 thickness를 주면 CSS 변수(--spinner-bw)가 설정된다", () => {
    const { container } = render(<LoadingSpinner thickness={6} />);
    const spinner = container.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(spinner.getAttribute("style") || "").toMatch(/--spinner-bw:\s*6px/);
  });

  it("color prop이 currentColor로 적용된다", () => {
    const { container } = render(<LoadingSpinner color="rgb(10, 20, 30)" />);
    const spinner = container.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(spinner).toHaveStyle({ color: "rgb(10, 20, 30)" });
  });

  it("커스텀 className은 내부 spinner(span)에 적용된다", () => {
    const { container } = render(<LoadingSpinner className="custom-spinner" />);
    const spinner = container.querySelector('span[aria-hidden="true"]') as HTMLElement;
    expect(spinner).toHaveClass("custom-spinner");
  });

  it("wrapper에 전달한 임의 속성(data-testid 등)은 그대로 전달된다", () => {
    render(<LoadingSpinner data-testid="spinner-wrapper" />);
    expect(screen.getByTestId("spinner-wrapper")).toBeInTheDocument();
  });
});
