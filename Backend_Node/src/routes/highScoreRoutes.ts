// src/routes/highScoreRoutes.ts
import { Router } from "express";
import { getHighScore, postHighScore } from "../controllers/highScoreController";

const router = Router();

router.get("/:username", getHighScore); // highscore de un usuario
router.post("/", postHighScore);

export default router;
