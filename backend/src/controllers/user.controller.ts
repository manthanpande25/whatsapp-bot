import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      return res.status(200).json({
        success: true,
        message: "Protected Route Accessed Successfully",
        user: req.user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}

export default new UserController();