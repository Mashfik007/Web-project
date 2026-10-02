import connectDB from "@/dbConfig/dbConfig";
import { DigitalResource } from "@/Model/DigitalResources";
import { DigitalResource_shema } from "@/Shchema/digitalResources";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { Readable } from "stream";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/epub+zip",
]);

function detectFormat(file: File): "PDF" | "EPUB" | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return "PDF";
  }
  if (file.type === "application/epub+zip" || name.endsWith(".epub")) {
    return "EPUB";
  }
  return null;
}

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
    const file = formData.get("file");
    const resourceField = formData.get("resource");

    if (!(file instanceof File) || file.size === 0) {
      return new Response(
        JSON.stringify(new ApiError(400, "No digital file provided")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (typeof resourceField !== "string") {
      return new Response(
        JSON.stringify(new ApiError(400, "Resource data is required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const parsed = DigitalResource_shema.safeParse(JSON.parse(resourceField));
    if (!parsed.success) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid resource data")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const detectedFormat = detectFormat(file);
    if (!detectedFormat) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "Only PDF and EPUB files are allowed"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (
      file.type &&
      !ALLOWED_TYPES.has(file.type) &&
      file.type !== "application/octet-stream"
    ) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "Only PDF and EPUB files are allowed"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const resource = {
      ...parsed.data,
      format: parsed.data.format || detectedFormat,
    };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name}`;
    const contentType =
      file.type ||
      (detectedFormat === "PDF" ? "application/pdf" : "application/epub+zip");

    const fileId = await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
          ...resource,
          contentType,
          originalName: file.name,
        },
      });

      Readable.from(buffer).pipe(uploadStream);

      uploadStream.on("finish", () => resolve(uploadStream.id));
      uploadStream.on("error", (err) => reject(err));
    });

    const saved = await DigitalResource.create({
      ...resource,
      fileId: String(fileId),
      fileName: file.name,
      size: file.size,
      downloads: 0,
    });

    return new Response(
      JSON.stringify(
        new ApiResponce(
          201,
          { fileId, filename, resource: saved },
          "Digital resource uploaded",
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
