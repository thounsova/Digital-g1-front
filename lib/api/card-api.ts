import request from "@/lib/api/reqest";
import { CreateCardType, CardItem } from "@/app/types/card-type";

export const cardRequest = () => {
  const GET_CARD = async (id: string): Promise<CardItem> => {
    return await request({
      url: `/card/get-card/${id}`,
      method: "GET",
    });
  };

  const CREATE_CARD = async (payload: CreateCardType) => {
    return await request({
      url: "/card/create-card",
      method: "POST",
      data: payload,
    });
  };

  const UPDATE_CARD = async (
    id: string,
    payload: CreateCardType
  ): Promise<CardItem> => {
    return await request({
      url: `/card/update-card/${id}`,
      method: "PUT",
      data: payload,
    });
  };

  const DELETE_CARD = async (id: string): Promise<{ message: string }> => {
    return await request({
      url: `/card/delete-card/${id}`,
      method: "DELETE",
    });
  };

  return {
    GET_CARD,
    CREATE_CARD,
    UPDATE_CARD,
    DELETE_CARD,
  };
};
