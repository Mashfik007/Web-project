import connectDB from "@/dbConfig/dbConfig";
import { Book } from "@/Model/Books";
import { Publisher } from "@/Model/Publishers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";
import mongoose from "mongoose";
import { publishCatalogUpdate } from "@/Helper/publishDomain";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    await connectDB();
    const { id, name, city, email } = await request.json();
    const publisherName = String(name ?? "").trim();
    const publisherCity = String(city ?? "").trim();
    const publisherEmail = String(email ?? "").trim().toLowerCase();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Invalid publisher id")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!publisherName || !publisherCity || !publisherEmail) {
      return new Response(
        JSON.stringify(new ApiError(400, "Name, city, and email are required")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!emailPattern.test(publisherEmail)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Enter a valid email")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const publisher = await Publisher.findById(id);
    if (!publisher) {
      return new Response(
        JSON.stringify(new ApiError(404, "Publisher not found")),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const duplicate = await Publisher.findOne({
      _id: { $ne: publisher._id },
      name: new RegExp(`^${escapeRegex(publisherName)}$`, "i"),
    });
    if (duplicate) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "A publisher with this name already exists"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const previousName = publisher.name;
    publisher.name = publisherName;
    publisher.city = publisherCity;
    publisher.email = publisherEmail;
    await publisher.save();

    if (previousName !== publisherName) {
      await Book.updateMany(
        { "metadata.publisher": previousName },
        { $set: { "metadata.publisher": publisherName } },
      );
    }

    await publishCatalogUpdate({ entity: "publisher", action: "update", id: String(publisher._id) });
    return new Response(
      JSON.stringify(new ApiResponce(200, publisher, "Publisher updated")),
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
