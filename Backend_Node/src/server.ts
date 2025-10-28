import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB(); // conecta a Atlas
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
})();
