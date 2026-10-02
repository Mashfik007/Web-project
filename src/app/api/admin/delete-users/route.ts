import connectDB from "@/dbConfig/dbConfig";
import { ArchivedLibraryUser } from "@/Model/ArchivedLibraryUsers";
import { LibraryUser } from "@/Model/LibraryUsers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishUserAdminUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid user id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await LibraryUser.findById(id);
    if (!user) {
      return new Response(JSON.stringify(new ApiError(404, "User not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ArchivedLibraryUser.create({
      originalId: user._id,
      user: user.toObject(),
      archivedAt: new Date(),
    });
    await LibraryUser.deleteOne({ _id: user._id });

    await publishUserAdminUpdate({ action: "delete", id: String(user._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "User archived and deleted")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
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
