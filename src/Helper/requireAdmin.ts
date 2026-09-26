import { getSessionUser, type SessionUser } from "@/Helper/userFromToken";
import ApiError from "@/Utils/Api_error";

export async function requireAdmin(): Promise<SessionUser | Response> {
  const user = await getSessionUser();
  if (!user) {
    return new Response(JSON.stringify(new ApiError(401, "Sign in to continue")), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!user.isAdmin) {
    return new Response(JSON.stringify(new ApiError(403, "Admin access is required")), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}
