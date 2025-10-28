import express from "express";
import { toggleLike, getRecipeLikes } from "../controllers/likeController";
import { auth } from "../middlewares/auth";

const router = express.Router();
router.post("/", auth, toggleLike);
router.get("/:recipeId", getRecipeLikes);

export default router;
