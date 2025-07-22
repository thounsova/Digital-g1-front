import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
import { CookieName } from "@/app/types/cookie-emun";

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean; // getter boolean property

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools((set, get) => ({
    accessToken: Cookies.get(CookieName.ACCESS_TOKEN) || null,
    refreshToken: Cookies.get(CookieName.REFRESH_TOKEN) || null,

    // getter property for auth state
    get isAuthenticated() {
      return !!get().accessToken;
    },

    setTokens: (accessToken, refreshToken) => {
      Cookies.set(CookieName.ACCESS_TOKEN, accessToken);
      Cookies.set(CookieName.REFRESH_TOKEN, refreshToken);
      set({ accessToken, refreshToken });
    },

    clearTokens: () => {
      Cookies.remove(CookieName.ACCESS_TOKEN);
      Cookies.remove(CookieName.REFRESH_TOKEN);
      set({ accessToken: null, refreshToken: null });
    },
  }))
);
