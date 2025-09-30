/** @jest-environment node */
import type { NextApiRequest, NextApiResponse } from "next";

const API = "http://localhost:3000";

function mockReqRes({ method = "GET", query = {}, body = undefined, headers = {}, cookies = "" }: { method?: string; query?: any; body?: any; headers?: Record<string, string>; cookies?: string }) {
  const req = {
    method,
    query,
    body,
    headers: {
      ...(headers || {}),
      ...(cookies ? { cookie: cookies } : {}),
      "content-type": "application/json",
    },
  } as unknown as NextApiRequest;

  const res: any = {
    _status: 0,
    _json: null,
    _headers: {} as Record<string, string>,
    status: jest.fn(function (this: any, code: number) {
      this._status = code;
      return this;
    }),
    json: jest.fn(function (this: any, payload: any) {
      this._json = payload;
      return this;
    }),
    setHeader: jest.fn(function (this: any, key: string, val: string) {
      this._headers[key] = val;
    }),
  };

  return { req, res: res as unknown as NextApiResponse };
}

// 매 테스트마다 fresh 모듈(내부 refreshPromise 초기화 목적)
function importProxyFresh() {
  jest.resetModules();
  process.env.NEXT_PUBLIC_API_URL = API;
  return require("../[...proxy]").default as (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
}

declare const mockFetchResponse: (args?: { status?: number; ok?: boolean; data?: any; headers?: Record<string, string> }) => Promise<any>;

describe("API Proxy (pages/api/[...proxy].ts)", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    process.env.NEXT_PUBLIC_API_URL = API;
  });

  test("specialPaths: /auth/login 은 프록시에서 404", async () => {
    const handler = importProxyFresh();

    const { req, res } = mockReqRes({
      method: "POST",
      query: { proxy: ["auth", "login"] },
      body: { id: "a", pw: "b" },
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "NOT_FOUND" }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("보호 경로: Authorization 없으면 401", async () => {
    const handler = importProxyFresh();

    const { req, res } = mockReqRes({
      method: "GET",
      query: { proxy: ["boards"] }, // '/boards' → protected
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ code: "MISSING_TOKEN" }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("정상 프록시 전달(200)", async () => {
    const handler = importProxyFresh();

    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchResponse({ status: 200, data: { ok: true } }));

    const { req, res } = mockReqRes({
      method: "POST",
      query: { proxy: ["profile"] }, // protected → 토큰 필요
      body: { foo: "bar" },
      headers: { authorization: "Bearer AT" },
      cookies: "refreshToken=RT123; csrfToken=CS123",
    });

    await handler(req, res);

    expect(global.fetch).toHaveBeenCalledWith(
      `${API}/api/v1/profile`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer AT",
          Cookie: expect.stringContaining("refreshToken=RT123"),
        }),
        body: JSON.stringify({ foo: "bar" }),
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  test("401 → refresh → 새 AT로 재시도 성공(200)", async () => {
    const handler = importProxyFresh();

    // 1) 최초 백엔드 401
    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchResponse({ status: 401, data: { message: "Unauthorized" } }));
    // 2) refresh 200
    (global.fetch as jest.Mock).mockImplementationOnce((url: string, init: any) => {
      expect(url).toBe(`${API}/api/v1/auth/refresh`);
      const parsed = JSON.parse(init.body);
      expect(parsed.refreshToken).toBe("RT123");
      return mockFetchResponse({ status: 200, data: { accessToken: "NEW_AT" } });
    });
    // 3) 새 토큰으로 재시도 200
    (global.fetch as jest.Mock).mockImplementationOnce((url: string, init: any) => {
      expect(url).toBe(`${API}/api/v1/boards`);
      expect(init.headers.Authorization).toBe("Bearer NEW_AT");
      return mockFetchResponse({ status: 200, data: { ok: true, retried: 1 } });
    });

    const { req, res } = mockReqRes({
      method: "GET",
      query: { proxy: ["boards"] }, // protected
      headers: { authorization: "Bearer OLD" },
      cookies: "refreshToken=RT123; csrfToken=CS123",
    });

    await handler(req, res);

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true, retried: 1 });
  });

  test("refreshToken 쿠키 없으면 재시도 없이 401 유지", async () => {
    const handler = importProxyFresh();

    // 최초 백엔드 401
    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchResponse({ status: 401, data: { code: "UNAUTHORIZED" } }));

    const { req, res } = mockReqRes({
      method: "GET",
      query: { proxy: ["settings"] },
      headers: { authorization: "Bearer OLD" },
      cookies: "", // ❌ refreshToken 없음
    });

    await handler(req, res);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ code: "UNAUTHORIZED" });
  });

  test("refresh 실패(500)면 원 상태(401) 유지", async () => {
    const handler = importProxyFresh();

    // 1) 최초 백엔드 401
    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchResponse({ status: 401, data: { code: "UNAUTHORIZED" } }));
    // 2) refresh 500
    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchResponse({ status: 500, data: { code: "REFRESH_FAIL" } }));

    const { req, res } = mockReqRes({
      method: "GET",
      query: { proxy: ["dashboard"] },
      headers: { authorization: "Bearer OLD" },
      cookies: "refreshToken=RT123",
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ code: "UNAUTHORIZED" });
  });

  test("백엔드 Set-Cookie를 클라이언트로 포워딩", async () => {
    const handler = importProxyFresh();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse({
        status: 200,
        data: { ok: true },
        headers: { "set-cookie": "refreshToken=NEW; Path=/; HttpOnly" },
      })
    );

    const { req, res } = mockReqRes({
      method: "GET",
      query: { proxy: ["profile"] },
      headers: { authorization: "Bearer AT" },
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect((res as any)._headers["Set-Cookie"]).toBe("refreshToken=NEW; Path=/; HttpOnly");
  });

  test("동시 401 요청 시 refresh 1회만 호출(디듀플리케이션)", async () => {
    const handler = importProxyFresh();

    // 1) 두 요청 모두 최초 401
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => mockFetchResponse({ status: 401, data: {} })) // req1 초기
      .mockImplementationOnce(() => mockFetchResponse({ status: 401, data: {} })); // req2 초기

    // refresh 지연 응답 장치
    let resolveRefresh!: () => void;
    const refreshGate = new Promise<void>((r) => (resolveRefresh = r));

    // 2) refresh 200 (지연)
    (global.fetch as jest.Mock).mockImplementationOnce(async (url: string) => {
      expect(url).toBe(`${API}/api/v1/auth/refresh`);
      await refreshGate; // 두 요청이 같은 refreshPromise를 기다리게 함
      return mockFetchResponse({ status: 200, data: { accessToken: "NEW_AT" } });
    });

    // 3) 재시도 200 (두 요청 각각)
    (global.fetch as jest.Mock).mockImplementationOnce(() => mockFetchResponse({ status: 200, data: { ok: true, who: "req1" } })).mockImplementationOnce(() => mockFetchResponse({ status: 200, data: { ok: true, who: "req2" } }));

    const { req: req1, res: res1 } = mockReqRes({
      method: "GET",
      query: { proxy: ["boards"] },
      headers: { authorization: "Bearer OLD" },
      cookies: "refreshToken=RT123",
    });

    const { req: req2, res: res2 } = mockReqRes({
      method: "GET",
      query: { proxy: ["boards"] },
      headers: { authorization: "Bearer OLD" },
      cookies: "refreshToken=RT123",
    });

    // 동시에 실행
    const p1 = handler(req1, res1);
    const p2 = handler(req2, res2);

    // 잠시 뒤 refresh 응답 허용
    resolveRefresh();
    await Promise.all([p1, p2]);

    // refresh가 정확히 1회만 호출되었는지 확인
    const refreshCalls = (global.fetch as jest.Mock).mock.calls.filter((c) => String(c[0]).includes("/auth/refresh"));
    expect(refreshCalls.length).toBe(1);

    expect(res1.status).toHaveBeenCalledWith(200);
    expect(res2.status).toHaveBeenCalledWith(200);
  });
});
