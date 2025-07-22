import Cookies from "js-cookie";
import { CookieName } from "@/app/types/cookie-emun";

export const getAccessToken = () => Cookies.get(CookieName.ACCESS_TOKEN);
export const getRefreshToken = () => Cookies.get(CookieName.REFRESH_TOKEN);

export const saveTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(CookieName.ACCESS_TOKEN, accessToken, { expires: 7, sameSite: "strict" });
  Cookies.set(CookieName.REFRESH_TOKEN, refreshToken, { expires: 7, sameSite: "strict" });
};

export const clearTokens = () => {
  Cookies.remove(CookieName.ACCESS_TOKEN);
  Cookies.remove(CookieName.REFRESH_TOKEN);
};
