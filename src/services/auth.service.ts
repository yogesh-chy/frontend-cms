import { api } from "./api";
import { LoginCredentials, RegisterPayload, AuthResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.fetchPost<AuthResponse>("/api/auth", credentials);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return api.fetchPost<AuthResponse>("/api/auth?action=register", payload);
  },

  async logout(): Promise<{ success: boolean }> {
    return api.fetchPost<{ success: boolean }>("/api/auth?action=logout");
  },

  async getProfile(): Promise<any> {
    return api.fetchGet<any>("/api/auth");
  },
};
