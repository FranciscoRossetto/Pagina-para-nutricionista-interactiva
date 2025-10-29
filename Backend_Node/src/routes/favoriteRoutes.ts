// src/routes/favoriteRoutes.ts
import { Router } from "express";
import {
  toggleFavorite,
  getUserFavorites,
  getRecipeFavorite,
} from "../controllers/favoriteController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// GET todos los favoritos del usuario
router.get("/user", authMiddleware, getUserFavorites);

// GET favorito por receta
router.get("/:recipeId", authMiddleware, getRecipeFavorite);

// POST toggle favorito (recibe recipeId en body)
router.post("/toggle", authMiddleware, toggleFavorite);

export default router;
