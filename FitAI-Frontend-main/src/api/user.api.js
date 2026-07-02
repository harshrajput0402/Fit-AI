
import { apiFetch } from "./auth.api";

export const getProfile    = async () => (await apiFetch("/user/me")).data;
export const updateProfile = async (payload) => (await apiFetch("/user/me", { method: "PUT", body: JSON.stringify(payload) })).data;
export const getLatestBody = async () => (await apiFetch("/body/latest")).data;
export const logBody       = async (payload) => (await apiFetch("/body/log", { method: "POST", body: JSON.stringify(payload) })).data;

