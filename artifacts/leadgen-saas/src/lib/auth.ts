import { create } from "zustand";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  services?: string | null;
  role: "user" | "admin";
  isActive: boolean;
  planId?: number | null;
  plan?: any | null;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem("lf_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("lf_token"),
  setAuth: (user, token) => {
    localStorage.setItem("lf_token", token);
    localStorage.setItem("lf_user", JSON.stringify(user));
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem("lf_token");
    localStorage.removeItem("lf_user");
    set({ user: null, token: null });
  },
}));

export function getToken(): string | null {
  return localStorage.getItem("lf_token");
}
