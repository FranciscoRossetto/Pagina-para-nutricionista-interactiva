// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export interface AuthRequest extends Request {
  user?: { id: string; username?: string };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ msg: "No autorizado" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};