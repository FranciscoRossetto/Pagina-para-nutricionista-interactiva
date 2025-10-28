// app.ts
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import highScoreRoutes from "./routes/highScoreRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/highscore", highScoreRoutes);

export default app;
