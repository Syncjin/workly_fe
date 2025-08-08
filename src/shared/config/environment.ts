export interface EnvironmentConfig {
  // 기본 환경 설정
  NODE_ENV: "development" | "production" | "test";
  NEXT_PUBLIC_ENV: "development" | "staging" | "production";

  // API 설정
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_API_VERSION: string;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NEXT_PUBLIC_ENV || "development";

  const config: EnvironmentConfig = {
    // 기본 환경 설정
    NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig["NODE_ENV"]) || "development",
    NEXT_PUBLIC_ENV: (env as EnvironmentConfig["NEXT_PUBLIC_ENV"]) || "development",

    // API 설정
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  };

  return config;
};

export const config = getEnvironmentConfig();

// 환경별 유틸리티 함수들
export const isDevelopment = () => config.NEXT_PUBLIC_ENV === "development";
export const isStaging = () => config.NEXT_PUBLIC_ENV === "staging";
export const isProduction = () => config.NEXT_PUBLIC_ENV === "production";
