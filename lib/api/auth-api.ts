import axios from "@/lib/api/reqest";
import { AuthLoginType, AuthRegisterType } from "@/app/types/auth";

export const authRequest = () => {
  const AUTH_REGISTER = async (payload: AuthRegisterType) => {
    return await axios({
      url: "/auth/register",
      method: "POST",
      data: payload,
    });
  };

  const AUTH_LOGIN = async (payload: AuthLoginType) => {
    return await axios({
      url: "/auth/login",
      method: "POST",
      data: payload,
    });
  };

  const AUTH_LOGOUT = async () => {
    return await axios({
      url: "/auth/logout", // Assuming /api/v1 is prefixed in axios instance
      method: "POST",
    });
  };

  return {
    AUTH_LOGIN,
    AUTH_REGISTER,
    AUTH_LOGOUT,
  };
};
