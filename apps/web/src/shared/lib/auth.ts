/**
 * 인증 유틸리티
 *
 * AccessToken을 클라이언트 메모리에서 관리하고
 * /auth/refresh API를 통한 토큰 갱신을 처리하는 함수들을 제공합니다
 *
 * 보안 전략:
 * - AccessToken: 클라이언트 메모리에 저장 (XSS 공격 시 탭 단위로만 노출)
 * - RefreshToken: HttpOnly 쿠키에 저장 (JavaScript 접근 불가)
 * - CSRF Token: 일반 쿠키에 저장 (클라이언트에서 읽어서 헤더로 전송)
 *
 * 중요:
 * - 이 파일의 함수들은 클라이언트 사이드에서만 정상 동작합니다
 * - 서버 사이드(API Routes, SSR)에서는 tokenStore가 빈 상태로 초기화됩니다
 * - 서버에서 accessToken이 필요한 경우 클라이언트가 Authorization 헤더로 전송해야 합니다
 */

import { log } from "@/lib/logger";
import { type ApiResponse } from "@workly/types/common";
import { parse } from "cookie";

/** 브라우저/SSR 가드 */
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

/**
 * 전역 AccessToken 저장소
 * - 브라우저: globalThis에 저장하여 HMR(Hot Module Replacement) 시에도 유지
 * - 서버: 요청마다 새로운 빈 store 생성 (ephemeral)
 */
type TokenStore = { accessToken: string | null };

const createStore = (): TokenStore => ({ accessToken: null });

const tokenStore: TokenStore = isBrowser ? ((globalThis as typeof globalThis & { __tokenStore?: TokenStore }).__tokenStore ||= createStore()) : createStore();

/** ===== 타입 ===== */
export interface TokenResponse {
  accessToken: string;
  csrfToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

/**
 * 메모리에서 액세스 토큰을 가져옵니다
 * @returns 액세스 토큰 문자열 또는 없으면 null
 */
export const getAccessToken = (): string | null => tokenStore.accessToken;

/**
 * 메모리에 액세스 토큰을 저장합니다
 * @param token - 저장할 액세스 토큰
 */
export const setAccessToken = (token: string): void => {
  try {
    if (!token || typeof token !== "string") {
      log.warn("setAccessToken: 유효하지 않은 토큰", { tokenType: typeof token, tokenLength: typeof token === "string" ? token.length : 0 });
      return;
    }
    tokenStore.accessToken = token;
    log.debug("AT 저장 완료", { len: token.length });
  } catch (error) {
    log.error("AT 저장 오류", { error, op: "setAccessToken" });
    throw error;
  }
};

/**
 * 메모리에서 액세스 토큰을 제거합니다
 */
export const removeAccessToken = (): void => {
  const existed = tokenStore.accessToken != null;
  tokenStore.accessToken = null;
  log.debug("AT 제거", { existed });
};

/**
 * document.cookie에서 특정 쿠키 값을 안전하게 추출합니다
 * @param cookieName - 추출할 쿠키의 이름
 * @returns 쿠키 값 또는 없으면 null
 */
export const getCookieValue = (name: string): string | null => {
  if (!isBrowser) return null;
  const cookies = parse(document.cookie || "");
  return cookies[name] || null;
};

/**
 * 쿠키에서 CSRF 토큰을 가져옵니다 (주요 CSRF 토큰 접근 방법)
 * @returns CSRF 토큰 문자열 또는 없으면 null
 */
const CSRF_COOKIE = "csrfToken";
export const getCsrfTokenFromCookie = (): string | null => getCookieValue(CSRF_COOKIE);

/**
 * 사용자가 인증되었는지 확인합니다
 * @returns 액세스 토큰이 존재하면 true, 그렇지 않으면 false
 */
export const isAuthenticated = (): boolean => tokenStore.accessToken !== null;

/**
 * localStorage에서 자동 로그인 플래그를 가져옵니다
 * @returns 자동 로그인이 활성화되어 있으면 true, 그렇지 않으면 false
 */
export const getAutoLoginFlag = (): boolean => {
  if (!isBrowser) return false;
  return localStorage.getItem("autoLogin") === "true";
};

/**
 * localStorage에 자동 로그인 플래그를 저장합니다
 * @param enabled - true면 자동 로그인 활성화, false면 비활성화
 */
export const setAutoLoginFlag = (enabled: boolean): void => {
  if (!isBrowser) return;
  if (enabled) {
    localStorage.setItem("autoLogin", "true");
  } else {
    localStorage.removeItem("autoLogin");
  }
};

/**
 * localStorage에서 자동 로그인 플래그를 제거합니다
 */
export const removeAutoLoginFlag = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem("autoLogin");
};

/** ===== 토큰 갱신: 경합 방지용 mutex + credentials 기반 ===== */
let refreshInFlight: Promise<string | null> | null = null;

const doRefresh = async (): Promise<string | null> => {
  const start = Date.now();
  log.debug("AT 갱신 시도", { op: "refresh" });

  try {
    const csrf = getCsrfTokenFromCookie();
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(csrf ? { "x-csrf-token": csrf } : {}),
      },
      // body: JSON.stringify({}) // 필요 없음
    });

    const dur = Date.now() - start;

    if (!res.ok) {
      log.warn("AT 갱신 실패", { status: res.status, dur, op: "refresh" });
      removeAccessToken();
      return null;
    }

    const data = (await res.json()) as ApiResponse<TokenResponse> & { csrfToken?: string };

    if (data?.data?.accessToken) {
      setAccessToken(data.data.accessToken);
    } else {
      log.warn("응답에 accessToken 없음", { dur, op: "refresh" });
      return null;
    }

    log.info("AT 갱신 성공", { dur, op: "refresh" });
    return data.data.accessToken;
  } catch (error) {
    const dur = Date.now() - start;
    log.error("AT 갱신 중 에러", { error, dur, op: "refresh" });
    removeAccessToken();
    return null;
  }
};

/**
 * /auth/refresh API를 사용하여 액세스 토큰을 갱신합니다
 * refreshToken은 HttpOnly 쿠키로 자동 전송됩니다 (credentials: "include")
 * 동시 요청 시 하나의 갱신 요청만 실행되도록 mutex 패턴을 사용합니다
 *
 * @returns 새로운 액세스 토큰을 반환하는 Promise, 갱신 실패 시 null
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (!isBrowser) return null;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        return await doRefresh();
      } finally {
        refreshInFlight = null; // 항상 해제
      }
    })();
  }
  return refreshInFlight;
};

/**
 * 액세스 토큰과 CSRF 토큰을 지우고 필요시 로그아웃 엔드포인트를 호출하여 사용자를 로그아웃합니다
 * 클라이언트 메모리의 accessToken을 Authorization 헤더로 전송하여 백엔드 로그아웃을 수행합니다
 *
 * 동작:
 * 1. RefreshToken 무효화 (/api/auth/revoke 호출)
 * 2. 백엔드 로그아웃 API 호출 (성공/실패 무관하게 진행)
 * 3. 클라이언트 메모리에서 accessToken 제거
 * 4. 자동 로그인 플래그 제거
 * 5. 로그인 페이지로 리다이렉트
 */
export const logout = async (): Promise<void> => {
  const start = Date.now();
  log.info("로그아웃 시작", { op: "logout" });

  try {
    try {
      const revokeRes = await fetch("/api/auth/revoke", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!revokeRes.ok) {
        log.warn("RefreshToken 무효화 실패", { status: revokeRes.status, op: "logout" });
      } else {
        log.debug("RefreshToken 무효화 완료", { status: revokeRes.status, op: "logout" });
      }
    } catch (error) {
      log.warn("RefreshToken 무효화 호출 실패", { error, op: "logout" });
    }

    const accessToken = getAccessToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // accessToken이 있으면 Authorization 헤더에 추가
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers,
    });
    const dur = Date.now() - start;
    if (!res.ok) {
      log.warn("서버 로그아웃 응답 오류", { status: res.status, dur, op: "logout" });
    } else {
      log.debug("서버 로그아웃 완료", { status: res.status, dur, op: "logout" });
    }
  } catch (error) {
    const dur = Date.now() - start;
    log.warn("서버 로그아웃 호출 실패", { error, dur, op: "logout" });
  } finally {
    // 서버 로그아웃 성공/실패 무관하게 클라이언트 정리 및 리다이렉트
    removeAccessToken();
    removeAutoLoginFlag();
    if (isBrowser) {
      window.location.href = "/login";
    }
  }
};
