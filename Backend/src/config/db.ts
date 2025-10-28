import mongoose from "mongoose";

/**
 * establish a connection to the mongoDB database through mongoose ODM.
 * 
 * @param MONGO_URL - string that connects to the mongoDB database. 
 */
export const connectDB = async (MONGO_URL: string) => {
  try {
    await mongoose.connect(MONGO_URL, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); 
  }
};
