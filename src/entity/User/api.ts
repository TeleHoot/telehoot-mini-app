import type { TelegramLoginData } from "@feature/TelegramLogin";
import { api } from "@shared/api";
import { User } from "@entity/User/User.types";


export const auth = async (data: string): Promise<void> => {
  return await api.post('auth/login/tma', null, {
    headers: {
      'X-Telegram-Init-Data': data
    }
  });
}

export const getMe = async ()  => {
  return await api.get<User>('users/me');
}
