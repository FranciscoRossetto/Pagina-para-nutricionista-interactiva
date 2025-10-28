import { Request, Response } from "express";
import { RecipeLike } from "../models/RecipeLike";

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id;

    const existing = await RecipeLike.findOne({ userId, recipeId });
    if (existing) {
      await RecipeLike.deleteOne({ userId, recipeId });
      return res.json({ message: "Like quitado" });
    }

    const like = new RecipeLike({ userId, recipeId });
    await like.save();
    res.json({ message: "Like agregado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecipeLikes = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;
    const count = await RecipeLike.countDocuments({ recipeId });
    res.json({ recipeId, likes: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
