/**
 * Tests for useDebouncedCallback hook
 */

import { act, renderHook } from "@testing-library/react";
import { useDebouncedCallback } from "../useDebouncedCallback";

// Mock timers
jest.useFakeTimers();

describe("useDebouncedCallback", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should debounce callback execution", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 300 }));

    // Call multiple times quickly
    act(() => {
      result.current("arg1");
      result.current("arg2");
      result.current("arg3");
    });

    // Should not have called callback yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have called callback only once with the last arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("arg3");
  });

  it("should support leading edge execution", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 300, leading: true }));

    act(() => {
      result.current("arg1");
    });

    // Should have called callback immediately
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("arg1");

    // Call again quickly
    act(() => {
      result.current("arg2");
    });

    // Should not call again until delay passes
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should call with trailing edge
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("arg2");
  });

  it("should support trailing edge only", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 300, leading: false, trailing: true }));

    act(() => {
      result.current("arg1");
    });

    // Should not have called callback immediately
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have called callback after delay
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("arg1");
  });

  it("should cancel pending execution", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 300 }));

    act(() => {
      result.current("arg1");
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not have called callback
    expect(callback).not.toHaveBeenCalled();
  });

  it("should flush pending execution immediately", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 300 }));

    act(() => {
      result.current("arg1");
    });

    act(() => {
      result.current.flush("flushed");
    });

    // Should have called callback immediately with flush arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("flushed");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not call again after delay
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should update callback when it changes", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, { delay: 300 }), { initialProps: { callback: callback1 } });

    act(() => {
      result.current("arg1");
    });

    // Update callback
    rerender({ callback: callback2 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have called the updated callback
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith("arg1");
  });

  it("should cleanup on unmount", () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, { delay: 300 }));

    act(() => {
      result.current("arg1");
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should not have called callback after unmount
    expect(callback).not.toHaveBeenCalled();
  });
});
