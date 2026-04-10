import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI+'/'+process.env.MONGODB_DATABASE;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }
    console.log("🔌 Connecting to DB...", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};