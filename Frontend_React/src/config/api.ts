// Tomamos la URL desde VITE_API_URL o usamos localhost
export const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Quitamos slash final si lo tuviera
export const BASE_URL = API.replace(/\/$/, "");

console.log("API base URL:", BASE_URL);
