import { render } from "@testing-library/react";
import { useRenderCounter, useRenderCounterWithProps } from "../useRenderCounter";

// Mock console methods
const mockConsoleGroup = jest.fn();
const mockConsoleLog = jest.fn();
const mockConsoleGroupEnd = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.console.group = mockConsoleGroup;
  global.console.log = mockConsoleLog;
  global.console.groupEnd = mockConsoleGroupEnd;
});

// Test component using useRenderCounter
const TestComponent = ({ name, enabled = true }: { name: string; enabled?: boolean }) => {
  const stats = useRenderCounter("TestComponent", enabled);
  return <div data-testid="render-count">{stats.renderCount}</div>;
};

// Test component using useRenderCounterWithProps
const TestComponentWithProps = ({ name, value, enabled = true }: { name: string; value: number; enabled?: boolean }) => {
  const stats = useRenderCounterWithProps("TestComponentWithProps", { name, value }, enabled);
  return <div data-testid="render-count">{stats.renderCount}</div>;
};

describe("useRenderCounter", () => {
  it("should track render count correctly", () => {
    const { getByTestId, rerender } = render(<TestComponent name="test" />);

    expect(getByTestId("render-count")).toHaveTextContent("1");

    rerender(<TestComponent name="test" />);
    expect(getByTestId("render-count")).toHaveTextContent("2");

    rerender(<TestComponent name="test" />);
    expect(getByTestId("render-count")).toHaveTextContent("3");
  });

  it("should log render information when enabled", () => {
    render(<TestComponent name="test" enabled={true} />);

    expect(mockConsoleGroup).toHaveBeenCalledWith(expect.stringContaining("🔄 TestComponent Render #1"), expect.any(String));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining("Time since mount:"), expect.any(String));
    expect(mockConsoleGroupEnd).toHaveBeenCalled();
  });

  it("should not log when disabled", () => {
    render(<TestComponent name="test" enabled={false} />);

    expect(mockConsoleGroup).not.toHaveBeenCalled();
    expect(mockConsoleLog).not.toHaveBeenCalled();
    expect(mockConsoleGroupEnd).not.toHaveBeenCalled();
  });

  it("should return correct render statistics", () => {
    let renderStats: any;

    const TestComponentWithStats = () => {
      renderStats = useRenderCounter("TestComponent", false);
      return <div>{renderStats.renderCount}</div>;
    };

    const { rerender } = render(<TestComponentWithStats />);

    expect(renderStats.renderCount).toBe(1);
    expect(renderStats.isFirstRender).toBe(true);
    expect(renderStats.timeSinceMount).toBeGreaterThanOrEqual(0);

    rerender(<TestComponentWithStats />);

    expect(renderStats.renderCount).toBe(2);
    expect(renderStats.isFirstRender).toBe(false);
    expect(renderStats.timeSinceLastRender).toBeGreaterThanOrEqual(0);
  });
});

describe("useRenderCounterWithProps", () => {
  it("should detect props changes", () => {
    const { rerender } = render(<TestComponentWithProps name="test" value={1} />);

    // First render - no props change detection
    expect(mockConsoleGroup).toHaveBeenCalledWith(expect.stringContaining("🔄 TestComponentWithProps Render #1"), expect.any(String));

    // Clear mocks for second render
    jest.clearAllMocks();

    // Second render with changed props
    rerender(<TestComponentWithProps name="test" value={2} />);

    // Should log both render info and props changes
    expect(mockConsoleGroup).toHaveBeenCalledWith(expect.stringContaining("🔄 TestComponentWithProps Render #2"), expect.any(String));
    expect(mockConsoleGroup).toHaveBeenCalledWith(expect.stringContaining("📝 TestComponentWithProps Props Changes"), expect.any(String));
  });

  it("should not log props changes when disabled", () => {
    const { rerender } = render(<TestComponentWithProps name="test" value={1} enabled={false} />);

    rerender(<TestComponentWithProps name="test" value={2} enabled={false} />);

    expect(mockConsoleGroup).not.toHaveBeenCalled();
  });

  it("should detect multiple prop changes", () => {
    const { rerender } = render(<TestComponentWithProps name="test" value={1} />);

    jest.clearAllMocks();

    rerender(<TestComponentWithProps name="changed" value={2} />);

    expect(mockConsoleGroup).toHaveBeenCalledWith(expect.stringContaining("📝 TestComponentWithProps Props Changes"), expect.any(String));

    // Should log both name and value changes
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("name:"),
      expect.any(String),
      expect.objectContaining({
        prev: "test",
        current: "changed",
      })
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining("value:"),
      expect.any(String),
      expect.objectContaining({
        prev: 1,
        current: 2,
      })
    );
  });
});
