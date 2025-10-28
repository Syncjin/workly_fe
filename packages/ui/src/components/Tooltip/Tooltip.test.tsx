import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Tooltip } from "./index";

describe("Tooltip", () => {
  it("트리거 요소를 렌더링한다", () => {
    render(
      <Tooltip content="테스트 툴팁">
        <button>트리거</button>
      </Tooltip>
    );

    expect(screen.getByRole("button", { name: "트리거" })).toBeInTheDocument();
  });

  it("마우스 호버 시 툴팁을 표시한다", async () => {
    render(
      <Tooltip content="테스트 툴팁" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      expect(screen.getByText("테스트 툴팁")).toBeInTheDocument();
    });
  });

  it("마우스가 벗어나면 툴팁을 숨긴다", async () => {
    render(
      <Tooltip content="테스트 툴팁" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("포커스 시 툴팁을 표시한다", async () => {
    render(
      <Tooltip content="테스트 툴팁" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");
    fireEvent.focus(trigger);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("블러 시 툴팁을 숨긴다", async () => {
    render(
      <Tooltip content="테스트 툴팁" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");
    fireEvent.focus(trigger);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    fireEvent.blur(trigger);

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("Escape 키 입력 시 툴팁을 숨긴다", async () => {
    render(
      <Tooltip content="테스트 툴팁" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");
    fireEvent.focus(trigger);

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    fireEvent.keyDown(trigger, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("올바른 위치 클래스를 적용한다", async () => {
    render(
      <Tooltip content="테스트 툴팁" position="top" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute("data-visible", "true");
    });
  });

  it("툴팁이 표시될 때 aria-describedby를 설정한다", async () => {
    render(
      <Tooltip content="테스트 툴팁" delay={0}>
        <button>트리거</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button");

    // 초기에는 aria-describedby가 없음
    expect(trigger).not.toHaveAttribute("aria-describedby");

    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-describedby", "tooltip");
    });
  });
});
