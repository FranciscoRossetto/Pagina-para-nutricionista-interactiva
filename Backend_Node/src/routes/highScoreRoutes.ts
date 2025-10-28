import { Router } from "express";
import { getHighScore, postHighScore } from "../controllers/highScoreController";

const router = Router();

router.get("/", getHighScore);
router.post("/", postHighScore);

export default router;
