import { Router } from "express";
import { toggleLike, getRecipeLikes } from "../controllers/likeController";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/", auth, toggleLike);
// ahora auth está activo para que el frontend pueda saber si el usuario dio like
router.get("/:recipeId", auth, getRecipeLikes);

export default router;
