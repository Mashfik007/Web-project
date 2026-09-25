import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import ApiError from "@/Utils/Api_error";

export async function GET() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return NextResponse.json(new ApiError(401, "Sign in to continue"), { status: 401 });
  }
  return NextResponse.json({ token });
}
