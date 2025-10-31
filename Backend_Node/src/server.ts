import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    console.log("Iniciando servidor...");
    console.log("MONGO_URI:", process.env.MONGO_URI);

    // Conexión a la base de datos
    await connectDB();
    console.log("✅ Conectado a MongoDB correctamente");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
})();
