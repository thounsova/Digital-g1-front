import { IUser } from "./user-typ";

export type CardType = "Minimal" | "Modern" | "Corporate";
export type GenderType = "male" | "female";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_deleted: boolean;
  updated_at: string;
  created_at: string;
}

export interface CardItem {
  id: string;
  card : string;
  idCard: string;
  gender: GenderType;
  dob: string;
  address: string;
  phone: string;
  nationality: string;
  qr_url?: string;
  qr_code?: string;
  card_type?: CardType;
  is_active: boolean;
  is_deleted: boolean;
  theme_color?: string;
  updated_at: string;
  created_at: string;
  socialLinks: SocialLink[];
  job: string;
  bio: string;
  web_site: string;
  company: string;
  user: IUser;
}

export interface CreateCardType {
  gender: GenderType;
  avatar: string; // Keep as string if avatar is required
  nationality: string;
  dob: string;
  address: string;
  phone: string;
  card_type: CardType;
  social: Social[];
  web_site?: string;
  job?: string;
  bio: string;
  company?: string;
}

export interface Social {
  platform: string;
  icon: string;
  url: string;
}

export interface ICardServerSide {
  id: string;
  gender: GenderType;
  dob: string;
  address: string;
  phone: string;
  nationality: string;
  qr_url?: string;
  qr_code?: string;
  card_type?: CardType;
  is_active: boolean;
  is_deleted: boolean;
  theme_color?: string;
  updated_at: string;
  created_at: string;
  socialLinks: SocialLink[];
  job: string;
  bio: string;
  web_site?: string;
  company: string;
  user: IUser;
  card: CardItem;
}

export type User = {
  id: string;
  full_name: string;
  user_name: string;
  email: string;
  password: string;
  avatar: string;
  is_deleted: boolean;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
};

export type ICard = {
  id: string;
  gender: GenderType;
  dob: string;
  address: string;
  phone: string;
  job: string;
  bio: string;
  web_site: string;
  company: string;
  nationality: string;
  qr_url: string | null;
  qr_code: string | null;
  card_type: CardType;
  is_active: boolean;
  is_deleted: boolean;
  theme_color: string | null;
  updated_at: string;
  created_at: string;
  user: User;
  socialLinks: SocialLink[];
};

export type CardResponse = {
  message: string;
  card: ICard[];
};
