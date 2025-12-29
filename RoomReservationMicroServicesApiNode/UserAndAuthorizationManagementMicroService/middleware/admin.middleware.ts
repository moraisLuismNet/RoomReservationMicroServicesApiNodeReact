import { Response, NextFunction } from "express";
import logger from "../utils/logger";

export const adminMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      logger.warn(
        `Access denied for user ${req.user.email} - Admin role required`
      );
      return res
        .status(403)
        .json({ message: "Forbidden - Admin access required" });
    }

    next();
  } catch (error: any) {
    logger.error("Admin middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
