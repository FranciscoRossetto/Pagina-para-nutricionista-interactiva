import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  // Si ya hay conexión activa, no hacer nada
  if (mongoose.connection.readyState >= 1) {
    console.log("⚠️ Ya hay una conexión activa a MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error);
    process.exit(1);
  }
};
