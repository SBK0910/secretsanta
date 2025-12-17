import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
	try {
		const { phoneNumber, token } = await request.json();

		// Validate token is provided
		if (!token) {
			return NextResponse.json(
				{ error: "Token is required" },
				{ status: 401 }
			);
		}

		// Verify JWT token
		const payload = await verifyToken(token);
		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid or expired token" },
				{ status: 401 }
			);
		}

		// Validate phone number is 4 digits
		if (!/^\d{4}$/.test(phoneNumber)) {
			return NextResponse.json(
				{ error: "Please provide last 4 digits of phone number" },
				{ status: 400 }
			);
		}

		// Verify last 4 digits match the allowed number from env
		const allowedLast4 = process.env.ALLOWED_PHONE_LAST4;
		if (phoneNumber !== allowedLast4) {
			return NextResponse.json(
				{ error: "Phone number not authorized" },
				{ status: 403 }
			);
		}

		// Get voucher URL from environment
		const voucherUrl = process.env.VOUCHER_URL;
		if (!voucherUrl) {
			return NextResponse.json(
				{ error: "Voucher URL not configured" },
				{ status: 500 }
			);
		}

		console.log("Voucher sent for phone:", phoneNumber);

		return NextResponse.json({
			success: true,
			message: "Voucher sent successfully",
			voucherUrl,
		});
	} catch (error) {
		console.error("Voucher error:", error);
		return NextResponse.json(
			{ error: "Failed to process voucher request" },
			{ status: 500 }
		);
	}
}