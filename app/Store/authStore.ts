import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { clearTokens, saveTokens, getAccessToken, getRefreshToken } from "@/lib/cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  roles: string[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  roles: string[];
  setTokens: (accessToken: string, refreshToken: string, roles: string[]) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      roles: [],

      setTokens: (accessToken, refreshToken, roles) => {
        // Save tokens to cookies
        saveTokens(accessToken, refreshToken);
        // Update Zustand state
        set({ accessToken, refreshToken, roles, isAuthenticated: true }, false, "auth/setTokens");
      },

      checkAuth: () => {
        const access = getAccessToken();
        const refresh = getRefreshToken();
        const isAuth = !!access && !!refresh;

        if (isAuth && access) {
          try {
            const decoded = jwtDecode<JwtPayload>(access);
            const roles = decoded.roles || [];
            set({ accessToken: access, refreshToken: refresh, isAuthenticated: true, roles }, false, "auth/checkAuth");
          } catch (error) {
            clearTokens();
            set({ accessToken: null, refreshToken: null, isAuthenticated: false, roles: [] }, false, "auth/checkAuth/failed");
          }
        } else {
          clearTokens();
          set({ accessToken: null, refreshToken: null, isAuthenticated: false, roles: [] }, false, "auth/checkAuth/not-authenticated");
        }
      },

      logout: () => {
        clearTokens();
        set({ accessToken: null, refreshToken: null, isAuthenticated: false, roles: [] }, false, "auth/logout");
      },
    }),
    { name: "AuthStore" }
  )
);
