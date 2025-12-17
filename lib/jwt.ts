import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || "fallback-secret-key"
);

export interface TokenPayload {
	iat?: number;
	exp?: number;
	[key: string]: unknown;
}

/**
 * Generate a JWT token with 48 hour expiry
 * @returns JWT token string
 */
export async function generateToken(): Promise<string> {
	const token = await new SignJWT({})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("48h") // 48 hour expiry
		.sign(secret);

	return token;
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns Decoded payload if valid, null if invalid or expired
 */
export async function verifyToken(
	token: string
): Promise<TokenPayload | null> {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload as TokenPayload;
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
}

/**
 * Check if a token is valid (not expired and properly signed)
 * @param token - The JWT token to check
 * @returns true if valid, false otherwise
 */
export async function isTokenValid(token: string): Promise<boolean> {
	const payload = await verifyToken(token);
	return payload !== null;
}
