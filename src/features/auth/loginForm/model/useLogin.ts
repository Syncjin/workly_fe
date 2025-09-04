// features/auth/loginForm/model/useLogin.ts
import { sessionApi } from "@/entities/session/api/sessionApi";
import { log } from "@/lib/logger";
import { setAccessToken, setCsrfToken } from "@/shared/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { UserLoginRequest, UserLoginResponse } from "../../../../entities";
import { useApiMutation } from "../../../../shared/api/hooks";

export function useLogin() {
  return useApiMutation<UserLoginResponse, UserLoginRequest>("/auth/login", {
    onSuccess: (data) => {
      log.info("로그인 성공", {
        hasAccessToken: !!data.data?.accessToken,
        operation: "login",
      });

      try {
        // accessToken만 메모리에 저장 (csrfToken과 refreshToken은 쿠키로 관리됨)
        if (data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          log.debug("액세스 토큰을 메모리에 저장했습니다", {
            tokenLength: data.data.accessToken.length,
            operation: "login",
          });
        } else {
          log.warn("로그인 응답에 액세스 토큰이 없습니다", {
            responseData: data.data,
            operation: "login",
          });
        }

        if (data.data?.csrfToken) {
          setCsrfToken(data.data.csrfToken);
          log.debug("csrf 토큰을 쿠키에 저장했습니다", {
            tokenLength: data.data.csrfToken.length,
            operation: "login",
          });
        } else {
          log.warn("로그인 응답에 csrf 토큰이 없습니다", {
            responseData: data.data,
            operation: "login",
          });
        }
      } catch (error) {
        log.error("로그인 성공 후 토큰 저장 중 오류 발생", {
          error,
          operation: "login",
        });
        // 토큰 저장 실패해도 로그인은 성공한 것으로 처리하고 계속 진행
      }
    },
    onError: (err) => {
      log.error("로그인 실패", {
        error: err,
        operation: "login",
      });
    },
  });

  return useMutation({
    mutationFn: sessionApi.postLogin,
    onSuccess: (data) => {
      log.info("로그인 성공", {
        hasAccessToken: !!data.data?.accessToken,
        operation: "login",
      });

      try {
        // accessToken만 메모리에 저장 (csrfToken과 refreshToken은 쿠키로 관리됨)
        if (data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
          log.debug("액세스 토큰을 메모리에 저장했습니다", {
            tokenLength: data.data.accessToken.length,
            operation: "login",
          });
        } else {
          log.warn("로그인 응답에 액세스 토큰이 없습니다", {
            responseData: data.data,
            operation: "login",
          });
        }

        if (data.data?.csrfToken) {
          setCsrfToken(data.data.csrfToken);
          log.debug("csrf 토큰을 쿠키에 저장했습니다", {
            tokenLength: data.data.csrfToken.length,
            operation: "login",
          });
        } else {
          log.warn("로그인 응답에 csrf 토큰이 없습니다", {
            responseData: data.data,
            operation: "login",
          });
        }
      } catch (error) {
        log.error("로그인 성공 후 토큰 저장 중 오류 발생", {
          error,
          operation: "login",
        });
        // 토큰 저장 실패해도 로그인은 성공한 것으로 처리하고 계속 진행
      }
    },
    onError: (err) => {
      log.error("로그인 실패", {
        error: err,
        operation: "login",
      });
    },
  });
}
