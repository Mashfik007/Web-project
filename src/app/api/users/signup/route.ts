import connectDB from "@/dbConfig/dbConfig";
import { User } from "@/Model/Users";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import { json } from "zod";
async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Check if user already exists
    const existsuser = await User.findOne({
      $or: [{ email }, { phone }],
    }).select("_id");

    if (existsuser) {
      throw new Error("User already exists");
    }
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    user.refreshToken = user.genRefreshToken();
    user.forgotPassToken = user.genforgotPassToken();

    await user.save();

    return new Response(
      JSON.stringify(new ApiResponce(201, null, "Saved user successfully")),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify(
        new ApiError(500, error.message || "Internal Server Error"),
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
