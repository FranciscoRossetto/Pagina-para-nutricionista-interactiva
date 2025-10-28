// src/controllers/userController.ts
import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ username: newUser.username }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ username: newUser.username, token });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar usuario", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ username: user.username, token });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar sesión", error });
  }
};
