
import { apiFetch } from "./auth.api";

export const getTodayMeals = async () => (await apiFetch("/nutrition/today")).data;
export const createMeal    = async (p) => (await apiFetch("/nutrition/meals", { method: "POST", body: JSON.stringify(p) })).data;
export const deleteMeal    = async (id) => apiFetch(`/nutrition/meals/${id}`, { method: "DELETE" });

