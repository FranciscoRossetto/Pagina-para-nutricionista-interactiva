import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/Appointment";

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta";

interface JwtPayload { username: string; iat: number; exp: number; }

function getUsername(req: Request): string | null {
  const raw = req.headers.authorization || "";
  const token = raw.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return null;
  try { return (jwt.verify(token, JWT_SECRET) as JwtPayload).username; }
  catch { return null; }
}

function addOneHour(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  d.setHours(d.getHours() + 1);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

/* ====== Crear ====== */
export async function createAppointment(req: Request, res: Response) {
  const username = getUsername(req);
  if (!username) return res.status(401).json({ msg: "No autorizado" });

  const { fecha, inicio, paciente, motivo, notas } = req.body || {};
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return res.status(400).json({ msg: "fecha inválida" });
  if (!inicio || !/^\d{2}:\d{2}$/.test(inicio))       return res.status(400).json({ msg: "inicio inválido" });
  if (!paciente || typeof paciente !== "string")      return res.status(400).json({ msg: "paciente requerido" });
  if (!["consulta","control","plan","otro"].includes(motivo)) return res.status(400).json({ msg: "motivo inválido" });

  const fin = addOneHour(inicio);

  try {
    // Bloqueo global por software además del índice
    const conflict = await Appointment.exists({ fecha, inicio });
    if (conflict) return res.status(409).json({ msg: "Horario ya ocupado" });

    const appt = await Appointment.create({ owner: username, fecha, inicio, fin, paciente, motivo, notas });
    return res.status(201).json(appt);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(409).json({ msg: "Horario ya ocupado" });
    return res.status(500).json({ msg: "Error al crear turno", error: e?.message || e });
  }
}

/* ====== Mis turnos ====== */
export async function listAppointments(req: Request, res: Response) {
  const username = getUsername(req);
  if (!username) return res.status(401).json({ msg: "No autorizado" });

  const { from, to } = req.query as { from?: string; to?: string };
  const q: any = { owner: username };
  if (from || to) {
    q.fecha = {};
    if (from) q.fecha.$gte = from;
    if (to)   q.fecha.$lte = to;
  }

  const rows = await Appointment.find(q).sort({ fecha: 1, inicio: 1 }).lean();
  res.json(rows);
}

/* ====== Borrar propio ====== */
export async function deleteAppointment(req: Request, res: Response) {
  const username = getUsername(req);
  if (!username) return res.status(401).json({ msg: "No autorizado" });

  const { id } = req.params;
  const row = await Appointment.findOne({ _id: id, owner: username });
  if (!row) return res.status(404).json({ msg: "No encontrado" });

  await row.deleteOne();
  res.json({ ok: true });
}

/* ====== Ocupación anónima ====== */
/* Devuelve: [{ fecha: "YYYY-MM-DD", slots: ["09:00","09:30", ...] }] */
export async function takenSlots(req: Request, res: Response) {
  const { from, to } = req.query as { from?: string; to?: string };

  const q: any = {};
  if (from || to) {
    q.fecha = {};
    if (from) q.fecha.$gte = from;
    if (to)   q.fecha.$lte = to;
  }

  const rows = await Appointment.find(q, { fecha: 1, inicio: 1, _id: 0 }).lean();

  // agrupar por fecha
  const map = new Map<string, Set<string>>();
  for (const r of rows) {
    const set = map.get(r.fecha) ?? new Set<string>();
    set.add(r.inicio);
    map.set(r.fecha, set);
  }

  const out = Array.from(map.entries()).map(([fecha, set]) => ({
    fecha,
    slots: Array.from(set).sort(),
  }));

  res.json(out);
}
