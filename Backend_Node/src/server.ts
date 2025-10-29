import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 4000;

(async () => {
  console.log("MONGO_URI:", process.env.MONGO_URI);
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
})();
