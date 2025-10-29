import { Router } from "express";
import { toggleLike, getRecipeLikes } from "../controllers/likeController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Solo usuarios logeados pueden dar like
router.post("/", authMiddleware, toggleLike);

// Todos pueden ver cuántos likes hay
router.get("/:recipeId", getRecipeLikes);

export default router;
