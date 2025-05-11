import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header is required" });
  }

  // This is a simple implementation. In a real application, you'd validate tokens properly
  if (authHeader !== "Bearer secret-token") {
    return res.status(403).json({ message: "Invalid authorization token" });
  }

  next();
};
