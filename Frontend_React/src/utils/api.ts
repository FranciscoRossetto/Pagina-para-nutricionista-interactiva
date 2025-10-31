// src/utils/api.ts
const BASE_URL = import.meta.env.VITE_API_URL;

console.log("BASE_URL:", BASE_URL);

async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// usuarios
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

// likes
export const toggleLike = (recipeId: string, token: string) =>
  fetchJSON(`${BASE_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipeId }),
  });

export const getRecipeLikes = async (recipeId: string, token?: string) => {
  // Evita error si no hay sesión
  try {
    const res = await fetchJSON(`${BASE_URL}/likes/${recipeId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res;
  } catch (err) {
    console.warn("Error cargando likes:", err);
    return { likes: 0 };
  }
};

// FAVS
export const toggleFavorite = (recipeId: string, token: string) =>
  fetchJSON(`${BASE_URL}/favorites/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipeId }),
  });

export const getUserFavorites = async (token: string) => {
  const data = await fetchJSON(`${BASE_URL}/favorites/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data.favorites) ? data.favorites : [];
};

export const getRecipeFavorite = async (recipeId: string, token?: string) => {
  if (!token) {
    // Si no hay sesión, devolvemos por defecto "no favorito"
    return { isFavorite: false };
  }

  try {
    return await fetchJSON(`${BASE_URL}/favorites/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.warn("Error cargando favorito:", err);
    return { isFavorite: false };
  }
};

// highscore
export const getHighScore = (username?: string) =>
  fetchJSON(
    username
      ? `${BASE_URL}/highscore/${username}`
      : `${BASE_URL}/highscore`
  );

export const postHighScore = (player: string, score: number) =>
  fetchJSON(`${BASE_URL}/highscore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, score }),
  });

// appointments
export const fetchAppointments = (from: string, to: string, token: string) =>
  fetchJSON(`${BASE_URL}/appointments?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchTakenSlots = (from: string, to: string) =>
  fetchJSON(`${BASE_URL}/appointments/taken?from=${from}&to=${to}`);

export const postAppointment = (data: any, token: string) =>
  fetchJSON(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

export const deleteAppointment = (id: string, token: string) =>
  fetchJSON(`${BASE_URL}/appointments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
