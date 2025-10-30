// src/contexts/LikesContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { getRecipeLikes as apiGetLikes, toggleLike as apiToggleLike } from "../utils/api";
import { useUser } from "./UserContext";

type LikeState = { likes: number; likedByUser: boolean; loaded: boolean };
type Store = Record<string, LikeState>;

type Ctx = {
  get: (recipeId: string) => LikeState | undefined;
  ensure: (recipeId: string) => Promise<void>;
  toggle: (recipeId: string) => Promise<void>;
  refresh: (recipeId: string) => Promise<void>;
};

const LikesContext = createContext<Ctx | null>(null);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>({});
  const { token } = useUser();

  const setOne = useCallback((recipeId: string, next: Partial<LikeState>) => {
    setStore(prev => ({
      ...prev,
      [recipeId]: { ...(prev[recipeId] || { likes: 0, likedByUser: false, loaded: false }), ...next },
    }));
  }, []);

  const ensure = useCallback(async (recipeId: string) => {
    if (store[recipeId]?.loaded) return;
    const data = await apiGetLikes(recipeId, token ?? "");
    setOne(recipeId, { likes: data.likes ?? 0, likedByUser: !!data.likedByUser, loaded: true });
  }, [store, token, setOne]);

  const refresh = useCallback(async (recipeId: string) => {
    const data = await apiGetLikes(recipeId, token ?? "");
    setOne(recipeId, { likes: data.likes ?? 0, likedByUser: !!data.likedByUser, loaded: true });
  }, [token, setOne]);

  const toggle = useCallback(async (recipeId: string) => {
    // optimista: invierte liked y ajusta contador
    const cur = store[recipeId];
    if (cur) {
      const liked = !cur.likedByUser;
      const likes = cur.likes + (liked ? 1 : -1);
      setOne(recipeId, { likedByUser: liked, likes, loaded: true });
    }
    await apiToggleLike(recipeId, token || "");
    // revalida server
    await refresh(recipeId);
  }, [store, token, refresh, setOne]);

  const get = useCallback((id: string) => store[id], [store]);

  // Si el usuario cambia, invalida cache básica
  useEffect(() => {
    setStore({});
  }, [token]);

  return (
    <LikesContext.Provider value={{ get, ensure, toggle, refresh }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error("useLikes debe usarse dentro de LikesProvider");
  return ctx;
}
