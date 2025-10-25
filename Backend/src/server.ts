import app from "./app";
import { config } from "./config";
import { connectDB } from "./config/db";

const startServer = async () => {
  try {
    await connectDB(config.MONGO_URI);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {}
};

startServer();
