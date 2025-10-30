import { useMemo, useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";

export type Motivo = "consulta" | "control" | "plan" | "otro";

export type Turno = {
  id: string;
  fecha: string;   // YYYY-MM-DD
  inicio: string;  // HH:MM
  fin: string;     // HH:MM
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

export type FormState = {
  fecha: string;
  inicio: string;
  paciente: string;
  motivo: Motivo;
  notas: string;
};

/* ====== Backend base ====== */
const API = "http://localhost:4000";                  // ajustá si usás proxy

/* ====== Helpers fecha ====== */
export function hoyISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
export function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const mm = (dt.getMonth() + 1).toString().padStart(2, "0");
  const dd = dt.getDate().toString().padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}
export function isWeekend(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const w = dt.getDay();
  return w === 0 || w === 6;
}
const HOLIDAYS_AR = new Set<string>([
  "2025-01-01","2025-03-03","2025-03-04","2025-03-24","2025-04-02","2025-04-18",
  "2025-05-01","2025-05-25","2025-06-20","2025-07-09","2025-12-08","2025-12-25",
]);
export function isHoliday(iso: string): boolean { return HOLIDAYS_AR.has(iso); }

export function nextBusinessDayFrom(iso: string): string {
  let cur = iso;
  while (isWeekend(cur) || isHoliday(cur)) cur = addDays(cur, 1);
  return cur;
}
export function businessDaysFrom(fromISO: string, count: number): string[] {
  const out: string[] = [];
  let cur = fromISO;
  while (out.length < count) {
    if (!isWeekend(cur) && !isHoliday(cur)) out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}
function advanceBusinessDays(fromISO: string, deltaBizDays: number): string {
  let cur = fromISO;
  let left = Math.abs(deltaBizDays);
  const step = deltaBizDays >= 0 ? 1 : -1;
  while (left > 0) {
    cur = addDays(cur, step);
    if (!isWeekend(cur) && !isHoliday(cur)) left -= 1;
  }
  return cur;
}

/* ====== Slots ====== */
export const SLOTS: string[] = Array.from({ length: 10 }, (_, i) =>
  String(9 + i).padStart(2, "0") + ":00"
);
export function addOneHour(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0, 0, 1, hh, mm);
  end.setHours(end.getHours() + 1);
  return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
}
function toTurno(a: ApiAppointment): Turno {
  return { id: a._id, fecha: a.fecha, inicio: a.inicio, fin: a.fin, paciente: a.paciente, motivo: a.motivo, notas: a.notas };
}
function ordenarPorHora(a: Turno, b: Turno) { return a.inicio.localeCompare(b.inicio); }

/* ====== Hook principal con semanas ====== */
export function useAgenda() {
  const { token, user } = useUser();

  const [turnos, setTurnos] = useState<Turno[]>([]);                 // mis turnos visibles
  const [ocupados, setOcupados] = useState<Record<string, Set<string>>>({}); // slots tomados por cualquiera
  const [filtroPaciente, setFiltroPaciente] = useState("");

  const baseStart = nextBusinessDayFrom(hoyISO());
  const [weekStart, setWeekStart] = useState<string>(baseStart);     // inicio de semana actual (día hábil)

  const weekDays = useMemo(() => businessDaysFrom(weekStart, 5), [weekStart]);

  const [form, setForm] = useState<FormState>({
    fecha: weekDays[0] ?? baseStart,
    inicio: "09:00",
    paciente: user || "",
    motivo: "consulta",
    notas: "",
  });

  useEffect(() => { setForm((f) => ({ ...f, fecha: weekDays[0] ?? f.fecha })); }, [weekDays]);

  // Mis turnos de la semana
  useEffect(() => {
    if (!token || weekDays.length === 0) return;
    const from = weekDays[0];
    const to = weekDays[weekDays.length - 1];
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) { setTurnos([]); return; }
        const rows: ApiAppointment[] = await r.json();
        setTurnos(rows.map(toTurno));
      } catch { setTurnos([]); }
    })();
  }, [token, weekDays.join(",")]);

  // Ocupación anónima de la semana
  useEffect(() => {
    if (weekDays.length === 0) return;
    const from = weekDays[0];
    const to = weekDays[weekDays.length - 1];
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`);
        if (!r.ok) { setOcupados({}); return; }
        const data: Array<{ fecha: string; slots: string[] }> = await r.json();
        const map: Record<string, Set<string>> = {};
        data.forEach((d) => { map[d.fecha] = new Set(d.slots); });
        setOcupados(map);
      } catch { setOcupados({}); }
    })();
  }, [weekDays.join(",")]);

  const turnosVista = useMemo(() => {
    const set = new Set(weekDays);
    return turnos
      .filter((t) => set.has(t.fecha))
      .filter((t) => (filtroPaciente ? t.paciente.toLowerCase().includes(filtroPaciente.toLowerCase()) : true))
      .sort((a, b) => (a.fecha === b.fecha ? ordenarPorHora(a, b) : a.fecha.localeCompare(b.fecha)));
  }, [turnos, weekDays, filtroPaciente]);

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    if (k === "fecha" && typeof v === "string") {
      const hoy = hoyISO();
      if (v < hoy) return alert("No se pueden asignar turnos en fechas pasadas.");
      if (isWeekend(v) || isHoliday(v)) return alert("No hay turnos sábados, domingos ni feriados.");
    }
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function seleccionarSlot(fecha: string, inicio: string) {
    setForm((f) => ({ ...f, fecha, inicio }));
  }

  async function crearTurno(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!token) return alert("Iniciá sesión para sacar turno.");
    if (!form.paciente.trim()) return alert("Paciente es requerido.");
    if (isWeekend(form.fecha) || isHoliday(form.fecha)) return alert("Día no hábil.");
    if (!SLOTS.includes(form.inicio)) return alert("Horario no válido.");

    try {
      const r = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fecha: form.fecha,
          inicio: form.inicio,
          paciente: form.paciente || user || "usuario",
          motivo: form.motivo,
          notas: form.notas || undefined,
        }),
      });
      if (!r.ok) return alert(await r.text());
      // refrescar semana
      const from = weekDays[0], to = weekDays[weekDays.length - 1];
      await Promise.all([
        fetch(`${API}/api/appointments?from=${from}&to=${to}`, { headers: { Authorization: `Bearer ${token}` }}).then(res=>res.json()).then((rows: ApiAppointment[])=>setTurnos(rows.map(toTurno))),
        fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`).then(res=>res.json()).then((data: Array<{fecha:string;slots:string[]}>)=>{
          const map: Record<string, Set<string>> = {}; data.forEach(d=>map[d.fecha]=new Set(d.slots)); setOcupados(map);
        }),
      ]);
      setForm((f) => ({ ...f, notas: "" }));
    } catch { alert("No se pudo conectar para crear el turno."); }
  }

  async function borrarTurno(id: string) {
    if (!token) return alert("Iniciá sesión para borrar.");
    try {
      const r = await fetch(`${API}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) return alert(await r.text());
      setTurnos((prev) => prev.filter((t) => t.id !== id));
      // actualizar ocupados de la semana
      const from = weekDays[0], to = weekDays[weekDays.length - 1];
      const data: Array<{ fecha: string; slots: string[] }> =
        await fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`).then(res=>res.json());
      const map: Record<string, Set<string>> = {};
      data.forEach((d) => { map[d.fecha] = new Set(d.slots); });
      setOcupados(map);
    } catch { alert("Error de conexión al borrar turno."); }
  }

  function disponiblesPara(fecha: string): string[] {
    const taken = ocupados[fecha] || new Set<string>();
    return SLOTS.filter((s) => !taken.has(s));
  }

  function nextWeek() { setWeekStart((s) => advanceBusinessDays(s, 5)); }
  function prevWeek() { setWeekStart((s) => advanceBusinessDays(s, -5)); }

  return {
    form, turnosVista, weekDays, filtroPaciente,
    setFiltroPaciente, onChange, crearTurno, borrarTurno,
    addOneHour, disponiblesPara, seleccionarSlot,
    nextWeek, prevWeek,
  };
}

export function formatearCabeceraDia(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${dias[dt.getDay()]} ${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}`;
}
