import axios from "@/lib/api/reqest";
import { IUser } from "@/app/types/user-typ";

export const userRequest = () => {
  const PROFILE = async (): Promise<IUser> => {
    return await axios({
      url: "/user/me",
      method: "GET",
    });
  };

  const updateProfile = async (payload: Partial<IUser>): Promise<IUser> => {
    return await axios({
      url: "/user/update-profile",
      method: "PUT",
      data: payload,
    });
  };

  // New method for uploading images
  const uploadImage = async (formData: FormData) => {
    return await axios({
      url: "/upload/upload-image",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return {
    PROFILE,
    updateProfile,
    uploadImage,
  };
};
