import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiUser } from "@/services/api";

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  isLoggedIn: boolean;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
  setUser: (user: ApiUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      login: (token, user) => {
        localStorage.setItem("sk_token", token);
        set({ token, user, isLoggedIn: true });
      },

      logout: () => {
        localStorage.removeItem("sk_token");
        localStorage.removeItem("sk_user");
        set({ token: null, user: null, isLoggedIn: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "sk-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isLoggedIn: state.isLoggedIn }),
    },
  ),
);
