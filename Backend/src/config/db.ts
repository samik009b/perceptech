import mongoose from "mongoose";

export const connectDB = async (MONGO_URL: string) => {
  try {
    await mongoose.connect(MONGO_URL, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process on failure
  }
};
