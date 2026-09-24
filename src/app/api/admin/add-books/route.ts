import connectDB from "@/dbConfig/dbConfig";
import ApiError from "@/Utils/Api_error";
import ApiResponce from "@/Utils/Api_responce";

export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();
        console.log(data);



        return new Response(
            JSON.stringify(new ApiResponce(201, data, "Book received")),
            {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    } catch (error: any) {
        return new Response(
            JSON.stringify(
                new ApiError(500, error.message || "Internal Server Error"),
            ),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}