import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URL!);
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
