import { useMemo, useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { API } from "../../config/api";


export type Motivo = "consulta" | "control" | "plan" | "otro";
export type Turno = {
  id: string; fecha: string; inicio: string; fin: string;
  paciente: string; motivo: Motivo; notas?: string;
};
type ApiAppointment = {
  _id: string; fecha: string; inicio: string; fin: string;
  paciente: string; motivo: Motivo; notas?: string;
};

// Fechas (local)
export function hoyISO(): string {
  const d = new Date(); d.setHours(0,0,0,0);
  const m = (d.getMonth()+1).toString().padStart(2,"0");
  const day = d.getDate().toString().padStart(2,"0");
  return `${d.getFullYear()}-${m}-${day}`;
}
export function addDays(iso: string, delta: number): string {
  const [y,m,d] = iso.split("-").map(Number);
  const dt = new Date(y, m-1, d); dt.setDate(dt.getDate()+delta);
  const mm = (dt.getMonth()+1).toString().padStart(2,"0");
  const dd = dt.getDate().toString().padStart(2,"0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}
export function localDateFromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function weekMonday(iso: string): string {
  const dt = localDateFromISO(iso);
  const wd = dt.getDay();                 // 0=Dom, 1=Lun
  const offset = wd === 0 ? -6 : 1 - wd;  // retrocede a lunes
  const ymd = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
  return addDays(ymd, offset);
}
export function monToFri(weekMonISO: string): string[] {
  return [0,1,2,3,4].map(n => addDays(weekMonISO, n));
}

//Slots
export const SLOTS: string[] = Array.from({ length: 10 }, (_, i) =>
  String(9 + i).padStart(2, "0") + ":00"
);
export function addOneHour(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0,0,1,hh,mm); end.setHours(end.getHours()+1);
  return `${String(end.getHours()).padStart(2,"0")}:${String(end.getMinutes()).padStart(2,"0")}`;
}
function toTurno(a: ApiAppointment): Turno {
  return { id:a._id, fecha:a.fecha, inicio:a.inicio, fin:a.fin, paciente:a.paciente, motivo:a.motivo, notas:a.notas };
}

//Slot pasado
function isPastSlot(fecha: string, hora: string): boolean {
  const [y,m,d] = fecha.split("-").map(Number);
  const [hh,mm] = hora.split(":").map(Number);
  const slot = new Date(y, (m-1), d, hh, mm, 0, 0);
  const now = new Date();
  return slot.getTime() <= now.getTime();
}

//Hook semanal
export function useAgenda() {
  const { token, user } = useUser();

  const currentWeekStart = weekMonday(hoyISO());
  const [weekStart, setWeekStart] = useState<string>(currentWeekStart); // lunes visible
  const weekDays = useMemo(() => monToFri(weekStart), [weekStart]);

  const [motivo, setMotivo] = useState<Motivo>("consulta");
  const [misTurnos, setMisTurnos] = useState<Turno[]>([]);
  const [ocupados, setOcupados] = useState<Record<string, Set<string>>>({}); // {fecha:Set(horas)}

  //Edicion
  const [editSlot, setEditSlot] = useState<{ fecha: string; hora: string } | null>(null);
  const [nota, setNota] = useState<string>("");

  //Cargar mis turnos
  useEffect(() => {
    if (!token || weekDays.length === 0) { setMisTurnos([]); return; }
    const from = weekDays[0], to = weekDays[4];
    (async () => {
      try {
        const r = await fetch(`${API}api/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) { setMisTurnos([]); return; }
        const rows: ApiAppointment[] = await r.json();
        setMisTurnos(rows.map(toTurno));
      } catch { setMisTurnos([]); }
    })();
  }, [token, weekDays.join(",")]);

  // cargar ocupación anónima
  useEffect(() => {
    if (weekDays.length === 0) { setOcupados({}); return; }
    const from = weekDays[0], to = weekDays[4];
    (async () => {
      try {
        const r = await fetch(`${API}api/appointments/taken?from=${from}&to=${to}`);
        if (!r.ok) { setOcupados({}); return; }
        const data: Array<{ fecha:string; slots:string[] }> = await r.json();
        const map: Record<string, Set<string>> = {};
        data.forEach(d => { map[d.fecha] = new Set(d.slots); });
        setOcupados(map);
      } catch { setOcupados({}); }
    })();
  }, [weekDays.join(",")]);

  function isTaken(fecha: string, hora: string): boolean {
    return (ocupados[fecha]?.has(hora)) ?? false;
  }
  function mineAt(fecha: string, hora: string): Turno | undefined {
    return misTurnos.find(t => t.fecha === fecha && t.inicio === hora);
  }

  function startReservar(fecha: string, hora: string) {
    if (!token) { alert("Debes iniciar sesión para poder sacar un turno."); return; }
    if (isPastSlot(fecha, hora)) { alert("No podés reservar en una fecha u hora pasada."); return; }
    if (isTaken(fecha, hora)) { alert("Ese horario ya está ocupado."); return; }
    setEditSlot({ fecha, hora }); setNota("");
  }
  function cancelReservar() { setEditSlot(null); setNota(""); }

  async function confirmReservar() {
    if (!token || !editSlot) return;
    const { fecha, hora } = editSlot;
    if (isPastSlot(fecha, hora)) { alert("No podés reservar en una fecha u hora pasada."); return; }
    try {
      const r = await fetch(`${API}api/appointments`, {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({
          fecha, inicio: hora, paciente: user || "usuario", motivo,
          notas: nota ? nota.slice(0,15) : undefined,
        }),
      });
      if (!r.ok) { alert(await r.text()); return; }
      // refresh semana
      const [from,to] = [weekDays[0], weekDays[4]];
      const [mineR, takenR] = await Promise.all([
        fetch(`${API}api/appointments?from=${from}&to=${to}`, { headers:{ Authorization:`Bearer ${token}` }}),
        fetch(`${API}api/appointments/taken?from=${from}&to=${to}`),
      ]);
      const mineRows: ApiAppointment[] = await mineR.json();
      const takenRows: Array<{fecha:string;slots:string[]}> = await takenR.json();
      setMisTurnos(mineRows.map(toTurno));
      const map: Record<string, Set<string>> = {};
      takenRows.forEach(d => { map[d.fecha] = new Set(d.slots); });
      setOcupados(map);
      cancelReservar();
    } catch { alert("No se pudo reservar."); }
  }

  async function cancelar(id: string) {
    if (!token) return alert("Iniciá sesión para cancelar.");
    try {
      const r = await fetch(`${API}api/appointments/${id}`, { method: "DELETE", headers: { Authorization:`Bearer ${token}` } });
      if (!r.ok) return alert(await r.text());
      setMisTurnos(prev => prev.filter(t => t.id !== id));
      // actualizar ocupados
      const [from,to] = [weekDays[0], weekDays[4]];
      const takenRows: Array<{fecha:string;slots:string[]}> =
        await fetch(`${API}api/appointments/taken?from=${from}&to=${to}`).then(res=>res.json());
      const map: Record<string, Set<string>> = {};
      takenRows.forEach(d => { map[d.fecha] = new Set(d.slots); });
      setOcupados(map);
    } catch { alert("Error al cancelar."); }
  }

  function nextWeek() { setWeekStart(prev => addDays(prev, 7)); }
  function prevWeek() {
    // no permitir ir antes del lunes de la semana actual
    setWeekStart(prev => {
      const candidate = addDays(prev, -7);
      return candidate < currentWeekStart ? prev : candidate;
    });
  }
  const prevDisabled = weekStart <= currentWeekStart;

  const isEditing = (fecha: string, hora: string) =>
    !!editSlot && editSlot.fecha === fecha && editSlot.hora === hora;

  return {
    weekDays, motivo, setMotivo,
    SLOTS, addOneHour,
    isTaken, isPastSlot, mineAt,
    startReservar, cancelReservar, confirmReservar,
    isEditing, nota, setNota,
    cancelar,
    nextWeek, prevWeek, prevDisabled,
    localDateFromISO,
  };
}
