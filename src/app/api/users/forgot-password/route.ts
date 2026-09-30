import connectDB from "@/dbConfig/dbConfig";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!emailPattern.test(email)) {
      return NextResponse.json(new ApiError(400, "Please enter a valid email address"), {
        status: 400,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        new ApiError(404, "No account found for this email"),
        { status: 404 },
      );
    }

    const token = user.genforgotPassToken();
    user.forgotPassToken = token;
    await user.save();

    return NextResponse.json(
      new ApiResponce(200, { token }, "Continue to choose a new password"),
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(new ApiError(500, message), { status: 500 });
  }
}
