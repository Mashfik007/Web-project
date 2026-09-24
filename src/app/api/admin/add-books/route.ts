import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    await connectDB();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is not fully initialized.");
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const formData = await request.formData();
    const file = formData.get("image");
    const bookField = formData.get("book");

    if (!(file instanceof File) || file.size === 0) {
      return new Response(
        JSON.stringify(new ApiError(400, "No image file provided")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof bookField !== "string") {
      return new Response(
        JSON.stringify(new ApiError(400, "Book data is required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const book = JSON.parse(bookField);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name}`;

    const fileId = await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          ...book,
          contentType: file.type,
        },
      });

      Readable.from(buffer).pipe(uploadStream);

      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", (err) => reject(err));
    });

    const savedBook = await Book.create({
      ...book,
      coverImage: String(fileId),
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          { fileId, filename, book: savedBook },
          "Book and image saved",
        ),
      ),
      {
        status: 201,
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
