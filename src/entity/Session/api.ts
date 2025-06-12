import { api } from "@shared/api";
import { CreateSessionData, Session } from "./Session.types";

export const getSessions = async (limit?: number) => {
  return await api.get<Session[]>(`users/me/sessions` + (limit ? `?limit=${limit}` : ""));
};

export const getSession = async (data: CreateSessionData & {sessionId: string}) => {
  return await api.get<Session>(`organizations/${data.organizationId}/quizzes/${data.quizId}/sessions/${data.sessionId}`);
};

export const getSessionResults = async (data: CreateSessionData & {sessionId: string}) => {
  return await api.get<Session>(`organizations/${data.organizationId}/quizzes/${data.quizId}/sessions/${data.sessionId}/results`);
};
