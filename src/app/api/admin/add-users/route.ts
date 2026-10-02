import connectDB from "@/dbConfig/dbConfig";
import { LibraryUser } from "@/Model/LibraryUsers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { publishUserAdminUpdate } from "@/Helper/publishDomain";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9]\d{7,14}$/;
const roles = ["Member", "Librarian"];

function normalizePhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, phone, role } = await request.json();
    const userName = String(name ?? "").trim();
    const userEmail = String(email ?? "").trim().toLowerCase();
    const userPhone = normalizePhone(String(phone ?? ""));
    const userRole = String(role ?? "Member");

    if (!userName || !userEmail || !userPhone || !userRole) {
      return new Response(
        JSON.stringify(new ApiError(400, "Please fill in all user details")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!emailPattern.test(userEmail)) {
      return new Response(JSON.stringify(new ApiError(400, "Enter a valid email")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!phonePattern.test(userPhone)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Enter a valid phone number")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!roles.includes(userRole)) {
      return new Response(JSON.stringify(new ApiError(400, "Select a valid role")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await LibraryUser.findOne({
      $or: [{ email: userEmail }, { phone: userPhone }],
    });
    if (existing) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "A user with this email or phone already exists"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const user = await LibraryUser.create({
      name: userName,
      email: userEmail,
      phone: userPhone,
      role: userRole,
      status: "Active",
    });

    await publishUserAdminUpdate({ action: "create", id: String(user._id) });
    return new Response(JSON.stringify(new ApiResponce(201, user, "User added")), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Internal Server Error"),
      ),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
