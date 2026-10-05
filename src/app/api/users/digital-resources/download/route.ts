import connectDB from "@/dbConfig/dbConfig";
import { DigitalResource } from "@/Model/DigitalResources";
import { DownloadEvent } from "@/Model/DownloadEvents";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishDigitalUpdate } from "@/Helper/publishDomain";
import { getSessionUser } from "@/Helper/userFromToken";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id } = await request.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid resource id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const resource = await DigitalResource.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { returnDocument: "after" },
    );

    if (!resource) {
      return new Response(
        JSON.stringify(new ApiError(404, "Resource not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const session = await getSessionUser();
    await DownloadEvent.create({
      resourceId: String(resource._id),
      title: resource.title,
      author: resource.author || "",
      format: resource.format,
      category: resource.category || "",
      userId: session?._id ?? "",
    });

    await publishDigitalUpdate({ action: "download", id: String(id) });
    return new Response(
      JSON.stringify(
        new ApiResponce(
          200,
          {
            fileId: resource.fileId,
            fileName: resource.fileName,
            downloads: resource.downloads,
          },
          "Download recorded",
        ),
      ),
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
