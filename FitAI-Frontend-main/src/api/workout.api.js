
import { apiFetch } from "./auth.api";

export const getWorkouts      = async () => (await apiFetch("/workouts")).data;
export const createWorkout    = async (p) => (await apiFetch("/workouts", { method: "POST", body: JSON.stringify(p) })).data;
export const addExercise      = async (id, p) => (await apiFetch(`/workouts/${id}/exercises`, { method: "POST", body: JSON.stringify(p) })).data;
export const completeWorkout  = async (id, d) => (await apiFetch(`/workouts/${id}/complete`, { method: "PUT", body: JSON.stringify({ durationMin: d }) })).data;
export const deleteWorkout    = async (id) => apiFetch(`/workouts/${id}`, { method: "DELETE" });

