import connectDB from "@/dbConfig/dbConfig";
import { readAccessToken } from "@/Helper/userFromToken";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
      return NextResponse.json(new ApiError(401, "Email or password is incorrect"), {
        status: 401,
      });
    }

    const isAdmin = Boolean(user.isAdmin);
    const accessToken = user.genAccessToken();
    readAccessToken(accessToken);
    user.accessToken = accessToken;
    await user.save();

    const response = NextResponse.json(
      new ApiResponce(
        200,
        {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin,
        },
        "Logged in successfully",
      ),
      { status: 200 },
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(500, error.message || "Internal Server Error"),
      { status: 500 },
    );
  }
}
