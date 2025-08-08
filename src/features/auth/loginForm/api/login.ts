// features/auth/loginForm/api/login.ts
import { api } from "@/shared/api/client";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const login = (payload: LoginRequest) => api.post<LoginResponse>("/users/token", payload).then((res) => res.data);
