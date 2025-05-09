export type User = {
  id: string;
  username: string;
  first_name: string;
  last_name: string | null;
  photo_url: string;
  deleted_at: string | null;
}

export type TelegramUser = {
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  telegram_id?: number;
  hash?: string;
}
