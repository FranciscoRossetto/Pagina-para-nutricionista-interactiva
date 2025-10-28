import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import highScoreRoutes from "./routes/highScoreRoutes";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/highscore", highScoreRoutes);

app.use(errorHandler);

export default app;
