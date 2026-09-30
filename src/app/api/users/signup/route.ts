import connectDB from "@/dbConfig/dbConfig";
import { syncLibraryMember } from "@/data/libraryLink";
import { User } from "@/Model/Users";
import { Form_shema } from "@/Shchema/users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const parsed = Form_shema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        new ApiError(400, parsed.error.issues[0]?.message || "Invalid registration"),
        { status: 400 },
      );
    }

    const { name, email, phone, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const existsuser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    }).select("_id");

    if (existsuser) {
      return NextResponse.json(
        new ApiError(409, "An account with this email or phone already exists"),
        { status: 409 },
      );
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
    });

    const accessToken = user.genAccessToken();
    user.accessToken = accessToken;
    user.refreshToken = user.genRefreshToken();
    await user.save();

    await syncLibraryMember({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    const emailBase = new URL(request.url).origin;

    try {
      const emailRes = await fetch(`${emailBase}/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
        }),
      });

      if (!emailRes.ok) {
        const emailError = await emailRes.json().catch(() => null);
        console.error("[signup] /api/email failed:", emailError);
      }
    } catch (error) {
      console.error("[signup] Could not reach /api/email:", error);
    }

    const response = NextResponse.json(
      new ApiResponce(
        201,
        {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: false,
        },
        "Saved user successfully",
      ),
      { status: 201 },
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code === 11000) {
      return NextResponse.json(
        new ApiError(409, "An account with this email or phone already exists"),
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(new ApiError(500, message), { status: 500 });
  }
}
