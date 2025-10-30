
import { Request, Response } from "express";
import { Favorite } from "../models/Favorite";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";


export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No autorizado" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const { recipeId } = req.body; // 👈 ahora lo leemos del body
    if (!recipeId) return res.status(400).json({ msg: "Falta recipeId" });

    const userId = decoded.id;

    const existing = await Favorite.findOne({ userId, recipeId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ success: true, message: "Favorito quitado", favorited: false });
    }

    const fav = new Favorite({ userId, recipeId });
    await fav.save();
    return res.json({ success: true, message: "Favorito agregado", favorited: true });
  } catch (err: any) {
    console.error("Error toggleFavorite:", err);
    return res.status(500).json({ success: false, error: err.message || "Error" });
  }
};


export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No autorizado" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const userId = decoded.id;
    const favorites = await Favorite.find({ userId });

    const clean = favorites.map((f) => ({
      _id: f._id,
      recipeId: f.recipeId.toString(),
      userId: f.userId.toString(),
      createdAt: f.createdAt,
    }));

    return res.json({ success: true, favorites: clean });
  } catch (err: any) {
    console.error("Error getUserFavorites:", err);
    return res.status(500).json({ success: false, error: err.message || "Error" });
  }
};


export const getRecipeFavorite = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    let favoritedByUser = false;

    const authHeader = req.header("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const exists = await Favorite.findOne({ recipeId, userId: decoded.id });
        favoritedByUser = !!exists;
      } catch (err) {}
    }

    return res.json({ recipeId, favoritedByUser });
  } catch (err: any) {
    console.error("Error getRecipeFavorite:", err);
    return res.status(500).json({ success: false, error: err.message || "Error" });
  }
};
