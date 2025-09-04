/**
 * 인증 유틸리티
 * 
 * 메모리에서 인증 토큰을 관리하고
 * /auth/refresh API를 통한 토큰 갱신을 처리하는 함수들을 제공합니다
 */

import { log } from "@/lib/logger";
import { parse, serialize } from "cookie";
import { ApiResponse } from "../api/types";

/** 브라우저/SSR 가드 */
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";


/** ===== 전역 AT 저장소: 브라우저에서만 HMR-safe, SSR은 요청마다 ephemeral ===== */
type TokenStore = { accessToken: string | null };

const createStore = (): TokenStore => ({ accessToken: null });

const tokenStore: TokenStore = isBrowser
    ? ((globalThis as any).__tokenStore ||= createStore())
    : createStore();

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
            log.warn("setAccessToken: 유효하지 않은 토큰", { tokenType: typeof token, tokenLength: (token as any)?.length });
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
    try {
        const existed = tokenStore.accessToken != null;
        tokenStore.accessToken = null;
        log.debug("AT 제거", { existed });
    } catch (error) {
        log.error("AT 제거 오류", { error, op: "removeAccessToken" });
        tokenStore.accessToken = null;
    }
};



/**
 * 쿠키 문자열을 파싱하여 키-값 객체로 변환합니다
 * @param cookieString - 파싱할 쿠키 문자열 (예: "key1=value1; key2=value2")
 * @returns 파싱된 쿠키 객체
 */
export const parseCookies = (cookieString: string): Record<string, string> => {
    const cookies: Record<string, string> = {};

    if (!cookieString || typeof cookieString !== 'string') {
        log.debug('parseCookies: 빈 쿠키 문자열이 제공되었습니다', { cookieStringType: typeof cookieString });
        return cookies;
    }

    try {
        let parsedCount = 0;
        cookieString.split(';').forEach(cookie => {
            const trimmedCookie = cookie.trim();
            if (trimmedCookie) {
                const [key, ...valueParts] = trimmedCookie.split('=');
                if (key && valueParts.length > 0) {
                    // 값에 '='가 포함될 수 있으므로 join으로 재결합
                    const value = valueParts.join('=').trim();
                    try {
                        cookies[key.trim()] = decodeURIComponent(value);
                        parsedCount++;
                    } catch (decodeError) {
                        log.warn('쿠키 값 디코딩 실패, 원본 값 사용', {
                            key: key.trim(),
                            value,
                            error: decodeError,
                            operation: 'parseCookies'
                        });
                        cookies[key.trim()] = value;
                        parsedCount++;
                    }
                }
            }
        });

        log.debug('쿠키 파싱 완료', {
            totalCookies: parsedCount,
            cookieStringLength: cookieString.length,
            operation: 'parseCookies'
        });
    } catch (error) {
        log.error('쿠키 파싱 중 오류 발생', {
            error,
            cookieStringLength: cookieString?.length,
            operation: 'parseCookies'
        });
        // 파싱 실패 시 빈 객체 반환
    }

    return cookies;
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


export const setCsrfToken = (
    token: string,
    {
        maxAgeSeconds = 7 * 24 * 60 * 60,
        path = "/",
        sameSite = "lax" as "lax" | "strict" | "none",
        secure = isBrowser ? window.location.protocol === "https:" : true,
    } = {}
) => {
    if (!isBrowser) return;
    document.cookie = serialize(CSRF_COOKIE, token, { maxAge: maxAgeSeconds, path, sameSite, secure });
};

/**
 * 사용자가 인증되었는지 확인합니다
 * @returns 액세스 토큰이 존재하면 true, 그렇지 않으면 false
 */
export const isAuthenticated = (): boolean => tokenStore.accessToken !== null;


/**
 * 디버깅용: 현재 토큰 상태를 반환합니다
 * @returns 토큰 상태 객체
 */
export const getTokenStatus = () => {
    return {
        hasAccessToken: !!tokenStore.accessToken,
        accessTokenLength: tokenStore.accessToken?.length || 0,
        accessTokenPreview: tokenStore.accessToken ? `${tokenStore.accessToken.substring(0, 10)}...` : null
    };
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
            credentials: "include", // ★ RT 쿠키 전송 (본문에 RT 안 보냄)
            headers: {
                "Content-Type": "application/json",
                ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
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
        console.log("AT data", data);

        if (data?.data?.accessToken) {
            setAccessToken(data.data.accessToken);
        } else {
            log.warn("응답에 accessToken 없음", { dur, op: "refresh" });
            return null;
        }

        if (data?.data.csrfToken) {
            setCsrfToken(data.data.csrfToken);
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
 * refreshToken은 쿠키에서 읽어와서 body로 전송합니다
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
 * 토큰 갱신을 시도하여 인증을 초기화합니다
 * 앱 시작 시 인증 상태를 복원하기 위해 호출되어야 합니다
 * 
 * @returns 인증이 복원되면 true, 그렇지 않으면 false를 반환하는 Promise
 */
export const initializeAuth = async (): Promise<boolean> => {
    const start = Date.now();
    log.info("인증 초기화 시작", { op: "init" });

    try {
        const token = await refreshAccessToken();
        const ok = token !== null;
        const dur = Date.now() - start;
        log.info("인증 초기화 token", { op: "init", token });
        if (ok) {
            log.info("인증 초기화 완료(AT 복구)", { dur, op: "init" });
        } else {
            log.info("인증 초기화: 비인증 상태", { dur, op: "init" });
        }
        return ok;
    } catch (error) {
        const dur = Date.now() - start;
        log.error("인증 초기화 오류", { error, dur, op: "init" });
        return false;
    }
};

/**
 * 액세스 토큰과 CSRF 토큰을 지우고 필요시 로그아웃 엔드포인트를 호출하여 사용자를 로그아웃합니다
 */
export const logout = async (): Promise<void> => {
    const start = Date.now();
    log.info("로그아웃 시작", { op: "logout" });

    removeAccessToken(); // 클라 상태 먼저 정리

    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
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
    }
};