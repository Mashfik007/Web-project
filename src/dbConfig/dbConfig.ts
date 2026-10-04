import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is missing");
  }

  await mongoose.connect(process.env.MONGODB_URL);
}

export default connectDB;
