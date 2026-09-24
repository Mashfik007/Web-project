import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { Readable } from "stream";

async function uploadCover(
  db: mongoose.mongo.Db,
  file: File,
  book: unknown,
) {
  const bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "uploads",
  });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}_${file.name}`;

  const fileId = await new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        ...(typeof book === "object" && book ? book : {}),
        contentType: file.type,
      },
    });

    Readable.from(buffer).pipe(uploadStream);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", (err) => reject(err));
  });

  return String(fileId);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection is not fully initialized.");
    }

    const formData = await request.formData();
    const id = formData.get("id");
    const bookField = formData.get("book");
    const file = formData.get("image");

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify(new ApiError(400, "Invalid book id")), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof bookField !== "string") {
      return new Response(
        JSON.stringify(new ApiError(400, "Book data is required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await Book.findById(id);
    if (!existing) {
      return new Response(JSON.stringify(new ApiError(404, "Book not found")), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const book = JSON.parse(bookField);
    const coverImage =
      file instanceof File && file.size > 0
        ? await uploadCover(db, file, book)
        : existing.coverImage;

    existing.set({
      ...book,
      coverImage,
      community: {
        totalOnShelf:
          book.community?.totalOnShelf ?? existing.community?.totalOnShelf ?? 0,
        members: existing.community?.members ?? [],
      },
    });
    await existing.save();

    return new Response(
      JSON.stringify(new ApiResponce(200, existing, "Book updated")),
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
