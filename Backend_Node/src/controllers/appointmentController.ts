import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/Appointment";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

interface JwtPayload {
  username: string;
  iat: number;
  exp: number;
}

function getUsername(req: Request): string | null {
  const auth = req.headers.authorization || "";
  const token = auth.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return null;

  try {
    const dec = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return dec.username;
  } catch {
    return null;
  }
}

function addOneHour(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  d.setHours(d.getHours() + 1);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export async function createAppointment(req: Request, res: Response) {
  const username = getUsername(req);
  if (!username) return res.status(401).json({ msg: "No autorizado" });

  const { fecha, inicio, paciente, motivo, notas } = req.body || {};
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return res.status(400).json({ msg: "fecha inválida" });
  if (!inicio || !/^\d{2}:\d{2}$/.test(inicio)) return res.status(400).json({ msg: "inicio inválido" });
  if (!paciente || typeof paciente !== "string") return res.status(400).json({ msg: "paciente requerido" });
  if (!["consulta", "control", "plan", "otro"].includes(motivo)) return res.status(400).json({ msg: "motivo inválido" });

  const fin = addOneHour(inicio);

  try {
    const appt = await Appointment.create({ owner: username, fecha, inicio, fin, paciente, motivo, notas });
    return res.status(201).json(appt);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({ msg: "Horario ya ocupado" });
    return res.status(500).json({ msg: "Error al crear turno", error: e?.message || e });
  }
}

export async function listAppointments(req: Request, res: Response) {
  const username = getUsername(req);
  if (!username) return res.status(401).json({ msg: "No autorizado" });

  const { from, to } = req.query as { from?: string; to?: string };
  const q: any = { owner: username };

  if (from || to) {
    q.fecha = {};
    if (from) q.fecha.$gte = from;
    if (to) q.fecha.$lte = to;
  }

  const rows = await Appointment.find(q).sort({ fecha: 1, inicio: 1 }).lean();
  res.json(rows);
}

export async function deleteAppointment(req: Request, res: Response) {
  const username = getUsername(req);
  if (!username) return res.status(401).json({ msg: "No autorizado" });

  const { id } = req.params;
  const row = await Appointment.findOne({ _id: id, owner: username });
  if (!row) return res.status(404).json({ msg: "No encontrado" });

  await row.deleteOne();
  res.json({ ok: true });
}
