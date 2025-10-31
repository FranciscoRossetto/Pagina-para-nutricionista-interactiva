// src/components/AgendaComponente/agendacomponents.tsx
import { useMemo, useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

/* ===== Tipos ===== */
export type Motivo = "consulta" | "control" | "plan" | "otro";
export type Turno = {
  id: string;
  fecha: string;   // "YYYY-MM-DD" local
  inicio: string;  // "HH:mm"
  fin: string;     // "HH:mm"
  paciente: string;
  motivo: Motivo;
  notas?: string;
};
type ApiAppointment = {
  _id: string;
  fecha: string;
  inicio: string;
  fin: string;
  paciente: string;
  motivo: Motivo;
  notas?: string;
};

/* ===== Config ===== */
const API = "http://localhost:4000";

/* ===== Utilitarios de fecha: 100% locales, sin UTC ===== */
const pad2 = (n: number) => String(n).padStart(2, "0");

export function hoyISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
export function localDateFromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
export function addDays(iso: string, delta: number): string {
  const dt = localDateFromISO(iso);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}
export function weekMonday(iso: string): string {
  const dt = localDateFromISO(iso);
  const wd = dt.getDay();                 // 0=Dom
  const offset = wd === 0 ? -6 : 1 - wd;  // llevar a lunes
  return addDays(iso, offset);
}
export function monToFri(weekMonISO: string): string[] {
  return [0, 1, 2, 3, 4].map((n) => addDays(weekMonISO, n));
}

/* ===== Slots 09:00–18:00 en horas en punto ===== */
export const SLOTS: string[] = Array.from({ length: 10 }, (_, i) => `${pad2(9 + i)}:00`);
export function addOneHour(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const d = new Date(0, 0, 1, hh, mm);
  d.setHours(d.getHours() + 1);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/* Mapping API→Turno */
function toTurno(a: ApiAppointment): Turno {
  return {
    id: a._id,
    fecha: a.fecha,
    inicio: a.inicio,
    fin: a.fin,
    paciente: a.paciente,
    motivo: a.motivo,
    notas: a.notas,
  };
}

/* ===== Pasado: muestra “Pasado” y bloquea reserva ===== */
/* Regla: fecha < hoy → pasado; fecha > hoy → futuro; fecha == hoy → HH:mm <= ahora */
function nowHHMM(): string {
  const n = new Date();
  return `${pad2(n.getHours())}:${pad2(n.getMinutes())}`;
}
export function isPastSlot(fecha: string, hora: string): boolean {
  const today = hoyISO();
  if (fecha < today) return true;
  if (fecha > today) return false;
  return hora <= nowHHMM();
}

/* ===== Hook semanal L–V ===== */
export function useAgenda() {
  const { token, user } = useUser();

  const currentWeekStart = weekMonday(hoyISO());      // lunes actual
  const [weekStart, setWeekStart] = useState<string>(currentWeekStart);
  const weekDays = useMemo(() => monToFri(weekStart), [weekStart]); // L–V fijo

  const [motivo, setMotivo] = useState<Motivo>("consulta");
  const [misTurnos, setMisTurnos] = useState<Turno[]>([]);
  const [ocupados, setOcupados] = useState<Record<string, Set<string>>>({}); // {fecha:Set(horas)}

  // edición inline
  const [editSlot, setEditSlot] = useState<{ fecha: string; hora: string } | null>(null);
  const [nota, setNota] = useState<string>("");

  /* Cargar “mis turnos” de la semana */
  useEffect(() => {
    if (!token || weekDays.length === 0) {
      setMisTurnos([]);
      return;
    }
    const [from, to] = [weekDays[0], weekDays[4]];
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) {
          setMisTurnos([]);
          return;
        }
        const rows: ApiAppointment[] = await r.json();
        setMisTurnos(rows.map(toTurno));
      } catch {
        setMisTurnos([]);
      }
    })();
  }, [token, weekDays.join(",")]);

  /* Cargar ocupación pública de la semana */
  useEffect(() => {
    if (weekDays.length === 0) {
      setOcupados({});
      return;
    }
    const [from, to] = [weekDays[0], weekDays[4]];
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`);
        if (!r.ok) {
          setOcupados({});
          return;
        }
        const data: Array<{ fecha: string; slots: string[] }> = await r.json();
        const map: Record<string, Set<string>> = {};
        for (const d of data) map[d.fecha] = new Set(d.slots);
        setOcupados(map);
      } catch {
        setOcupados({});
      }
    })();
  }, [weekDays.join(",")]);

  /* Helpers de estado */
  function isTaken(fecha: string, hora: string): boolean {
    return ocupados[fecha]?.has(hora) ?? false;
  }
  function mineAt(fecha: string, hora: string): Turno | undefined {
    return misTurnos.find((t) => t.fecha === fecha && t.inicio === hora);
  }

  /* Flujo de reserva: respeta login y bloquea pasado */
  function startReservar(fecha: string, hora: string) {
    if (!token) {
      alert("Debes iniciar sesión para poder sacar un turno.");
      return;
    }
    if (isPastSlot(fecha, hora)) {
      alert("No podés reservar en un horario pasado.");
      return;
    }
    if (isTaken(fecha, hora)) {
      alert("Ese horario ya está ocupado.");
      return;
    }
    setEditSlot({ fecha, hora });
    setNota("");
  }
  function cancelReservar() {
    setEditSlot(null);
    setNota("");
  }
  async function confirmReservar() {
    if (!token || !editSlot) return;
    const { fecha, hora } = editSlot;
    if (isPastSlot(fecha, hora)) return;

    try {
      const r = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fecha,
          inicio: hora,
          paciente: user || "usuario",
          motivo,
          notas: nota ? nota.slice(0, 15) : undefined,
        }),
      });
      if (!r.ok) {
        alert(await r.text());
        return;
      }

      // refrescar semana
      const [from, to] = [weekDays[0], weekDays[4]];
      const [mineR, takenR] = await Promise.all([
        fetch(`${API}/api/appointments?from=${from}&to=${to}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`),
      ]);

      if (mineR.ok) {
        const rows: ApiAppointment[] = await mineR.json();
        setMisTurnos(rows.map(toTurno));
      }
      if (takenR.ok) {
        const data: Array<{ fecha: string; slots: string[] }> = await takenR.json();
        const map: Record<string, Set<string>> = {};
        for (const d of data) map[d.fecha] = new Set(d.slots);
        setOcupados(map);
      }

      cancelReservar();
    } catch {
      alert("No se pudo reservar.");
    }
  }

  async function cancelar(id: string) {
    if (!token) {
      alert("Iniciá sesión para cancelar.");
      return;
    }
    try {
      const r = await fetch(`${API}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) {
        alert(await r.text());
        return;
      }

      setMisTurnos((prev) => prev.filter((t) => t.id !== id));

      // actualizar ocupados solo de la semana visible
      const [from, to] = [weekDays[0], weekDays[4]];
      const takenRows: Array<{ fecha: string; slots: string[] }> = await fetch(
        `${API}/api/appointments/taken?from=${from}&to=${to}`
      ).then((res) => res.json());
      const map: Record<string, Set<string>> = {};
      for (const d of takenRows) map[d.fecha] = new Set(d.slots);
      setOcupados(map);
    } catch {
      alert("Error al cancelar.");
    }
  }

  /* Navegación semanal: sin ir antes del lunes actual */
  function nextWeek() {
    setWeekStart((prev) => addDays(prev, 7));
  }
  function prevWeek() {
    setWeekStart((prev) => {
      const candidate = addDays(prev, -7);
      return candidate < currentWeekStart ? prev : candidate;
    });
  }
  const prevDisabled = weekStart <= currentWeekStart;

  const isEditing = (fecha: string, hora: string) =>
    !!editSlot && editSlot.fecha === fecha && editSlot.hora === hora;

  return {
    // rango visible L–V
    weekDays,
    // control de motivo y nota
    motivo,
    setMotivo,
    nota,
    setNota,
    // slots y helpers
    SLOTS,
    addOneHour,
    isTaken,
    isPastSlot,
    mineAt,
    // flujo de reserva
    startReservar,
    cancelReservar,
    confirmReservar,
    cancelar,
    isEditing,
    // navegación
    nextWeek,
    prevWeek,
    prevDisabled,
    // utilitarios expuestos si los necesitas
    hoyISO,
    localDateFromISO,
  };
}
