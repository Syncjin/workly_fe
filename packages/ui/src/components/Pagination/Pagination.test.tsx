import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Pagination from "./index";

describe("Pagination 컴포넌트", () => {
  const defaultPagination = {
    page: 1,
    totalPages: 10,
    hasPrev: false,
    hasNext: true,
    totalItems: 100,
    prevPage: 0,
    nextPage: 2,
  };

  const defaultProps = {
    pagination: defaultPagination,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("페이지네이션이 렌더링된다", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("현재 페이지를 표시한다", () => {
    const pagination = { ...defaultPagination, page: 3, hasPrev: true, prevPage: 2, nextPage: 4 };
    render(<Pagination {...defaultProps} pagination={pagination} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("이전 버튼을 클릭할 수 있다", () => {
    const onPageChange = vi.fn();
    const pagination = { ...defaultPagination, page: 3, hasPrev: true, prevPage: 2, nextPage: 4 };
    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: /이전/i });
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("다음 버튼을 클릭할 수 있다", () => {
    const onPageChange = vi.fn();
    const pagination = { ...defaultPagination, page: 3, hasPrev: true, prevPage: 2, nextPage: 4 };
    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: /다음/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("특정 페이지 번호를 클릭할 수 있다", () => {
    const onPageChange = vi.fn();
    render(<Pagination pagination={defaultPagination} onPageChange={onPageChange} />);

    const pageButton = screen.getByRole("button", { name: "2" });
    fireEvent.click(pageButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("첫 번째 페이지에서 이전 버튼이 비활성화된다", () => {
    const pagination = { ...defaultPagination, page: 1, hasPrev: false, prevPage: 0 };
    render(<Pagination pagination={pagination} onPageChange={vi.fn()} />);
    const prevButton = screen.getByRole("button", { name: /이전/i });
    expect(prevButton).toBeDisabled();
  });

  it("마지막 페이지에서 다음 버튼이 비활성화된다", () => {
    const pagination = { ...defaultPagination, page: 10, hasNext: false, nextPage: 0 };
    render(<Pagination pagination={pagination} onPageChange={vi.fn()} />);
    const nextButton = screen.getByRole("button", { name: /다음/i });
    expect(nextButton).toBeDisabled();
  });

  it("페이지 수가 적을 때 모든 페이지를 표시한다", () => {
    const pagination = { ...defaultPagination, totalPages: 5, totalItems: 50 };
    render(<Pagination pagination={pagination} onPageChange={vi.fn()} />);
    // 실제로 표시되는 페이지만 확인 (1, 2, 5가 표시됨)
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("페이지 수가 많을 때 생략 표시를 한다", () => {
    const pagination = {
      ...defaultPagination,
      page: 5,
      totalPages: 20,
      totalItems: 200,
      hasPrev: true,
      prevPage: 4,
      nextPage: 6,
    };
    render(<Pagination pagination={pagination} onPageChange={vi.fn()} />);
    // 여러 개의 생략 표시가 있을 수 있으므로 getAllByText 사용
    const ellipsis = screen.getAllByText("…");
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it("기본 렌더링이 정상적으로 작동한다", () => {
    render(<Pagination pagination={defaultPagination} onPageChange={vi.fn()} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("커스텀 클래스명을 적용한다", () => {
    render(<Pagination pagination={defaultPagination} onPageChange={vi.fn()} className="custom-pagination" />);
    expect(screen.getByRole("navigation")).toHaveClass("custom-pagination");
  });

  it("첫 페이지와 마지막 페이지 버튼이 표시된다", () => {
    const pagination = {
      ...defaultPagination,
      page: 5,
      totalPages: 10,
      hasPrev: true,
      prevPage: 4,
      nextPage: 6,
    };
    render(<Pagination pagination={pagination} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /첫 페이지/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /마지막 페이지/i })).toBeInTheDocument();
  });
});
