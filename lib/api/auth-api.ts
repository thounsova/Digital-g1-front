import axios from "@/lib/api/reqest";
import { AuthLoginType, AuthRegisterType } from "@/app/types/auth";

// You might want to rename this to apiRequest or separate auth and card requests
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
      url: "/auth/logout",
      method: "POST",
    });
  };

  // New function to create card
  const CREATE_CARD = async (payload: any) => {
    return await axios({
      url: "/api/v1/card/create-card",
      method: "POST",
      data: payload,
    });
  };

  return {
    AUTH_LOGIN,
    AUTH_REGISTER,
    AUTH_LOGOUT,
    CREATE_CARD,
  };
};
