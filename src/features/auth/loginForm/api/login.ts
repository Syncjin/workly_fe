// features/auth/loginForm/api/login.ts
import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api/types";

interface LoginRequest {
  userId: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const login = (payload: LoginRequest) => api.post<ApiResponse<LoginResponse>>("/users/token", payload).then((res) => res.data);
