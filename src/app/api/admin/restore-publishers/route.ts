import connectDB from "@/dbConfig/dbConfig";
import { ArchivedPublisher } from "@/Model/ArchivedPublishers";
import { Publisher } from "@/Model/Publishers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishCatalogUpdate } from "@/Helper/publishDomain";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid archive id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const archived = await ArchivedPublisher.findById(id);
    if (!archived?.publisher) {
      return new Response(
        JSON.stringify(new ApiError(404, "Archived publisher not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const snapshot = { ...archived.publisher };
    delete snapshot.__v;

    await Publisher.create(snapshot);
    await ArchivedPublisher.deleteOne({ _id: archived._id });

    await publishCatalogUpdate({ entity: "publisher", action: "restore", id: String(archived.originalId || archived._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Publisher restored")),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    const message =
      error?.code === 11000
        ? "A publisher with this name is already in the list."
        : error.message || "Internal Server Error";

    return new Response(JSON.stringify(new ApiError(500, message)), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
