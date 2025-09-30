/** @jest-environment node */
import type { NextApiRequest, NextApiResponse } from "next";

declare const mockFetchResponse: (args?: { status?: number; ok?: boolean; data?: any; headers?: Record<string, string> }) => Promise<any>;

const API = "http://localhost:3000";

// 공용 req/res 목
function mockReqRes({ method = "POST", body = undefined, headers = {} }: { method?: string; body?: any; headers?: Record<string, string> }) {
  const req = {
    method,
    body,
    headers: {
      ...(headers || {}),
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

// 매 테스트 fresh import (모듈 상태 초기화)
function importLoginHandlerFresh() {
  jest.resetModules();
  process.env.NEXT_PUBLIC_API_URL = API;
  return require("../auth/login").default as (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
}

describe("pages/api/auth/login.ts", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    process.env = { ...ORIGINAL_ENV };
    process.env.NEXT_PUBLIC_API_URL = API;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test("POST 외 메서드는 405", async () => {
    const handler = importLoginHandlerFresh();
    const { req, res } = mockReqRes({ method: "GET" });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("정상 로그인: fetch 호출/쿠키 포워딩/CSRF 주입/개발환경 Secure 제거", async () => {
    const handler = importLoginHandlerFresh();

    // 백엔드가 여러 쿠키를 콤마로 묶어 보낸 상황 (csrfToken 포함)
    const setCookieValue = "refreshToken=RT; Path=/; HttpOnly; Secure, csrfToken=CSRF-ABC123; Path=/; Secure, other=x";
    (global.fetch as jest.Mock).mockImplementationOnce((url: string, init: any) => {
      // 올바른 URL/메서드/헤더/바디 확인
      expect(url).toBe(`${API}/api/v1/auth/login`);
      expect(init.method).toBe("POST");
      expect(init.headers["Content-Type"]).toBe("application/json");
      expect(init.body).toBe(JSON.stringify({ username: "u", password: "p" }));

      // 백엔드가 돌려주는 JSON + 헤더
      return mockFetchResponse({
        status: 200,
        data: {
          status: 200,
          data: { userId: 1, name: "eunji" },
          code: "OK",
        },
        headers: { "set-cookie": setCookieValue },
      });
    });

    const { req, res } = mockReqRes({
      method: "POST",
      body: { username: "u", password: "p" },
    });

    await handler(req, res);

    // dev 환경이므로 Set-Cookie의 Secure가 제거되어 전달되어야 함
    const forwarded = (res as any)._headers["Set-Cookie"];
    expect(forwarded).toBe(setCookieValue.replace(/;\s*Secure/gi, ""));
    // 응답 status는 백엔드 JSON의 data.status를 따름
    expect(res.status).toHaveBeenCalledWith(200);
    // 응답 JSON에 csrfToken 주입 확인
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      code: "OK",
      data: {
        userId: 1,
        name: "eunji",
        csrfToken: "CSRF-ABC123",
      },
    });
  });

  test("Set-Cookie 헤더가 없으면 포워딩/주입 없이 그대로 전달", async () => {
    const handler = importLoginHandlerFresh();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse({
        status: 200,
        data: { status: 200, data: { userId: 2 }, code: "OK" },
        headers: {}, // set-cookie 없음
      })
    );

    const { req, res } = mockReqRes({
      method: "POST",
      body: { username: "a", password: "b" },
    });

    await handler(req, res);

    expect((res as any)._headers["Set-Cookie"]).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: { userId: 2 },
      code: "OK",
    });
  });

  test("백엔드 JSON 그대로 status로 사용 (예: 401)", async () => {
    const handler = importLoginHandlerFresh();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      mockFetchResponse({
        status: 401, // fetch 응답 코드
        data: { status: 401, code: "INVALID_CREDENTIALS", message: "bad" }, // 백엔드 JSON의 status를 최종 status로 사용
        headers: {},
      })
    );

    const { req, res } = mockReqRes({
      method: "POST",
      body: { username: "x", password: "y" },
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "bad",
    });
  });

  test("fetch 예외 시 500", async () => {
    const handler = importLoginHandlerFresh();

    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error("network fail");
    });

    const { req, res } = mockReqRes({
      method: "POST",
      body: { username: "a", password: "b" },
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
