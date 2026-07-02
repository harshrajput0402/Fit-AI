
import { apiFetch } from "./auth.api";

export const sendChatMessage = async (messages) => {
  const data = await apiFetch("/ai/chat", { method: "POST", body: JSON.stringify({ messages }) });
  return data.data.message;
};