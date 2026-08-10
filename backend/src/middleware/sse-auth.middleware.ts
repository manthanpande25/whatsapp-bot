import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt";

export interface SSERequest extends Request {
	user?: {
		userId: string;
	};
}

export const verifySSEToken = (
	req: SSERequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.query.token as string;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Token required",
			});
		}

		const decoded = verifyJwtToken(token) as {
			userId: string;
		};

		req.user = decoded;

		next();
	} catch (error) {
		console.error("SSE JWT Error:", error);

		return res.status(401).json({
			success: false,
			message: "Invalid or expired token.",
		});
	}
};