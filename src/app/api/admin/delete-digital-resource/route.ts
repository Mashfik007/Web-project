import connectDB from "@/dbConfig/dbConfig";
import { DigitalResource } from "@/Model/DigitalResources";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";

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

    const resource = await DigitalResource.findById(id);
    if (!resource) {
      return new Response(
        JSON.stringify(new ApiError(404, "Resource not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const db = mongoose.connection.db;
    if (db && resource.fileId && mongoose.Types.ObjectId.isValid(resource.fileId)) {
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads",
      });
      try {
        await bucket.delete(new mongoose.Types.ObjectId(resource.fileId));
      } catch {
        // File may already be missing from GridFS; still remove the record.
      }
    }

    await DigitalResource.deleteOne({ _id: resource._id });

    return new Response(
      JSON.stringify(new ApiResponce(200, null, "Digital resource deleted")),
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
