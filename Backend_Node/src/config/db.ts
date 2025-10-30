// src/config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ No se encontró la variable de entorno MONGO_URI en .env");
  process.exit(1); // corta la ejecución si no está definida
}

export const connectDB = async () => {
  // Evita reconectar si ya hay conexión activa
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