import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import likeRoutes from "./routes/likeRoutes";
import highScoreRoutes from "./routes/highScoreRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express(); // declarar antes de usar

app.use(cors({ origin: "http://localhost:5173/", credentials: true }));
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/highscore", highScoreRoutes);
app.use("/api/appointments", appointmentRoutes);

// Middleware de errores (al final)
app.use(errorHandler);

export default app; // exportar una sola vez