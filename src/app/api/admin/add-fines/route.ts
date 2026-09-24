import connectDB from "@/dbConfig/dbConfig";
import { Fine } from "@/Model/Fines";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

const fineTypes = ["Overdue", "Damage", "Lost"];

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const member = String(body.member ?? "").trim();
    const book = String(body.book ?? "").trim();
    const type = String(body.type ?? "").trim();
    const date = String(body.date ?? "").trim();
    const amount = Number(body.amount);

    if (!member || !book || !date || !fineTypes.includes(type)) {
      return new Response(
        JSON.stringify(new ApiError(400, "Complete every fine field")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return new Response(
        JSON.stringify(new ApiError(400, "Amount must be greater than 0")),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const fine = await Fine.create({
      member,
      book,
      type,
      amount,
      date,
      status: "Pending",
    });

    return new Response(JSON.stringify(new ApiResponce(201, fine, "Fine added")), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
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
