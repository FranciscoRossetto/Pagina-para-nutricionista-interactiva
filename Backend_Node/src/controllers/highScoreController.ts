import { Request, Response } from "express";
import { HighScore } from "../models/HighScore";

// Obtener el high score de un usuario específico
export const getHighScore = async (req: Request, res: Response) => {
  try {
    const username = req.query.user as string | undefined;

    if (username) {
      const userScore = await HighScore.findOne({ player: username }).sort({ score: -1 });
      return res.json(userScore || { player: username, score: 0 });
    }

    // Si no hay usuario, retornamos el top general
    const top = await HighScore.findOne().sort({ score: -1 });
    res.json(top || { player: "Nadie", score: 0 });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener high score", error });
  }
};

// Guardar un score de un usuario
export const postHighScore = async (req: Request, res: Response) => {
  try {
    const { player, score } = req.body;
    if (!player) return res.status(400).json({ mensaje: "Se requiere un usuario" });

    const current = await HighScore.findOne({ player });

    if (!current || score > current.score) {
      const newScore = current ? Object.assign(current, { score }) : new HighScore({ player, score });
      await newScore.save();
      return res.status(201).json(newScore);
    }

    res.status(200).json(current);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar high score", error });
  }
};
