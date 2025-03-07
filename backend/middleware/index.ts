import { Request, Response, NextFunction } from "express";
import axios from "axios";

export interface AuthRequest extends Request {
  user?: { id: string; email?: string };
}

// Middleware to verify Google OAuth Access Token
export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the token by sending it to Google's endpoint
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    if (!data.sub) {
      res.status(403).json({ message: "Forbidden: Invalid token" });
      return;
    }

    console.log("🚀 ~ Decoded Token Data:", data);

    req.user = {
      id: data.sub, // Google User ID
      email: data.email, // User's Email (if available)
    };

    next();
  } catch (error: any) {
    console.error(
      "🚀 ~ Google OAuth Verification Failed:",
      error.response?.data || error.message
    );
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    return;
  }
};
