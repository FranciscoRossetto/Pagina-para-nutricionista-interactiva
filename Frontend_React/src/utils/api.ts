import { useUser } from "../contexts/UserContext";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

console.log("BASE_URL:", BASE_URL);

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// === USERS ===
export const registerUser = (username: string, password: string) =>
  fetchJSON(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

export const loginUser = (username: string, password: string) =>
  fetchJSON(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

// === LIKES ===
export const toggleLike = (recipeId: string, token: string) =>
  fetchJSON(`${BASE_URL}/likes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ recipeId }),
  });

export const getRecipeLikes = (recipeId: string, token?: string) =>
  fetchJSON(`${BASE_URL}/likes/${recipeId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// === FAVORITES ===
export const toggleFavorite = (recipeId: string, token: string) =>
  fetchJSON(`${BASE_URL}/favorites/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ recipeId }),
  });

export const getUserFavorites = async (token: string) => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
  }, [user]);

  const data = await fetchJSON(`${BASE_URL}/favorites/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data.favorites) ? data.favorites : [];
};

export const getRecipeFavorite = (recipeId: string, token?: string) =>
  fetchJSON(`${BASE_URL}/favorites/${recipeId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// === HIGHSCORE ===
export const getHighScore = (username?: string) =>
  fetchJSON(username ? `${BASE_URL}/highscore/${username}` : `${BASE_URL}/highscore`);

export const postHighScore = (player: string, score: number) =>
  fetchJSON(`${BASE_URL}/highscore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, score }),
  });

// === APPOINTMENTS ===
export const fetchAppointments = (from: string, to: string, token: string) =>
  fetchJSON(`${BASE_URL}/appointments?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchTakenSlots = (from: string, to: string) =>
  fetchJSON(`${BASE_URL}/appointments/taken?from=${from}&to=${to}`);

export const postAppointment = (data: any, token: string) =>
  fetchJSON(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });

export const deleteAppointment = (id: string, token: string) =>
  fetchJSON(`${BASE_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
