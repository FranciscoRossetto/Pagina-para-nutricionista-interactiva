import app from "./app";
import { connectDB } from "./config/db";

app.listen(3001, () => console.log("API on :3001"));

const PORT = process.env.PORT || 4000;

(async () => {
  console.log("MONGO_URI:", process.env.MONGO_URI);
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
})();
