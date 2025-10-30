import { Request, Response } from "express";
import { RecipeLike } from "../models/RecipeLike";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// 🔄 Da o quita like (solo con token)
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No autorizado" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const { recipeId } = req.body;
    const userId = decoded.id;

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

// 👀 Devuelve total de likes y si el usuario actual dio like (si tiene token)
export const getRecipeLikes = async (req: Request, res: Response) => {
  try {
    const { recipeId } = req.params;

    // cuenta total
    const count = await RecipeLike.countDocuments({ recipeId });

    let likedByUser = false;
    const authHeader = req.header("Authorization");

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const exists = await RecipeLike.findOne({ recipeId, userId: decoded.id });
        likedByUser = !!exists;
      } catch {
        // token inválido o vencido => no hace falta cortar
      }
    }

    res.json({ recipeId, likes: count, likedByUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
