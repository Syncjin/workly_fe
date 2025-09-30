// features/board-manage/ui/__tests__/AdminBoardLink.test.tsx
import { useBoardManagePermission } from "@/features/board/board-manage/model/useBoardManagePermission";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

// 1) 권한 훅 목킹
vi.mock("@/features/board/board-manage/model/useBoardManagePermission", () => ({
  useBoardManagePermission: vi.fn(),
}));

// 2) next/link를 <a>로 목킹 (onClick/props 전달)
vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, ...props }: any) => React.createElement("a", { href: typeof href === "string" ? href : "#", ...props }),
  };
});

import { AdminBoardLink } from "@/features/board/board-manage/ui/AdminBoardLink";

describe("AdminBoardLink", () => {
  const mockHook = useBoardManagePermission as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("기본 렌더링: /admin/board 링크와 기본 라벨 '관리'", () => {
    mockHook.mockReturnValue({ isPermitted: true, isLoading: false, isError: false });

    render(<AdminBoardLink />);
    const link = screen.getByRole("link", { name: "관리" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/board");
    expect(link).not.toHaveAttribute("aria-disabled");
  });

  it("className 덧씌우기 적용", () => {
    mockHook.mockReturnValue({ isPermitted: true, isLoading: false, isError: false });

    render(<AdminBoardLink className="my-extra-class">관리</AdminBoardLink>);
    const link = screen.getByRole("link", { name: "관리" });

    expect(link).toHaveClass("my-extra-class");
  });

  it("권한이 없으면 클릭 시 preventDefault, aria-disabled=true", () => {
    mockHook.mockReturnValue({ isPermitted: false, isLoading: false, isError: false });

    render(<AdminBoardLink>관리</AdminBoardLink>);
    const link = screen.getByRole("link", { name: "관리" });

    // cancelable 이벤트를 만들어 dispatch → defaultPrevented로 검증
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    const preventedBefore = ev.defaultPrevented;
    link.dispatchEvent(ev);
    const preventedAfter = ev.defaultPrevented;

    expect(preventedBefore).toBe(false);
    expect(preventedAfter).toBe(true);
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("로딩 중이면 클릭 막음", () => {
    mockHook.mockReturnValue({ isPermitted: true, isLoading: true, isError: false });

    render(<AdminBoardLink>관리</AdminBoardLink>);
    const link = screen.getByRole("link", { name: "관리" });

    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("에러이면 클릭 막음", () => {
    mockHook.mockReturnValue({ isPermitted: true, isLoading: false, isError: true });

    render(<AdminBoardLink>관리</AdminBoardLink>);
    const link = screen.getByRole("link", { name: "관리" });

    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("권한이 있으면 preventDefault 호출되지 않음", () => {
    mockHook.mockReturnValue({ isPermitted: true, isLoading: false, isError: false });

    render(<AdminBoardLink>관리</AdminBoardLink>);
    const link = screen.getByRole("link", { name: "관리" });

    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(link).not.toHaveAttribute("aria-disabled");
  });

  it("children 커스텀 라벨 표시", () => {
    mockHook.mockReturnValue({ isPermitted: true, isLoading: false, isError: false });

    render(<AdminBoardLink>보드 관리</AdminBoardLink>);
    expect(screen.getByRole("link", { name: "보드 관리" })).toBeInTheDocument();
  });
});
