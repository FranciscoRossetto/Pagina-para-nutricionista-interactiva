
import React, { useMemo, useState } from "react";

type Motivo = "consulta" | "control" | "plan" | "otro";

type Turno = {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
  paciente: string;
  motivo: Motivo;
  notas?: string;
};

type FormState = {
  fecha: string;
  inicio: string;
  paciente: string;
  motivo: Motivo;
  notas: string;
};

const h = React.createElement;


function hoyISO(): string {
  const d = new Date();
  d.setHours(0,0,0,0);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const mm = (dt.getMonth() + 1).toString().padStart(2, "0");
  const dd = dt.getDate().toString().padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}
function startOfWeekISO(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const jsDay = dt.getDay();
  const offset = jsDay === 0 ? -6 : 1 - jsDay; 
  return addDays(iso, offset);
}
function isWeekend(iso: string): boolean {
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
function isHoliday(iso: string): boolean { return HOLIDAYS_AR.has(iso); }


function nextBusinessDayFrom(iso: string): string {
  let cur = iso;
  while (isWeekend(cur) || isHoliday(cur)) cur = addDays(cur, 1);
  return cur;
}

function businessDaysFrom(fromISO: string, count: number): string[] {
  const res: string[] = [];
  let cur = fromISO;
  while (res.length < count) {
    if (!isWeekend(cur) && !isHoliday(cur)) res.push(cur);
    cur = addDays(cur, 1);
  }
  return res;
}

function ordenarPorHora(a: Turno, b: Turno): number {
  return a.inicio.localeCompare(b.inicio);
}
function generarId(t: Omit<Turno, "id">): string {
  return `${t.fecha}_${t.inicio}_${t.paciente}_${Math.random().toString(36).slice(2, 8)}`;
}


const SLOTS: string[] = Array.from({ length: 10 }, (_, i) => String(9 + i).padStart(2, "0") + ":00");
function addOneHour(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0, 0, 1, hh, mm);
  end.setHours(end.getHours() + 1);
  const H = end.getHours().toString().padStart(2, "0");
  const M = end.getMinutes().toString().padStart(2, "0");
  return `${H}:${M}`;
}


const styles: Record<string, React.CSSProperties> = {
  bg: {
    backgroundImage: "linear-gradient(180deg,#ffe4f1 0%, #ffd1ea 40%, #ffc2e4 100%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    minHeight: "100vh",
    width: "100%",
  },
  cont: { fontFamily: "Inter, system-ui, Arial", padding: 20, maxWidth: 1200, margin: "0 auto" },
  panel: {
    border: "1px solid #f9a8d4", borderRadius: 16, background: "rgba(255,255,255,0.85)",
    boxShadow: "0 10px 30px rgba(219,39,119,0.15)", backdropFilter: "blur(3px)", padding: 12,
  },
  header: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  h1: { fontSize: 22, fontWeight: 900, marginRight: 12, color: "#9d174d" },
  btn: {
    padding: "8px 12px", border: "1px solid #f472b6", borderRadius: 12, cursor: "pointer",
    background: "#fff", color: "#9d174d", boxShadow: "0 2px 8px rgba(219,39,119,0.15)",
  },
  btnPrimary: {
    padding: "8px 12px", border: "1px solid #ec4899", borderRadius: 12, cursor: "pointer",
    background: "#ec4899", color: "#fff", boxShadow: "0 4px 12px rgba(236,72,153,0.25)",
  },
  input: { padding: 10, border: "1px solid #fbcfe8", borderRadius: 12, background: "#fff", outline: "none" },
  form: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10, marginBottom: 16 },
  select: { padding: 10, border: "1px solid #fbcfe8", borderRadius: 12, background: "#fff" },
  gridWrap: { marginTop: 8 },
  grid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 },
  col: {
    border: "1px dashed #f9a8d4", borderRadius: 14, padding: 10, background: "rgba(255,255,255,0.9)",
    minHeight: 160, boxShadow: "0 4px 10px rgba(244,114,182,0.12)",
  },
  colHead: { fontSize: 12, fontWeight: 800, color: "#9d174d", marginBottom: 8, textTransform: "uppercase" },
  card: {
    border: "1px solid #fbcfe8", borderRadius: 14, padding: 10,
    background: "linear-gradient(180deg, #fff 0%, #ffe4f1 100%)",
    marginBottom: 8, boxShadow: "0 2px 8px rgba(236,72,153,0.15)",
  },
  row: { display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" },
  time: { fontWeight: 800, color: "#831843" },
  notes: { fontSize: 12, color: "#6b7280" },
  tagBase: { fontSize: 11, padding: "2px 8px", borderRadius: 999, border: "1px solid" },
};

function chipStyle(kind: Motivo): React.CSSProperties {
  const base = styles.tagBase;
  const map: Record<Motivo, React.CSSProperties> = {
    consulta: { color: "#9d174d", borderColor: "#fbcfe8", background: "#fde2f3" },
    control: { color: "#065f46", borderColor: "#bbf7d0", background: "#ecfdf5" },
    plan: { color: "#7c2d12", borderColor: "#fed7aa", background: "#fff7ed" },
    otro: { color: "#334155", borderColor: "#e2e8f0", background: "#f8fafc" },
  };
  return { ...base, ...map[kind] };
}


export default function Agenda(): React.ReactElement {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cursor, setCursor] = useState<string>(hoyISO());
  const [filtroPaciente, setFiltroPaciente] = useState<string>("");

  
  const [form, setForm] = useState<FormState>({
    fecha: nextBusinessDayFrom(hoyISO()),
    inicio: "09:00",
    paciente: "",
    motivo: "consulta",
    notas: "",
  });

  const semanaInicio = useMemo(() => startOfWeekISO(cursor), [cursor]);

 
  const diasVista = useMemo(() => {
    const base = nextBusinessDayFrom(hoyISO());
    return businessDaysFrom(base, 15);
  }, [cursor]); 

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

  function crearTurno(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.paciente.trim()) return alert("Paciente es requerido.");

    const hoy = hoyISO();
    if (form.fecha < hoy) return alert("No se pueden asignar turnos en fechas pasadas.");
    if (isWeekend(form.fecha) || isHoliday(form.fecha)) return alert("Día no hábil.");
    if (!SLOTS.includes(form.inicio)) return alert("Horario no válido.");

    const fin = addOneHour(form.inicio);
    if (turnos.some((t) => t.fecha === form.fecha && t.inicio === form.inicio))
      return alert("Ese horario ya está ocupado.");

    const base = {
      fecha: form.fecha,
      inicio: form.inicio,
      fin,
      paciente: form.paciente,
      motivo: form.motivo,
      notas: form.notas || undefined,
    };
    setTurnos((prev) => [...prev, { id: generarId(base), ...base }]);
    setForm((f) => ({ ...f, inicio: "09:00", paciente: "", motivo: "consulta", notas: "" }));
  }

  function borrarTurno(id: string) {
    setTurnos((prev) => prev.filter((t) => t.id !== id));
  }
  function moverSemana(delta: number) {
    
    setCursor((prev) => addDays(prev, delta * 7));
  }

  return h(
    "div",
    { style: styles.bg },
    h(
      "div",
      { style: styles.cont },

      h(
        "div",
        { style: { ...styles.panel, ...styles.header } },
        h("div", { style: styles.h1 }, "Agenda de nutrición"),
        h("button", { style: styles.btn, onClick: () => moverSemana(-1), type: "button" }, "← Semana"),
        h("button", { style: styles.btn, onClick: () => setCursor(hoyISO()), type: "button" }, "Hoy"),
        h("button", { style: styles.btn, onClick: () => moverSemana(1), type: "button" }, "Semana →"),
        h("div", null, `Próximos 15 días hábiles`),
        h(
          "div",
          { style: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" } },
          h("input", {
            style: styles.input,
            placeholder: "Filtrar por paciente",
            value: filtroPaciente,
            onChange: (e) => setFiltroPaciente((e.target as HTMLInputElement).value),
          })
        )
      ),

      h(
        "div",
        { style: styles.panel },
        h(
          "form",
          { style: styles.form, onSubmit: crearTurno },
          h("input", {
            style: styles.input,
            type: "date",
            min: hoyISO(),
            value: form.fecha,
            onChange: (e) => onChange("fecha", (e.target as HTMLInputElement).value),
          }),
          h(
            "select",
            {
              style: styles.select,
              value: form.inicio,
              onChange: (e) => onChange("inicio", (e.target as HTMLSelectElement).value),
            },
            ...SLOTS.map((s) => h("option", { key: s, value: s }, `${s} a ${addOneHour(s)}`))
          ),
          h("input", {
            style: styles.input,
            placeholder: "Paciente",
            value: form.paciente,
            onChange: (e) => onChange("paciente", (e.target as HTMLInputElement).value),
          }),
          h(
            "select",
            {
              style: styles.select,
              value: form.motivo,
              onChange: (e) => onChange("motivo", (e.target as HTMLSelectElement).value as FormState["motivo"]),
            },
            h("option", { value: "consulta" }, "Consulta"),
            h("option", { value: "control" }, "Control"),
            h("option", { value: "plan" }, "Plan"),
            h("option", { value: "otro" }, "Otro")
          ),
          h("input", {
            style: styles.input,
            placeholder: "Notas (opcional)",
            value: form.notas,
            onChange: (e) => onChange("notas", (e.target as HTMLInputElement).value),
          }),
          h(
            "div",
            { style: { gridColumn: "1 / -1", display: "flex", gap: 8 } },
            h("button", { style: styles.btnPrimary, type: "submit" }, "Agregar turno")
          )
        )
      ),

      h(
        "div",
        { style: { ...styles.panel, ...styles.gridWrap } },
        h(
          "div",
          { style: styles.grid },
          ...diasVista.map((diaISO) =>
            h(
              "div",
              { key: diaISO, style: styles.col },
              h("div", { style: styles.colHead }, formatearCabeceraDia(diaISO)),
              ...turnosVista
                .filter((t) => t.fecha === diaISO)
                .map((t) =>
                  h(
                    "div",
                    { key: t.id, style: styles.card },
                    h(
                      "div",
                      { style: styles.row },
                      h("span", { style: styles.time }, `${t.inicio}–${t.fin}`),
                      h("span", { style: chipStyle(t.motivo) }, t.motivo)
                    ),
                    h("div", null, t.paciente),
                    t.notas ? h("div", { style: styles.notes }, t.notas) : null,
                    h(
                      "div",
                      { style: { marginTop: 8, display: "flex", gap: 8 } },
                      h(
                        "button",
                        {
                          style: { ...styles.btn, borderColor: "#ef4444", color: "#ef4444" },
                          type: "button",
                          onClick: () => borrarTurno(t.id),
                        },
                        "Eliminar"
                      )
                    )
                  )
                )
            )
          )
        )
      )
    )
  );
}


function formatearCabeceraDia(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${dias[dt.getDay()]} ${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}`;
}
