import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_very_secret_key_here"
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: "Admin access required" });
  }
};
