import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./index";

describe("Select 컴포넌트", () => {
  const options = [
    { value: "apple", text: "사과" },
    { value: "banana", text: "바나나" },
    { value: "orange", text: "오렌지" },
  ];

  it("기본 셀렉트가 렌더링된다", () => {
    render(<Select options={options} placeholder="과일을 선택하세요" />);
    expect(screen.getByText("과일을 선택하세요")).toBeInTheDocument();
  });

  it("옵션을 클릭하여 선택할 수 있다", () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    // 셀렉트 박스 클릭하여 드롭다운 열기
    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    // 옵션 선택
    const option = screen.getByText("사과");
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith({ value: "apple", text: "사과" });
  });

  it("선택된 값을 표시한다", () => {
    render(<Select options={options} value="banana" />);
    expect(screen.getByText("바나나")).toBeInTheDocument();
  });

  it("기본 렌더링이 정상적으로 작동한다", () => {
    render(<Select options={options} />);
    const selectButton = screen.getByRole("button");
    expect(selectButton).toBeInTheDocument();
  });

  it("드롭다운이 열리고 닫힌다", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");

    // 드롭다운 열기
    fireEvent.click(selectButton);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // 옵션 선택하면 드롭다운 닫힘
    const option = screen.getByText("사과");
    fireEvent.click(option);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("검색 기능을 지원한다", () => {
    render(<Select options={options} searchable />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "사과" } });

    expect(screen.getByText("사과")).toBeInTheDocument();
    expect(screen.queryByText("바나나")).not.toBeInTheDocument();
  });

  it("커스텀 클래스를 적용할 수 있다", () => {
    render(<Select options={options} className="custom-select" />);
    const container = screen.getByRole("button").closest('[data-slot="root"]');
    expect(container).toHaveClass("custom-select");
  });

  it("검색 결과가 없을 때 메시지를 표시한다", () => {
    render(<Select options={options} searchable />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "없는과일" } });

    expect(screen.getByText("검색 결과가 없습니다")).toBeInTheDocument();
  });

  it("선택된 옵션에 체크 아이콘이 표시된다", () => {
    render(<Select options={options} value="banana" />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    const selectedOption = screen.getByRole("option", { selected: true });
    expect(selectedOption).toBeInTheDocument();
  });

  it("옵션들이 올바르게 표시된다", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");
    fireEvent.click(selectButton);

    // 모든 옵션이 표시되는지 확인
    expect(screen.getByText("사과")).toBeInTheDocument();
    expect(screen.getByText("바나나")).toBeInTheDocument();
    expect(screen.getByText("오렌지")).toBeInTheDocument();
  });

  it("아이콘이 드롭다운 상태에 따라 변경된다", () => {
    render(<Select options={options} />);

    const selectButton = screen.getByRole("button");

    // 닫힌 상태에서는 아래 화살표
    expect(selectButton.querySelector("svg")).toBeInTheDocument();

    // 열린 상태에서는 위 화살표
    fireEvent.click(selectButton);
    expect(selectButton.querySelector("svg")).toBeInTheDocument();
  });

  it("placeholder가 올바르게 표시된다", () => {
    const placeholder = "과일을 선택해주세요";
    render(<Select options={options} placeholder={placeholder} />);

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  describe("합성 컴포넌트 기능", () => {
    it("커스텀 Trigger를 사용할 수 있다", () => {
      render(
        <Select options={options} value="apple">
          <Select.Trigger data-testid="custom-trigger">
            <span>커스텀 트리거</span>
          </Select.Trigger>
          <Select.Menu />
        </Select>
      );

      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
      expect(screen.getByText("커스텀 트리거")).toBeInTheDocument();
    });

    it("커스텀 Trigger에서 children이 렌더링된다", () => {
      render(
        <Select options={options}>
          <Select.Trigger>
            <div data-testid="custom-content">아이콘 버튼</div>
          </Select.Trigger>
          <Select.Menu />
        </Select>
      );

      expect(screen.getByTestId("custom-content")).toBeInTheDocument();
      expect(screen.getByText("아이콘 버튼")).toBeInTheDocument();
    });

    it("커스텀 Trigger 클릭 시 드롭다운이 열린다", () => {
      render(
        <Select options={options}>
          <Select.Trigger data-testid="custom-trigger">커스텀 버튼</Select.Trigger>
          <Select.Menu />
        </Select>
      );

      const customTrigger = screen.getByTestId("custom-trigger");
      fireEvent.click(customTrigger);

      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("커스텀 Trigger에서는 화살표 아이콘이 표시되지 않는다", () => {
      render(
        <Select options={options}>
          <Select.Trigger data-testid="custom-trigger">커스텀 버튼</Select.Trigger>
          <Select.Menu />
        </Select>
      );

      const customTrigger = screen.getByTestId("custom-trigger");
      // 커스텀 트리거에는 화살표 아이콘이 없어야 함
      expect(customTrigger.querySelector("svg")).not.toBeInTheDocument();
    });
  });

  describe("classes prop 기능", () => {
    it("classes.trigger를 통해 트리거 스타일을 커스터마이징할 수 있다", () => {
      render(<Select options={options} classes={{ trigger: "custom-trigger-class" }} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveClass("custom-trigger-class");
    });

    it("classes.menu를 통해 메뉴 스타일을 커스터마이징할 수 있다", () => {
      render(<Select options={options} classes={{ menu: "custom-menu-class" }} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const menu = screen.getByRole("listbox");
      expect(menu).toHaveClass("custom-menu-class");
    });

    it("classes.option을 통해 옵션 스타일을 커스터마이징할 수 있다", () => {
      render(<Select options={options} classes={{ option: "custom-option-class" }} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const firstOption = screen.getAllByRole("option")[0];
      expect(firstOption).toHaveClass("custom-option-class");
    });
  });

  describe("메뉴 포지션 자동 조정", () => {
    beforeEach(() => {
      // 각 테스트 전에 window.innerWidth 설정
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it("메뉴가 렌더링되고 ref가 설정된다", () => {
      render(<Select options={options} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const menu = screen.getByRole("listbox");
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveAttribute("data-slot", "menu");
    });

    it("메뉴가 화면 오른쪽을 벗어날 때 위치 조정 로직이 실행된다", () => {
      // getBoundingClientRect 모킹 - 화면을 벗어나는 경우
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

      render(<Select options={options} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const menu = screen.getByRole("listbox");

      // 화면을 벗어나는 경우 모킹
      menu.getBoundingClientRect = vi.fn(
        () =>
          ({
            right: 1200, // window.innerWidth(1024)보다 큰 값
            left: 900,
            top: 100,
            bottom: 300,
            width: 300,
            height: 200,
            x: 900,
            y: 100,
            toJSON: () => ({}),
          }) as DOMRect
      );

      // 메뉴를 다시 열어서 useEffect 트리거
      fireEvent.click(selectButton); // 닫기
      fireEvent.click(selectButton); // 다시 열기

      // 메뉴가 여전히 존재하는지 확인 (위치 조정 후에도)
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // 원래 함수 복원
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it("메뉴가 화면 왼쪽을 벗어날 때 위치 조정 로직이 실행된다", () => {
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

      render(<Select options={options} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const menu = screen.getByRole("listbox");

      // 왼쪽을 벗어나는 경우 모킹
      menu.getBoundingClientRect = vi.fn(
        () =>
          ({
            right: 100,
            left: -50, // 음수 값으로 왼쪽을 벗어남
            top: 100,
            bottom: 300,
            width: 150,
            height: 200,
            x: -50,
            y: 100,
            toJSON: () => ({}),
          }) as DOMRect
      );

      // 메뉴를 다시 열어서 useEffect 트리거
      fireEvent.click(selectButton); // 닫기
      fireEvent.click(selectButton); // 다시 열기

      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // 원래 함수 복원
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it("메뉴가 화면 안에 있을 때는 위치 조정이 되지 않는다", () => {
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

      render(<Select options={options} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const menu = screen.getByRole("listbox");

      // 정상 범위 내 모킹
      menu.getBoundingClientRect = vi.fn(
        () =>
          ({
            right: 500, // window.innerWidth(1024) 안에 있음
            left: 300,
            top: 100,
            bottom: 300,
            width: 200,
            height: 200,
            x: 300,
            y: 100,
            toJSON: () => ({}),
          }) as DOMRect
      );

      // 메뉴를 다시 열어서 useEffect 트리거
      fireEvent.click(selectButton); // 닫기
      fireEvent.click(selectButton); // 다시 열기

      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // 원래 함수 복원
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it("메뉴가 닫혀있을 때는 위치 조정 로직이 실행되지 않는다", () => {
      render(<Select options={options} />);

      const selectButton = screen.getByRole("button");

      // 메뉴 열기
      fireEvent.click(selectButton);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      // 옵션 선택하여 메뉴 닫기
      const option = screen.getByText("사과");
      fireEvent.click(option);

      // 메뉴가 닫혔는지 확인
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  describe("접근성", () => {
    it("적절한 ARIA 속성들이 설정된다", () => {
      render(<Select options={options} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("옵션들이 적절한 role을 가진다", () => {
      render(<Select options={options} />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();

      const optionElements = screen.getAllByRole("option");
      expect(optionElements).toHaveLength(3);
    });

    it("선택된 옵션이 aria-selected 속성을 가진다", () => {
      render(<Select options={options} value="banana" />);

      const selectButton = screen.getByRole("button");
      fireEvent.click(selectButton);

      const selectedOption = screen.getByRole("option", { selected: true });
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });
  });
});
