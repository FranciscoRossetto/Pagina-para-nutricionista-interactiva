import { Request, Response } from "express";
import { HighScore } from "../models/HighScore";

// Obtener el high score más alto
export const getHighScore = async (req: Request, res: Response) => {
  try {
    const top = await HighScore.findOne().sort({ score: -1 });
    res.json(top);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener high score", error });
  }
};

// Guardar un nuevo score si es más alto que el existente
export const postHighScore = async (req: Request, res: Response) => {
  try {
    const { player, score } = req.body;
    const currentTop = await HighScore.findOne().sort({ score: -1 });

    if (!currentTop || score > currentTop.score) {
      const newScore = new HighScore({ player, score });
      await newScore.save();
      return res.status(201).json(newScore);
    }
    res.status(200).json(currentTop);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar high score", error });
  }
};
