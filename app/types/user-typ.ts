import { CardItem } from "./card-type";

export interface IUser {
  message: string;
   me?: IUser;
  data: UserData;
  avatar?: string;
  isLoading?: string;
    cover : string;


}

export interface UserData {
  id: string;
  cover : string;
  full_name?: string;
  user_name: string;
  email: string;
  password: string;
  avatar?: string;
  is_deleted: boolean;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;

  idCard: CardItem[]; // ✅ This must be here
}
