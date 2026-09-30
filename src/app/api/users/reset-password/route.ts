import connectDB from "@/dbConfig/dbConfig";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const token = String(body.token ?? "").trim();
    const password = String(body.password ?? "");
    const confirmpassword = String(body.confirmpassword ?? "");

    if (!token) {
      return NextResponse.json(
        new ApiError(400, "This reset link is missing"),
        { status: 400 },
      );
    }

    if (password.length < 8 || password.length > 72) {
      return NextResponse.json(
        new ApiError(400, "Password must be at least 8 characters"),
        { status: 400 },
      );
    }

    if (password !== confirmpassword) {
      return NextResponse.json(new ApiError(400, "Passwords do not match"), {
        status: 400,
      });
    }

    let userId = "";
    try {
      const payload = jwt.verify(token, process.env.SECRET_FORGOTPASS_TOKEN!) as {
        _id?: unknown;
      };
      userId = payload && typeof payload !== "string" ? String(payload._id ?? "") : "";
    } catch {
      userId = "";
    }

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        new ApiError(401, "This reset link is invalid or has expired"),
        { status: 401 },
      );
    }

    const user = await User.findOne({ _id: userId, forgotPassToken: token });
    if (!user) {
      return NextResponse.json(
        new ApiError(401, "This reset link is invalid or has expired"),
        { status: 401 },
      );
    }

    user.password = password;
    user.forgotPassToken = "";
    await user.save();

    return NextResponse.json(
      new ApiResponce(200, null, "Password updated"),
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(new ApiError(500, message), { status: 500 });
  }
}
