import { connectDB } from "@/lib/db";

export async function GET() {
const hi = await connectDB()
await console.log(hi)
return Response.json({
    success: "helooo mother fucker",
  });
}