import { Request, Response } from "express";
import { HighScore } from "../models/HighScore";

export const getHighScore = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;

    if (username) {
      const userScore = await HighScore.findOne({ player: username }).sort({ score: -1 });
      return res.json(userScore || { player: username, score: 0 });
    }

    const top = await HighScore.findOne().sort({ score: -1 });
    res.json(top || { player: "Nadie", score: 0 });
  } catch (error: any) {
    res.status(500).json({ mensaje: "Error al obtener high score", error: error.message });
  }
};

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
  } catch (error: any) {
    res.status(500).json({ mensaje: "Error al guardar high score", error: error.message });
  }
};
