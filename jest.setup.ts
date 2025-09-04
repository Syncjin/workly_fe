import "@testing-library/jest-dom";

global.console = {
  ...console,
  // Uncomment to ignore specific console methods in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

if (typeof window !== "undefined") {
  Object.defineProperty(window, "location", {
    value: {
      href: "http://localhost:3000",
      origin: "http://localhost:3000",
    },
    writable: true,
  });
}

// Mock fetch globally
global.fetch = jest.fn() as jest.Mock;

global.mockFetchResponse = function ({ status = 200, ok = status >= 200 && status < 300, data = {}, headers = {} } = {}) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    headers: {
      get: (name: string) => {
        const lower = name.toLowerCase();
        return headers[lower] ?? headers[name] ?? null;
      },
    },
  });
};

// ---- logger 모킹 ----
jest.mock("@/lib/logger", () => ({
  log: {
    debug: jest.fn(),
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
