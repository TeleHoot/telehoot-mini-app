import { api } from "@shared/api";
import { Session } from "@entity/Session/Session.types";

export const getSessions = async (limit?: number) => {
  return await api.get<Session[]>(`users/me/sessions` + (limit ? `?limit=${limit}` : ""));
};
