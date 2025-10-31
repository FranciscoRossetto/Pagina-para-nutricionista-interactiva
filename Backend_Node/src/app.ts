import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import likeRoutes from "./routes/likeRoutes";
import highScoreRoutes from "./routes/highScoreRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import appointmentRoutes from "./routes/appointmentRoutes";

const allowedOrigins = [
  "https://pagina-para-nutricionista-interacti.vercel.app",
  "http://localhost:5173" // opcional para desarrollo local
];

const app = express();
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/highscore", highScoreRoutes);
app.use("/api/appointments", appointmentRoutes);

// Middleware de errores
app.use(errorHandler);

export default app;