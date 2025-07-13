import axios from "@/lib/api/reqest";
import { IUser } from "@/app/types/user-typ";

export const userRequest = () => {
  const PROFILE = async (): Promise<IUser> => {
    return await axios({
      url: "/user/me",
      method: "GET",
    });
  };
  return {
    PROFILE,
  };
};
