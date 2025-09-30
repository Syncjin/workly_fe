/**
 * Tests for usePostFilters hook
 */

import { act, renderHook } from "@testing-library/react";
import { usePostFilters } from "../model/usePostFilters";

describe("usePostFilters", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePostFilters());

    expect(result.current.boardId).toBeUndefined();
    expect(result.current.categoryId).toBeUndefined();
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("should initialize with provided values", () => {
    const initialFilters = { boardId: 1, categoryId: 2 };
    const { result } = renderHook(() => usePostFilters(initialFilters));

    expect(result.current.boardId).toBe(1);
    expect(result.current.categoryId).toBe(2);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("should update board filter", () => {
    const { result } = renderHook(() => usePostFilters());

    act(() => {
      result.current.setBoardId(5);
    });

    expect(result.current.boardId).toBe(5);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("should update category filter", () => {
    const { result } = renderHook(() => usePostFilters());

    act(() => {
      result.current.setCategoryId(3);
    });

    expect(result.current.categoryId).toBe(3);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("should clear all filters", () => {
    const initialFilters = { boardId: 1, categoryId: 2 };
    const { result } = renderHook(() => usePostFilters(initialFilters));

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.boardId).toBeUndefined();
    expect(result.current.categoryId).toBeUndefined();
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
