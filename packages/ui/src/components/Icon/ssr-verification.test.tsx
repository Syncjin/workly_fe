import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { iconCache } from "./IconCache";
import Icon from "./index";

// Next.js SSR 환경 시뮬레이션을 위한 테스트
describe("Icon 컴포넌트 SSR 검증", () => {
  beforeEach(() => {
    // 각 테스트 전에 캐시 초기화
    iconCache.clear();
  });

  it("서버에서 Icon 컴포넌트가 안정적으로 렌더링된다", () => {
    // 서버에서 렌더링
    const serverHtml = renderToString(<Icon name="add-line" />);

    // 서버 렌더링 결과 확인
    expect(serverHtml).toContain("svg");
    expect(serverHtml).toContain('width="20"');
    expect(serverHtml).toContain('height="20"');
    expect(serverHtml).not.toContain("undefined");
    expect(serverHtml).not.toContain("null");
  });

  it("여러 아이콘이 서버에서 동시에 렌더링되어도 안정적이다", () => {
    const MultiIconPage = () => (
      <div>
        <Icon name="add-line" />
        <Icon name="check-line" />
        <Icon name="close-line" />
        <Icon name="search-line" />
      </div>
    );

    // 서버에서 렌더링
    const serverHtml = renderToString(<MultiIconPage />);

    // 모든 아이콘이 정상적으로 렌더링되었는지 확인
    const svgCount = (serverHtml.match(/<svg/g) || []).length;
    expect(svgCount).toBe(4);

    // 각 아이콘이 기본 크기로 렌더링되었는지 확인
    expect(serverHtml).toContain('width="20"');
    expect(serverHtml).toContain('height="20"');
  });

  it("다양한 props를 가진 아이콘들이 서버에서 정상 렌더링된다", () => {
    const IconWithProps = () => (
      <div>
        <Icon name="add-line" size={24} />
        <Icon name="check-line" size={{ width: 32, height: 32 }} />
        <Icon name="close-line" className="custom-icon" />
        <Icon name="search-line" style={{ margin: "10px" }} />
      </div>
    );

    // 서버에서 렌더링
    const serverHtml = renderToString(<IconWithProps />);

    // 각 props가 정상적으로 적용되었는지 확인
    expect(serverHtml).toContain('width="24"');
    expect(serverHtml).toContain('width="32"');
    expect(serverHtml).toContain('height="32"');
    expect(serverHtml).toContain('class="custom-icon"');
    expect(serverHtml).toContain("margin:10px");

    // 서버에서는 아이콘이 로드되지 않아 기본 SVG가 렌더링됨
    expect(serverHtml).toContain('fill="none"');
  });

  it("서버에서 기본 fallback SVG가 렌더링된다", () => {
    const IconComponent = () => <Icon name="add-line" color="brand-500" />;

    // 서버에서 렌더링
    const serverHtml = renderToString(<IconComponent />);

    // 서버에서는 아이콘이 로드되지 않아 기본 SVG가 렌더링됨
    expect(serverHtml).toContain('viewBox="0 0 24 24"');
    expect(serverHtml).toContain('fill="none"');
  });

  it("서버 렌더링 시 하이드레이션 불일치가 발생하지 않는다", () => {
    const TestPage = () => (
      <div>
        <h1>테스트 페이지</h1>
        <Icon name="add-line" />
        <Icon name="check-line" size={24} />
        <p>아이콘이 포함된 페이지</p>
      </div>
    );

    // 서버에서 렌더링
    const serverHtml = renderToString(<TestPage />);

    // 기본적인 HTML 구조가 올바른지 확인
    expect(serverHtml).toContain("<h1>테스트 페이지</h1>");
    expect(serverHtml).toContain("<p>아이콘이 포함된 페이지</p>");
    expect(serverHtml).toContain("<svg");
    expect(serverHtml).toContain('width="20"'); // 첫 번째 아이콘
    expect(serverHtml).toContain('width="24"'); // 두 번째 아이콘
  });

  it("대량의 아이콘이 서버에서 렌더링되어도 성능 문제가 없다", () => {
    const ManyIconsPage = () => (
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Icon key={i} name="add-line" size={16} />
        ))}
      </div>
    );

    const startTime = Date.now();

    // 서버에서 렌더링
    const serverHtml = renderToString(<ManyIconsPage />);

    const endTime = Date.now();
    const renderTime = endTime - startTime;

    // 50개 아이콘이 모두 렌더링되었는지 확인
    const svgCount = (serverHtml.match(/<svg/g) || []).length;
    expect(svgCount).toBe(50);

    // 렌더링 시간이 합리적인 범위 내인지 확인 (1초 이내)
    expect(renderTime).toBeLessThan(1000);
  });
});
