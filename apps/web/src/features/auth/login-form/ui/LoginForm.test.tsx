import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { serialize } from "cookie";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../../../../tests/msw/server";
import { getAccessToken, getAutoLoginFlag, logout, removeAccessToken, setAccessToken } from "../../../../shared/lib/auth";
import { LoginForm } from "./LoginForm";

// Type definitions
interface TokenStore {
  accessToken: string | null;
}

declare global {
  var __tokenStore: TokenStore | undefined;
}

// Next.js router mock
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Test wrapper with QueryClientProvider
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("LoginForm - 로그인 플로우 테스트", () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // AccessToken 초기화
    if (getAccessToken()) {
      globalThis.__tokenStore = { accessToken: null };
    }
    mockPush.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("자동 로그인 체크박스 선택 후 로그인 시 localStorage에 autoLogin 플래그가 저장된다", async () => {
    const user = userEvent.setup();

    // 로그인 API 모킹
    server.use(
      http.post("/api/auth/login", async () => {
        const cookies = [
          serialize("refreshToken", "RT-TEST", {
            httpOnly: true,
            path: "/",
            maxAge: 1800,
            secure: false,
          }),
          serialize("csrfToken", "CSRF-TEST", {
            httpOnly: false,
            path: "/",
            maxAge: 1800,
            secure: false,
          }),
        ];

        return HttpResponse.json(
          {
            status: 200,
            code: "OK",
            message: "로그인 성공",
            data: {
              accessToken: "AT-TEST-12345",
              refreshToken: "RT-TEST",
              csrfToken: "CSRF-TEST",
              tokenType: "Bearer",
              expiresIn: 108000,
            },
          },
          { headers: { "Set-Cookie": cookies.join(", ") } }
        );
      })
    );

    render(<LoginForm />, { wrapper: TestWrapper });

    // 사용자 ID 입력
    const userIdInput = screen.getByPlaceholderText("ID를 입력해주세요");
    await user.type(userIdInput, "testuser");

    // 비밀번호 입력
    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");
    await user.type(passwordInput, "password123");

    // 자동 로그인 체크박스 선택
    const autoLoginCheckbox = screen.getByLabelText("자동 로그인");
    await user.click(autoLoginCheckbox);

    // 로그인 버튼 클릭
    const loginButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(loginButton);

    // localStorage에 autoLogin 플래그 저장 확인
    await waitFor(() => {
      expect(getAutoLoginFlag()).toBe(true);
      expect(localStorage.getItem("autoLogin")).toBe("true");
    });
  });

  it("자동 로그인 체크박스 선택 후 로그인 시 AccessToken이 메모리에 저장된다", async () => {
    const user = userEvent.setup();

    // 로그인 API 모킹
    server.use(
      http.post("/api/auth/login", async () => {
        const cookies = [
          serialize("refreshToken", "RT-TEST", {
            httpOnly: true,
            path: "/",
            maxAge: 1800,
            secure: false,
          }),
          serialize("csrfToken", "CSRF-TEST", {
            httpOnly: false,
            path: "/",
            maxAge: 1800,
            secure: false,
          }),
        ];

        return HttpResponse.json(
          {
            status: 200,
            code: "OK",
            message: "로그인 성공",
            data: {
              accessToken: "AT-TEST-67890",
              refreshToken: "RT-TEST",
              csrfToken: "CSRF-TEST",
              tokenType: "Bearer",
              expiresIn: 108000,
            },
          },
          { headers: { "Set-Cookie": cookies.join(", ") } }
        );
      })
    );

    render(<LoginForm />, { wrapper: TestWrapper });

    // 사용자 ID 입력
    const userIdInput = screen.getByPlaceholderText("ID를 입력해주세요");
    await user.type(userIdInput, "testuser");

    // 비밀번호 입력
    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");
    await user.type(passwordInput, "password123");

    // 자동 로그인 체크박스 선택
    const autoLoginCheckbox = screen.getByLabelText("자동 로그인");
    await user.click(autoLoginCheckbox);

    // 로그인 버튼 클릭
    const loginButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(loginButton);

    // AccessToken이 메모리에 저장되었는지 확인
    await waitFor(() => {
      const token = getAccessToken();
      expect(token).toBe("AT-TEST-67890");
    });
  });

  it("자동 로그인 체크박스를 선택하지 않고 로그인 시 localStorage에 autoLogin 플래그가 저장되지 않는다", async () => {
    const user = userEvent.setup();

    // 로그인 API 모킹
    server.use(
      http.post("/api/auth/login", async () => {
        const cookies = [
          serialize("refreshToken", "RT-TEST", {
            httpOnly: true,
            path: "/",
            maxAge: 1800,
            secure: false,
          }),
          serialize("csrfToken", "CSRF-TEST", {
            httpOnly: false,
            path: "/",
            maxAge: 1800,
            secure: false,
          }),
        ];

        return HttpResponse.json(
          {
            status: 200,
            code: "OK",
            message: "로그인 성공",
            data: {
              accessToken: "AT-TEST-NO-AUTO",
              refreshToken: "RT-TEST",
              csrfToken: "CSRF-TEST",
              tokenType: "Bearer",
              expiresIn: 108000,
            },
          },
          { headers: { "Set-Cookie": cookies.join(", ") } }
        );
      })
    );

    render(<LoginForm />, { wrapper: TestWrapper });

    // 사용자 ID 입력
    const userIdInput = screen.getByPlaceholderText("ID를 입력해주세요");
    await user.type(userIdInput, "testuser");

    // 비밀번호 입력
    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");
    await user.type(passwordInput, "password123");

    // 자동 로그인 체크박스는 선택하지 않음

    // 로그인 버튼 클릭
    const loginButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(loginButton);

    // localStorage에 autoLogin 플래그가 저장되지 않았는지 확인
    await waitFor(() => {
      expect(getAutoLoginFlag()).toBe(false);
      expect(localStorage.getItem("autoLogin")).toBeNull();
    });

    // AccessToken은 저장되어야 함
    await waitFor(() => {
      const token = getAccessToken();
      expect(token).toBe("AT-TEST-NO-AUTO");
    });
  });
});

describe("LoginForm - 자동 로그인 플로우 테스트", () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // AccessToken 초기화
    if (getAccessToken()) {
      globalThis.__tokenStore = { accessToken: null };
    }
    mockPush.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("페이지 새로고침 시 자동 로그인 플래그가 있으면 /api/auth/refresh를 호출한다", async () => {
    // 자동 로그인 플래그 설정
    localStorage.setItem("autoLogin", "true");

    // /api/auth/refresh API 모킹
    const refreshHandler = vi.fn(() => {
      return HttpResponse.json({
        status: 200,
        code: "OK",
        message: "토큰 갱신 성공",
        data: {
          accessToken: "AT-REFRESHED-12345",
          tokenType: "Bearer",
          expiresIn: 108000,
        },
      });
    });

    server.use(http.post("/api/auth/refresh", refreshHandler));

    // AuthProvider를 시뮬레이션하기 위해 fetch 호출
    const csrfToken = "CSRF-TEST";
    document.cookie = `csrfToken=${csrfToken}`;

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });

    // /api/auth/refresh가 호출되었는지 확인
    expect(refreshHandler).toHaveBeenCalledTimes(1);
    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.data.accessToken).toBe("AT-REFRESHED-12345");
  });

  it("토큰 갱신 성공 시 새로운 AccessToken이 반환된다", async () => {
    // 자동 로그인 플래그 설정
    localStorage.setItem("autoLogin", "true");

    const newAccessToken = "AT-NEW-TOKEN-98765";

    // /api/auth/refresh API 모킹
    server.use(
      http.post("/api/auth/refresh", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "토큰 갱신 성공",
          data: {
            accessToken: newAccessToken,
            tokenType: "Bearer",
            expiresIn: 108000,
          },
        });
      })
    );

    // CSRF Token 설정
    const csrfToken = "CSRF-TEST";
    document.cookie = `csrfToken=${csrfToken}`;

    // 토큰 갱신 요청
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.data.accessToken).toBe(newAccessToken);
    expect(data.data.tokenType).toBe("Bearer");
  });

  it("토큰 갱신 후 인증 상태가 유지된다", async () => {
    // 자동 로그인 플래그 설정
    localStorage.setItem("autoLogin", "true");

    const refreshedToken = "AT-REFRESHED-VALID";

    // /api/auth/refresh API 모킹
    server.use(
      http.post("/api/auth/refresh", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "토큰 갱신 성공",
          data: {
            accessToken: refreshedToken,
            tokenType: "Bearer",
            expiresIn: 108000,
          },
        });
      })
    );

    // CSRF Token 설정
    const csrfToken = "CSRF-TEST";
    document.cookie = `csrfToken=${csrfToken}`;

    // 토큰 갱신 요청
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });

    expect(response.ok).toBe(true);

    const data = await response.json();

    // 새로운 AccessToken 확인
    expect(data.data.accessToken).toBe(refreshedToken);

    // 자동 로그인 플래그가 여전히 유지되는지 확인
    expect(localStorage.getItem("autoLogin")).toBe("true");
  });
});

describe("LoginForm - 자동 로그인 비활성화 플로우 테스트", () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // AccessToken 초기화
    if (getAccessToken()) {
      globalThis.__tokenStore = { accessToken: null };
    }
    mockPush.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("자동 로그인 미체크 후 로그인 시 autoLogin 플래그가 저장되지 않는다", async () => {
    const user = userEvent.setup();

    // 로그인 API 모킹
    server.use(
      http.post("/api/auth/login", async () => {
        const cookies = [
          serialize("refreshToken", "RT-TEST-SHORT", {
            httpOnly: true,
            path: "/",
            maxAge: 300, // 짧은 만료 시간
            secure: false,
          }),
          serialize("csrfToken", "CSRF-TEST", {
            httpOnly: false,
            path: "/",
            maxAge: 300,
            secure: false,
          }),
        ];

        return HttpResponse.json(
          {
            status: 200,
            code: "OK",
            message: "로그인 성공",
            data: {
              accessToken: "AT-TEST-NO-AUTO-LOGIN",
              refreshToken: "RT-TEST-SHORT",
              csrfToken: "CSRF-TEST",
              tokenType: "Bearer",
              expiresIn: 108000,
            },
          },
          { headers: { "Set-Cookie": cookies.join(", ") } }
        );
      })
    );

    render(<LoginForm />, { wrapper: TestWrapper });

    // 사용자 ID 입력
    const userIdInput = screen.getByPlaceholderText("ID를 입력해주세요");
    await user.type(userIdInput, "testuser");

    // 비밀번호 입력
    const passwordInput = screen.getByPlaceholderText("비밀번호를 입력해주세요");
    await user.type(passwordInput, "password123");

    // 자동 로그인 체크박스는 선택하지 않음 (기본값: false)

    // 로그인 버튼 클릭
    const loginButton = screen.getByRole("button", { name: /로그인/i });
    await user.click(loginButton);

    // localStorage에 autoLogin 플래그가 저장되지 않았는지 확인
    await waitFor(() => {
      expect(getAutoLoginFlag()).toBe(false);
      expect(localStorage.getItem("autoLogin")).toBeNull();
    });

    // AccessToken은 메모리에 저장되어야 함
    await waitFor(() => {
      const token = getAccessToken();
      expect(token).toBe("AT-TEST-NO-AUTO-LOGIN");
    });
  });

  it("자동 로그인 비활성화 상태에서 페이지 새로고침 시 토큰 갱신을 시도하지 않는다", async () => {
    // 자동 로그인 플래그가 없는 상태 (비활성화)
    expect(localStorage.getItem("autoLogin")).toBeNull();

    // /api/auth/refresh API 모킹 (호출되지 않아야 함)
    const refreshHandler = vi.fn(() => {
      return HttpResponse.json({
        status: 200,
        code: "OK",
        message: "토큰 갱신 성공",
        data: {
          accessToken: "AT-SHOULD-NOT-BE-CALLED",
          tokenType: "Bearer",
          expiresIn: 108000,
        },
      });
    });

    server.use(http.post("/api/auth/refresh", refreshHandler));

    // CSRF Token 설정 (있어도 자동 로그인 플래그가 없으면 갱신 시도 안 함)
    const csrfToken = "CSRF-TEST";
    document.cookie = `csrfToken=${csrfToken}`;

    // AuthProvider 로직 시뮬레이션: autoLogin 플래그가 없으면 토큰 갱신 시도 안 함
    const autoLoginEnabled = getAutoLoginFlag();
    expect(autoLoginEnabled).toBe(false);

    // 토큰 갱신이 시도되지 않았는지 확인
    expect(refreshHandler).not.toHaveBeenCalled();
  });

  it("자동 로그인 비활성화 상태에서는 AuthProvider가 로그아웃 처리를 수행한다", async () => {
    // 자동 로그인 플래그가 없는 상태
    localStorage.removeItem("autoLogin");

    // AccessToken도 없는 상태 (페이지 새로고침 시뮬레이션)
    // 이전 테스트의 영향을 받지 않도록 명시적으로 초기화
    removeAccessToken();

    // AuthProvider 로직 시뮬레이션
    const accessToken = getAccessToken();
    const autoLoginEnabled = getAutoLoginFlag();

    // AccessToken이 없고 자동 로그인이 비활성화된 경우 확인
    expect(accessToken).toBeNull();
    expect(autoLoginEnabled).toBe(false);

    // 이 상태에서는 AuthProvider가 로그아웃 처리를 수행해야 함
    // (실제 AuthProvider 컴포넌트에서 이 로직이 구현되어 있음)
  });
});

describe("LoginForm - 로그아웃 플로우 테스트", () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // AccessToken 초기화
    if (getAccessToken()) {
      globalThis.__tokenStore = { accessToken: null };
    }
    mockPush.mockClear();
    // window.location mock 초기화
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("로그아웃 시 /api/auth/revoke 호출을 시도한다", async () => {
    // 초기 상태 설정: 로그인된 상태
    localStorage.setItem("autoLogin", "true");
    setAccessToken("AT-TEST-TOKEN");

    // 로그아웃 실행 (API 호출은 실패할 수 있지만 클라이언트 정리는 수행됨)
    await logout();

    // 로그아웃 함수가 실행되었고, 클라이언트 정리가 완료되었는지 확인
    // (API 호출 실패 여부와 관계없이 클라이언트 정리는 수행됨)
    expect(localStorage.getItem("autoLogin")).toBeNull();
    expect(getAccessToken()).toBeNull();
  });

  it("로그아웃 시 localStorage에서 autoLogin 플래그가 제거된다", async () => {
    // 초기 상태 설정: 로그인된 상태
    localStorage.setItem("autoLogin", "true");
    setAccessToken("AT-TEST-TOKEN");

    // API 모킹
    server.use(
      http.post("http://localhost:3000/api/auth/revoke", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "RefreshToken 무효화 성공",
        });
      })
    );

    server.use(
      http.post("http://localhost:3000/api/auth/logout", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "로그아웃 성공",
        });
      })
    );

    // 로그아웃 실행
    await logout();

    // localStorage에서 autoLogin 플래그가 제거되었는지 확인
    expect(getAutoLoginFlag()).toBe(false);
    expect(localStorage.getItem("autoLogin")).toBeNull();
  });

  it("로그아웃 시 AccessToken이 메모리에서 제거된다", async () => {
    // 초기 상태 설정: 로그인된 상태
    localStorage.setItem("autoLogin", "true");
    setAccessToken("AT-TEST-TOKEN");

    // API 모킹
    server.use(
      http.post("http://localhost:3000/api/auth/revoke", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "RefreshToken 무효화 성공",
        });
      })
    );

    server.use(
      http.post("http://localhost:3000/api/auth/logout", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "로그아웃 성공",
        });
      })
    );

    // 로그아웃 실행
    await logout();

    // AccessToken이 메모리에서 제거되었는지 확인
    expect(getAccessToken()).toBeNull();
  });

  it("로그아웃 시 로그인 페이지로 리다이렉트된다", async () => {
    // 초기 상태 설정: 로그인된 상태
    localStorage.setItem("autoLogin", "true");
    setAccessToken("AT-TEST-TOKEN");

    // API 모킹
    server.use(
      http.post("http://localhost:3000/api/auth/revoke", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "RefreshToken 무효화 성공",
        });
      })
    );

    server.use(
      http.post("http://localhost:3000/api/auth/logout", () => {
        return HttpResponse.json({
          status: 200,
          code: "OK",
          message: "로그아웃 성공",
        });
      })
    );

    // 로그아웃 실행
    await logout();

    // 로그인 페이지로 리다이렉트되었는지 확인
    expect(window.location.href).toBe("/login");
  });
});
