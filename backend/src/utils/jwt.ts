import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in .env");
}

export const generateToken = (userId: string): string => {
	return jwt.sign(
		{ userId },
		JWT_SECRET,
		{
			expiresIn: "7d",
		},
	);
};

export const verifyJwtToken = (token: string) => {
	return jwt.verify(token, JWT_SECRET);
};