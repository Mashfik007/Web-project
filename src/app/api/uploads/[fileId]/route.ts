import connectDB from "@/dbConfig/dbConfig";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ fileId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
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

    return new Response(new Uint8Array(Buffer.concat(chunks)), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
