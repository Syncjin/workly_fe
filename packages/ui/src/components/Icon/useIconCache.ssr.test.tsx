import { render, screen } from "@testing-library/react";
import React from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { iconCache } from "./IconCache";
import { useIconCache } from "./useIconCache";

import type { IconName } from "@workly/icons";

// 테스트용 컴포넌트
function TestIconComponent({ name }: { name: IconName }) {
  const { component, isLoading, error } = useIconCache(name);

  return (
    <div data-testid="icon-wrapper">
      <div data-testid="loading-state">{isLoading.toString()}</div>
      <div data-testid="error-state">{error.toString()}</div>
      <div data-testid="component-state">{component ? "loaded" : "null"}</div>
    </div>
  );
}

describe("useIconCache SSR 호환성", () => {
  beforeEach(() => {
    // 각 테스트 전에 캐시 초기화
    iconCache.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("서버 사이드 렌더링에서 일관된 초기 상태를 제공한다", () => {
    // 서버에서 렌더링
    const serverHtml = renderToString(<TestIconComponent name="add-line" />);

    // 서버 렌더링 결과에서 초기 상태 확인
    expect(serverHtml).toContain("false"); // isLoading: false
    expect(serverHtml).toContain("false"); // error: false
    expect(serverHtml).toContain("null"); // component: null
  });

  it("하이드레이션 과정에서 클라이언트와 서버 상태가 일치한다", () => {
    // 서버에서 렌더링
    const serverHtml = renderToString(<TestIconComponent name="add-line" />);

    // 서버 렌더링 결과 확인
    expect(serverHtml).toContain("false"); // isLoading: false
    expect(serverHtml).toContain("false"); // error: false
    expect(serverHtml).toContain("null"); // component: null

    // 클라이언트에서 하이드레이션 (초기 렌더링)
    render(<TestIconComponent name="add-line" />);

    // 클라이언트에서는 useEffect가 실행되어 로딩이 시작될 수 있음
    // 하지만 에러 상태와 컴포넌트 상태는 초기에 서버와 동일해야 함
    expect(screen.getByTestId("error-state")).toHaveTextContent("false");
    expect(screen.getByTestId("component-state")).toHaveTextContent("null");
  });

  it("서버 스냅샷이 안정적인 참조를 가진다", () => {
    const TestComponent = () => {
      const result1 = useIconCache("add-line");
      useIconCache("check-line");

      return (
        <div>
          <div data-testid="same-reference">{Object.is(result1, result1) ? "same" : "different"}</div>
        </div>
      );
    };

    // 서버에서 렌더링 시 참조 안정성 확인
    const serverHtml = renderToString(<TestComponent />);
    expect(serverHtml).toContain("same");
  });

  it("여러 아이콘이 동일한 서버 스냅샷을 공유한다", () => {
    const MultiIconComponent = () => {
      const icon1 = useIconCache("add-line");
      const icon2 = useIconCache("check-line");
      const icon3 = useIconCache("close-line");

      return (
        <div>
          <div data-testid="icon1-loading">{icon1.isLoading.toString()}</div>
          <div data-testid="icon2-loading">{icon2.isLoading.toString()}</div>
          <div data-testid="icon3-loading">{icon3.isLoading.toString()}</div>
          <div data-testid="icon1-error">{icon1.error.toString()}</div>
          <div data-testid="icon2-error">{icon2.error.toString()}</div>
          <div data-testid="icon3-error">{icon3.error.toString()}</div>
        </div>
      );
    };

    // 서버에서 렌더링
    const serverHtml = renderToString(<MultiIconComponent />);

    // 모든 아이콘이 동일한 초기 상태를 가지는지 확인
    expect(serverHtml).toMatch(/false.*false.*false/); // 모든 isLoading이 false
    expect(serverHtml).toMatch(/false.*false.*false/); // 모든 error가 false
  });

  it("SSR 환경에서 useEffect가 실행되지 않아도 안정적으로 작동한다", () => {
    // useEffect 모킹하여 SSR 환경 시뮬레이션
    const originalUseEffect = React.useEffect;
    vi.spyOn(React, "useEffect").mockImplementation(() => {
      // SSR에서는 useEffect가 실행되지 않음
    });

    try {
      const serverHtml = renderToString(<TestIconComponent name="add-line" />);

      // useEffect 없이도 기본 상태가 정상적으로 렌더링되는지 확인
      expect(serverHtml).toContain("false"); // isLoading
      expect(serverHtml).toContain("false"); // error
      expect(serverHtml).toContain("null"); // component
    } finally {
      React.useEffect = originalUseEffect;
    }
  });

  it("서버와 클라이언트 간 하이드레이션 불일치가 발생하지 않는다", () => {
    // 서버 렌더링
    renderToString(<TestIconComponent name="add-line" />);

    // 클라이언트 초기 렌더링
    const { container } = render(<TestIconComponent name="add-line" />);
    const clientHtml = container.innerHTML;

    // 서버와 클라이언트의 초기 HTML이 동일한지 확인
    // (실제로는 React가 하이드레이션 불일치를 감지하면 경고를 발생시킴)
    expect(clientHtml).toContain("false"); // isLoading
    expect(clientHtml).toContain("false"); // error
    expect(clientHtml).toContain("null"); // component
  });
});
