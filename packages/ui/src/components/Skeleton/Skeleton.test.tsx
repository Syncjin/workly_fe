import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as styles from "./skeleton.css";

import Skeleton from "./index";

describe("Skeleton 컴포넌트", () => {
  it("기본 스켈레톤이 렌더링된다", () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("기본 variant는 shimmer 클래스를 포함한다", () => {
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveClass(styles.container);
    expect(el).toHaveClass(styles.shimmer);
  });

  it("variant가 pulse면 pulse 클래스가 적용된다", () => {
    render(<Skeleton variant="pulse" data-testid="skeleton" />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveClass(styles.pulse);
  });

  it("variant가 none이면 shimmer/pulse 클래스가 적용되지 않는다", () => {
    render(<Skeleton variant="none" data-testid="skeleton" />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveClass(styles.container);
    if (styles.shimmer) expect(el).not.toHaveClass(styles.shimmer);
    if (styles.pulse) expect(el).not.toHaveClass(styles.pulse);
  });

  it("radius가 지정되면 해당 rounded 클래스가 적용된다", () => {
    const radiusKeys = Object.keys(styles.rounded || {});
    if (radiusKeys.length === 0) return;

    const key = radiusKeys[0] as keyof typeof styles.rounded;
    render(<Skeleton radius={key} data-testid="skeleton" />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveClass(styles.rounded[key]);
  });

  it("커스텀 className을 적용한다", () => {
    render(<Skeleton className="custom-skeleton" data-testid="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveClass("custom-skeleton");
  });

  it("style prop으로 인라인 스타일을 적용할 수 있다", () => {
    render(<Skeleton data-testid="skeleton" style={{ width: "200px", height: "100px", backgroundColor: "rgb(240, 240, 240)" }} />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveStyle({ width: "200px", height: "100px", backgroundColor: "rgb(240, 240, 240)" });
  });

  it("children을 전달하면 렌더된다", () => {
    render(
      <Skeleton data-testid="skeleton">
        <span data-testid="inner">내용</span>
      </Skeleton>
    );
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });
});
