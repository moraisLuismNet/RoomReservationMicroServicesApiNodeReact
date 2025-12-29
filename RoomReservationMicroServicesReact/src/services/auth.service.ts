import { apiClient } from "../core/apiClient";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../models/auth.model";

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/api/auth/login", credentials);
  },

  register: async (data: RegisterRequest): Promise<any> => {
    return apiClient.post("/api/auth/register", data);
  },
};
