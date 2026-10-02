import connectDB from "@/dbConfig/dbConfig";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ fileId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { fileId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return new Response("Image not found", { status: 404 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return new Response("Image not found", { status: 404 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });
    const id = new mongoose.Types.ObjectId(fileId);
    const files = await bucket.find({ _id: id }).toArray();
    const file = files[0];

    if (!file) {
      return new Response("Image not found", { status: 404 });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of bucket.openDownloadStream(id)) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const contentType =
      typeof file.metadata?.contentType === "string"
        ? file.metadata.contentType
        : "image/jpeg";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    };

    const wantsDownload =
      new URL(request.url).searchParams.get("download") === "1";
    if (wantsDownload) {
      const originalName =
        typeof file.metadata?.originalName === "string"
          ? file.metadata.originalName
          : file.filename || "download";
      headers["Content-Disposition"] =
        `attachment; filename="${originalName.replace(/"/g, "")}"`;
    }

    return new Response(new Uint8Array(Buffer.concat(chunks)), {
      headers,
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
