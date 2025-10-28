// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware de autenticación
export const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Token inválido" });
  }
};

// Middleware de manejo de errores
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ msg: "Error interno del servidor" });
};
