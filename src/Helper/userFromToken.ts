import connectDB from "@/dbConfig/dbConfig";
import { isAccountSuspended } from "@/data/libraryLink";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type SessionUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AccessClaims = jwt.JwtPayload & {
  _id?: unknown;
  name?: unknown;
  email?: unknown;
  isAdmin?: unknown;
};

export function readAccessToken(token: string): SessionUser | null {
  try {
    const data = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN!) as AccessClaims;
    // console.log("access token", data);
    if (!data || typeof data === "string" || data._id == null) return null;
    return {
      _id: String(data._id),
      name: typeof data.name === "string" ? data.name : "",
      email: typeof data.email === "string" ? data.email : "",
      isAdmin: data.isAdmin === true,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;

  const claims = readAccessToken(token);
  if (!claims) return null;

  await connectDB();
  const account = await User.findById(claims._id)
    .select("name email")
    .lean<{ name?: string; email?: string } | null>();
  if (!account?.email) return null;

  return {
    _id: claims._id,
    name: account.name?.trim() || claims.name,
    email: account.email,
    isAdmin: claims.isAdmin,
  };
}

export async function requireUserId(): Promise<string | Response> {
  const user = await getSessionUser();
  if (!user) {
    return new Response(JSON.stringify(new ApiError(401, "Sign in to continue")), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (await isAccountSuspended(user.email)) {
    return new Response(
      JSON.stringify(new ApiError(403, "Your account has been suspended. Contact the admin.")),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }
  return user._id;
}
