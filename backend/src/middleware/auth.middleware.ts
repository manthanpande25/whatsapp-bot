import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../utils/jwt";

export interface AuthRequest extends Request {
	user?: {
		userId: string;
	};
}

export const verifyToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Access denied. No token provided.",
			});
		}

		const token = authHeader.split(" ")[1];

		const decoded = verifyJwtToken(token) as {
			userId: string;
		};

		req.user = decoded;

		next();
	} catch (error) {
		console.error("JWT verification failed:", error);

		return res.status(401).json({
			success: false,
			message: "Invalid or expired token.",
		});
	}
};