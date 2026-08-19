import connectDB from "@/dbConfig/dbConfig";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { NextResponse } from "next/server";

connectDB();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Find user
    const user = await User.findOne({ email }).select(
      "_id",
    );

    if (!user) {
      return NextResponse.json(new ApiError(401, "User does not exist"), {
        status: 401,
      });
    }

    // Generate tokens
    const accessToken = user.genAccessToken();


    // Create response
    const response = NextResponse.json(
      new ApiResponce(200, null, "Logged in successfully"),
      { status: 200 },
    );

    // Set access token cookie
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ Only secure in production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });



    return response;
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      new ApiError(500, error.message || "Internal Server Error"),
      { status: 500 },
    );
  }
}
