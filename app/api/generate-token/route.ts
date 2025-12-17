import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
	try {
		// Get secret code from query params
		const searchParams = request.nextUrl.searchParams;
		const secret = searchParams.get("secret");

		// Validate secret code
		if (!secret || secret !== process.env.SECRET_CODE) {
			return NextResponse.json(
				{ error: "Invalid or missing secret code" },
				{ status: 403 }
			);
		}

		// Generate JWT token with 48 hour expiry
		const token = await generateToken();

		return NextResponse.json(
			{
				success: true,
				token,
				expiresIn: "48 hours",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Token generation error:", error);
		return NextResponse.json(
			{ error: "Failed to generate token" },
			{ status: 500 }
		);
	}
}
