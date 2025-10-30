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

export type FormState = {
  fecha: string;
  inicio: string;
  paciente: string;
  motivo: Motivo;
  notas: string;
};

/* ===== Backend ===== */
const API = "http://localhost:4000";

type ApiAppointment = {
  _id: string;
  fecha: string;
  inicio: string;
  fin: string;
  paciente: string;
  motivo: Motivo;
  notas?: string;
};

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

/* ===== Helpers de fechas/validaciones (tus originales) ===== */
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
  "2025-01-01","2025-03-03","2025-03-04",
  "2025-03-24","2025-04-02","2025-04-18",
  "2025-05-01","2025-05-25","2025-06-20",
  "2025-07-09","2025-12-08","2025-12-25",
]);
export function isHoliday(iso: string): boolean {
  return HOLIDAYS_AR.has(iso);
}

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

export const SLOTS: string[] = Array.from({ length: 10 }, (_, i) =>
  String(9 + i).padStart(2, "0") + ":00"
);
export function addOneHour(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0, 0, 1, hh, mm);
  end.setHours(end.getHours() + 1);
  return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
}
function ordenarPorHora(a: Turno, b: Turno) {
  return a.inicio.localeCompare(b.inicio);
}

/* ===== Hook principal ===== */
export function useAgenda() {
  const { token } = useUser(); // JWT del login

  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [form, setForm] = useState<FormState>({
    fecha: nextBusinessDayFrom(hoyISO()),
    inicio: "09:00",
    paciente: "",
    motivo: "consulta",
    notas: "",
  });

  const diasVista = useMemo(
    () => businessDaysFrom(nextBusinessDayFrom(hoyISO()), 15),
    []
  );

  // Cargar turnos del backend cuando hay token
  useEffect(() => {
    if (!token || diasVista.length === 0) return;
    const from = diasVista[0];
    const to = diasVista[diasVista.length - 1];
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) return; // 401/403 silencioso
        const rows: ApiAppointment[] = await r.json();
        setTurnos(rows.map(toTurno));
      } catch {
        // silencio
      }
    })();
  }, [token, diasVista]);

  const turnosVista = useMemo(() => {
    const set = new Set(diasVista);
    return turnos
      .filter((t) => set.has(t.fecha))
      .filter((t) =>
        filtroPaciente ? t.paciente.toLowerCase().includes(filtroPaciente.toLowerCase()) : true
      )
      .sort((a, b) => (a.fecha === b.fecha ? ordenarPorHora(a, b) : a.fecha.localeCompare(b.fecha)));
  }, [turnos, diasVista, filtroPaciente]);

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    if (k === "fecha" && typeof v === "string") {
      const hoy = hoyISO();
      if (v < hoy) {
        alert("No se pueden asignar turnos en fechas pasadas.");
        setForm((prev) => ({ ...prev, fecha: nextBusinessDayFrom(hoy) }));
        return;
      }
      if (isWeekend(v) || isHoliday(v)) {
        const prox = nextBusinessDayFrom(v);
        alert("No hay turnos sábados, domingos ni feriados. Se ajustó al próximo día hábil.");
        setForm((prev) => ({ ...prev, fecha: prox }));
        return;
      }
    }
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  // Crear turno en backend
  async function crearTurno(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!token) return alert("Tenés que iniciar sesión para sacar un turno.");

    if (!form.paciente.trim()) return alert("Paciente es requerido.");
    const hoy = hoyISO();
    if (form.fecha < hoy) return alert("No se pueden asignar turnos en fechas pasadas.");
    if (isWeekend(form.fecha) || isHoliday(form.fecha)) return alert("Día no hábil.");
    if (!SLOTS.includes(form.inicio)) return alert("Horario no válido.");

    try {
      const r = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha: form.fecha,
          inicio: form.inicio,
          paciente: form.paciente,
          motivo: form.motivo,
          notas: form.notas || undefined,
        }),
      });
      if (!r.ok) {
        const msg = await r.text();
        return alert(`Error al crear: ${msg}`);
      }
      const nuevoApi: ApiAppointment = await r.json();
      const nuevo = toTurno(nuevoApi);

      setTurnos((prev) => [...prev, nuevo]);
      setForm((f) => ({ ...f, inicio: "09:00", paciente: "", motivo: "consulta", notas: "" }));
    } catch {
      alert("No se pudo conectar para crear el turno.");
    }
  }

  // Borrar turno en backend
  async function borrarTurno(id: string) {
    if (!token) return alert("Tenés que iniciar sesión para borrar turnos.");
    try {
      const r = await fetch(`${API}/api/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) {
        const msg = await r.text();
        return alert(`No se pudo borrar: ${msg}`);
      }
      setTurnos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Error de conexión al borrar turno.");
    }
  }

  return {
    form, turnosVista, diasVista, filtroPaciente,
    setFiltroPaciente, onChange,
    crearTurno, borrarTurno,
  };
}

export function formatearCabeceraDia(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${dias[dt.getDay()]} ${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}`;
}