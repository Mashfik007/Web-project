import connectDB from "@/dbConfig/dbConfig";
import { Publisher } from "@/Model/Publishers";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, city, email } = await request.json();
    const publisherName = String(name ?? "").trim();
    const publisherCity = String(city ?? "").trim();
    const publisherEmail = String(email ?? "").trim().toLowerCase();

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

    const existing = await Publisher.findOne({
      name: new RegExp(`^${escapeRegex(publisherName)}$`, "i"),
    });
    if (existing) {
      return new Response(
        JSON.stringify(
          new ApiError(400, "A publisher with this name already exists"),
        ),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const publisher = await Publisher.create({
      name: publisherName,
      city: publisherCity,
      email: publisherEmail,
      status: "Active",
    });

    return new Response(
      JSON.stringify(new ApiResponce(201, publisher, "Publisher added")),
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
