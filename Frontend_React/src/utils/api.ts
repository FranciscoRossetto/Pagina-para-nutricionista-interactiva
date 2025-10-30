const BASE_URL = "http://localhost:4000/api";

// === USUARIOS ===
export const registerUser = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

// === LIKES ===
export const toggleLike = async (recipeId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/likes`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify({ recipeId }),
  });
  return res.json();
};

export const getRecipeLikes = async (recipeId: string, token?: string) => {
  const headers: any = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/likes/${recipeId}`, {
    method: "GET",
    headers,
  });
  return res.json();
};

// === FAVORITOS ===
export const toggleFavorite = async (recipeId: string, token: string) => {
  const res = await fetch(`${BASE_URL}/favorites/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipeId }),
  });
  return res.json();
};

export const getUserFavorites = async (token: string) => {
  const res = await fetch(`${BASE_URL}/favorites/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Array.isArray(data.favorites) ? data.favorites : []; // 👈 devuelve array
};

export const getRecipeFavorite = async (recipeId: string, token?: string) => {
  const headers: any = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}/favorites/${recipeId}`, { headers });
  return res.json();
};

// === HIGHSCORE (opcional) ===
export const getHighScore = async (username?: string) => {
  const url = username ? `${BASE_URL}/highscore/${username}` : `${BASE_URL}/highscore`;
  const res = await fetch(url);
  return res.json();
};

export const postHighScore = async (player: string, score: number) => {
  const res = await fetch(`${BASE_URL}/highscore`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, score }),
  });
  return res.json();
};
