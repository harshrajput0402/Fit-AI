
import { apiFetch } from "./auth.api";

export const getWeeklyAnalytics = async () => (await apiFetch("/analytics/weekly")).data;
export const getTodayNutrition  = async () => (await apiFetch("/nutrition/today")).data;
export const getHabits          = async () => (await apiFetch("/habits")).data;
export const toggleHabit        = async (id) => apiFetch(`/habits/${id}/toggle`, { method: "PUT" });
export const getTodayWater      = async () => (await apiFetch("/water/today")).data;
export const logWater           = async (g) => (await apiFetch("/water/log", { method: "POST", body: JSON.stringify({ glasses: g }) })).data;
export const getLatestBody      = async () => (await apiFetch("/body/latest")).data;

