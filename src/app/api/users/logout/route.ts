import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  (await cookies()).delete("accessToken");

  return NextResponse.json({
    success: true,
    message: "Loged out successfully",
  });
}
