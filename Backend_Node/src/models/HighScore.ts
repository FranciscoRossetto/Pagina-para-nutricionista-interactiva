// src/models/HighScore.ts
import { Schema, model, Document } from "mongoose";

export interface IHighScore extends Document {
  player: string; // username
  score: number;
  date: Date;
}

const highScoreSchema = new Schema<IHighScore>({
  player: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export const HighScore = model<IHighScore>("HighScore", highScoreSchema);
