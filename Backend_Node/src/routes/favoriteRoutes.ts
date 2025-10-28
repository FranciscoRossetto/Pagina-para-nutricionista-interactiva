import express from "express";
import { addFavorite, getUserFavorites } from "../controllers/favoriteController";
import { auth } from "../middlewares/auth";

const router = express.Router();
router.post("/", auth, addFavorite);
router.get("/", auth, getUserFavorites);

export default router;
