import { config } from "@/shared/config/environment";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment = config.NEXT_PUBLIC_ENV === "development";

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.formatMessage(level, message, data);

    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      console[level](prefix, message, data || "");
    }

    // 프로덕션에서는 로그를 서버로 전송하거나 파일에 저장할 수 있습니다
    if (level === "error") {
      // 에러 로그는 항상 콘솔에 출력
      console.error(`[ERROR] ${message}`, data);
    }
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data);
  }

  info(message: string, data?: any) {
    this.log("info", message, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  error(message: string, data?: any) {
    this.log("error", message, data);
  }

  // API 호출 전용 로깅
  apiCall(method: string, url: string, status: number, duration: number) {
    const level = status >= 400 ? "error" : "info";
    const message = `API ${method} ${url} - ${status} (${duration}ms)`;

    this.log(level, message, {
      method,
      url,
      status,
      duration,
    });
  }
}

export const log = new Logger();
