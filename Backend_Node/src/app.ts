import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import likeRoutes from "./routes/likeRoutes";
import highScoreRoutes from "./routes/highScoreRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/highscore", highScoreRoutes);

// Middleware de errores
app.use(errorHandler);

export default app;
