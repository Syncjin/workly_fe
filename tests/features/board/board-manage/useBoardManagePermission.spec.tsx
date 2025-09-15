import { useBoardManagePermission } from "@/features/board/board-manage/model/useBoardManagePermission";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("@/entities/users/api/usersQueries", () => ({
  useMyInfo: vi.fn(),
}));

import { useMyInfo } from "@/entities/users/api/usersQueries";
const mockUseMyInfo = useMyInfo as unknown as Mock;

describe("useBoardManagePermission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ROLE_ADMIN 이 있으면 isPermitted = true", () => {
    mockUseMyInfo.mockReturnValue({
      data: { data: { role: "ROLE_ADMIN" } },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useBoardManagePermission());
    expect(result.current.isPermitted).toBe(true);
  });

  it("ROLE_ADMIN 이 없으면 isPermitted = false", () => {
    mockUseMyInfo.mockReturnValue({
      data: { data: { role: "ROLE_USER" } },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useBoardManagePermission());
    expect(result.current.isPermitted).toBe(false);
  });

  it("데이터가 없으면(is null/undefined) isPermitted = false", () => {
    mockUseMyInfo.mockReturnValue({
      data: null, // 또는 { data: undefined }
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useBoardManagePermission());
    expect(result.current.isPermitted).toBe(false);
  });

  it("로딩/에러 상태 전달 확인", () => {
    mockUseMyInfo.mockReturnValue({
      data: { data: { role: "ROLE_ADMIN" } },
      isLoading: true,
      isError: false,
    });
    const { result, rerender } = renderHook(() => useBoardManagePermission());
    expect(result.current.isLoading).toBe(true);

    mockUseMyInfo.mockReturnValue({
      data: { data: { role: "ROLE_ADMIN" } },
      isLoading: false,
      isError: true,
    });
    act(() => rerender());
    expect(result.current.isError).toBe(true);
  });

  it("역할 변경 시 메모가 갱신된다 (rerender 시)", () => {
    mockUseMyInfo
      .mockReturnValueOnce({
        data: { data: { role: "ROLE_USER" } },
        isLoading: false,
        isError: false,
      })
      .mockReturnValue({
        data: { data: { role: "ROLE_ADMIN" } },
        isLoading: false,
        isError: false,
      });

    const { result, rerender } = renderHook(() => useBoardManagePermission());
    expect(result.current.isPermitted).toBe(false);

    act(() => rerender());
    expect(result.current.isPermitted).toBe(true);
  });
});
