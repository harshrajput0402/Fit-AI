
import { apiFetch } from "./auth.api";

export const getWeeklyAnalytics  = async () => (await apiFetch("/analytics/weekly")).data;
export const getMonthlyAnalytics = async () => (await apiFetch("/analytics/monthly")).data;
