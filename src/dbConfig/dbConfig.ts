import { log } from "console";
import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    mongoose.connection.on("connected", () => {
      console.log("Connection Successfull");
    });
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
