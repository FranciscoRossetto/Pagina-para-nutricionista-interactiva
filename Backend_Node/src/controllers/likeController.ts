import { Response } from "express";
import { RecipeLike } from "../models/RecipeLike";
import { AuthRequest } from "../middlewares/auth";

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user!.id;

    const existing = await RecipeLike.findOne({ userId, recipeId });
    if (existing) {
      await RecipeLike.deleteOne({ userId, recipeId });
      return res.json({ message: "Like quitado" });
    }

    const like = new RecipeLike({ userId, recipeId });
    await like.save();
    res.json({ message: "Like agregado" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// NUEVO: devuelve likes + si el usuario actual ya dio like
export const getRecipeLikes = async (req: AuthRequest, res: Response) => {
  try {
    const { recipeId } = req.params;
    const count = await RecipeLike.countDocuments({ recipeId });

    let likedByUser = false;
    if (req.user) {
      const exists = await RecipeLike.findOne({ recipeId, userId: req.user.id });
      likedByUser = !!exists;
    }

    res.json({ recipeId, likes: count, likedByUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
