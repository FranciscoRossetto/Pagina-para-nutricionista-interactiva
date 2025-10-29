import { Request, Response } from "express";
import { Favorite } from "../models/Favorite";

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id; 

    const exists = await Favorite.findOne({ userId, recipeId });
    if (exists) {
      await Favorite.deleteOne({ userId, recipeId });
      return res.json({ message: "Favorito eliminado" });
    }

    const favorite = new Favorite({ userId, recipeId });
    await favorite.save();
    res.json({ message: "Agregado a favoritos", favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
