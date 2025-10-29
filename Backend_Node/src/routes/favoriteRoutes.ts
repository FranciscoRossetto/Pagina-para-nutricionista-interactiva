import { Router } from "express";
import { addFavorite, getUserFavorites } from "../controllers/favoriteController";
import { auth } from "../middlewares/auth";

const router = Router();
router.post("/", auth, addFavorite);
router.get("/", auth, getUserFavorites);

export default router;
