// agenda.tsx
import React, { useMemo, useState } from "react";

type Turno = {
  id: string;
  fecha: string;       // YYYY-MM-DD
  inicio: string;      // HH:MM 24h
  fin: string;         // HH:MM 24h
  paciente: string;
  motivo: string;      // consulta | control | plan | otro
  notas?: string;
};

type FormState = {
  fecha: string;
  inicio: string;
  fin: string;
  paciente: string;
  motivo: "consulta" | "control" | "plan" | "otro";
  notas: string;
};

const h = React.createElement;

function hoyISO(): string {
  const d = new Date();
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
  // Lunes como inicio de semana
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const jsDay = dt.getDay(); // 0..6, 0=Dom
  const offset = jsDay === 0 ? -6 : 1 - jsDay;
  return addDays(iso, offset);
}

function ordenarPorHora(a: Turno, b: Turno): number {
  return a.inicio.localeCompare(b.inicio);
}

function validarRango(inicio: string, fin: string): boolean {
  return inicio < fin;
}

function generarId(t: Omit<Turno, "id">): string {
  return `${t.fecha}_${t.inicio}_${t.paciente}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function Agenda(): React.ReactElement {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cursor, setCursor] = useState<string>(hoyISO()); // fecha seleccionada
  const [filtroPaciente, setFiltroPaciente] = useState<string>("");

  const [form, setForm] = useState<FormState>({
    fecha: hoyISO(),
    inicio: "09:00",
    fin: "09:30",
    paciente: "",
    motivo: "consulta",
    notas: "",
  });

  const semanaInicio = useMemo(() => startOfWeekISO(cursor), [cursor]);
  const diasSemana = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(semanaInicio, i)),
    [semanaInicio]
  );

  const turnosSemana = useMemo(() => {
    const set = new Set(diasSemana);
    return turnos
      .filter(t => set.has(t.fecha))
      .filter(t => (filtroPaciente ? t.paciente.toLowerCase().includes(filtroPaciente.toLowerCase()) : true))
      .sort((a, b) => a.fecha === b.fecha ? ordenarPorHora(a, b) : a.fecha.localeCompare(b.fecha));
  }, [turnos, diasSemana, filtroPaciente]);

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function crearTurno(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.paciente.trim()) return alert("Paciente es requerido.");
    if (!validarRango(form.inicio, form.fin)) return alert("El horario no es válido.");

    const nuevo: Turno = { id: generarId(form), ...form };
    setTurnos(prev => [...prev, nuevo]);
    // Ajuste rápido: mantener semana visible donde cae el turno creado
    setCursor(form.fecha);
    // Reset mínimo manteniendo fecha
    setForm(f => ({ ...f, inicio: "09:00", fin: "09:30", paciente: "", motivo: "consulta", notas: "" }));
  }

  function borrarTurno(id: string) {
    setTurnos(prev => prev.filter(t => t.id !== id));
  }

  function moverSemana(delta: number) {
    setCursor(prev => addDays(prev, delta * 7));
  }

  // Estilos inline simples para no crear archivos CSS
  const styles: Record<string, React.CSSProperties> = {
    cont: { fontFamily: "system-ui, Arial, sans-serif", padding: 16, maxWidth: 1100, margin: "0 auto" },
    header: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" },
    h1: { fontSize: 20, fontWeight: 700, marginRight: 12 },
    btn: { padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8, cursor: "pointer", background: "#fff" },
    input: { padding: 8, border: "1px solid #ccc", borderRadius: 8 },
    form: { display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 8, marginBottom: 16 },
    select: { padding: 8, border: "1px solid #ccc", borderRadius: 8, background: "#fff" },
    grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 },
    col: { border: "1px solid #e5e7eb", borderRadius: 10, padding: 8, background: "#fafafa", minHeight: 140 },
    colHead: { fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 },
    card: { border: "1px solid #e5e7eb", borderRadius: 10, padding: 8, background: "#fff", marginBottom: 8 },
    tag: { fontSize: 11, padding: "2px 6px", borderRadius: 999, border: "1px solid #e5e7eb" },
    row: { display: "flex", gap: 8, alignItems: "center" },
  };

  // Render sin JSX
  return h(
    "div",
    { style: styles.cont },
    // Header
    h(
      "div",
      { style: styles.header },
      h("div", { style: styles.h1 }, "Agenda semanal de nutrición"),
      h("button", { style: styles.btn, onClick: () => moverSemana(-1), type: "button" }, "← Semana"),
      h(
        "button",
        { style: styles.btn, onClick: () => setCursor(hoyISO()), type: "button" },
        "Hoy"
      ),
      h("button", { style: styles.btn, onClick: () => moverSemana(1), type: "button" }, "Semana →"),
      h("div", null, `Semana desde ${semanaInicio}`),
      h(
        "div",
        { style: { marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" } },
        h("input", {
          style: styles.input,
          placeholder: "Filtrar por paciente",
          value: filtroPaciente,
          onChange: e => setFiltroPaciente((e.target as HTMLInputElement).value),
        })
      )
    ),
    // Form alta turno
    h(
      "form",
      { style: styles.form, onSubmit: crearTurno },
      h("input", {
        style: styles.input,
        type: "date",
        value: form.fecha,
        onChange: e => onChange("fecha", (e.target as HTMLInputElement).value),
      }),
      h("input", {
        style: styles.input,
        type: "time",
        value: form.inicio,
        onChange: e => onChange("inicio", (e.target as HTMLInputElement).value),
      }),
      h("input", {
        style: styles.input,
        type: "time",
        value: form.fin,
        onChange: e => onChange("fin", (e.target as HTMLInputElement).value),
      }),
      h("input", {
        style: styles.input,
        placeholder: "Paciente",
        value: form.paciente,
        onChange: e => onChange("paciente", (e.target as HTMLInputElement).value),
      }),
      h(
        "select",
        {
          style: styles.select,
          value: form.motivo,
          onChange: e => onChange("motivo", (e.target as HTMLSelectElement).value as FormState["motivo"]),
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
        onChange: e => onChange("notas", (e.target as HTMLInputElement).value),
      }),
      h(
        "div",
        { style: { gridColumn: "1 / -1", display: "flex", gap: 8 } },
        h("button", { style: styles.btn, type: "submit" }, "Agregar turno")
      )
    ),
    // Grid semanal
    h(
      "div",
      { style: styles.grid },
      ...diasSemana.map(diaISO =>
        h(
          "div",
          { key: diaISO, style: styles.col },
          h("div", { style: styles.colHead }, formatearCabeceraDia(diaISO)),
          ...turnosSemana
            .filter(t => t.fecha === diaISO)
            .map(t =>
              h(
                "div",
                { key: t.id, style: styles.card },
                h(
                  "div",
                  { style: styles.row },
                  h("strong", null, `${t.inicio}–${t.fin}`),
                  h("span", { style: styles.tag }, t.motivo)
                ),
                h("div", null, t.paciente),
                t.notas ? h("div", { style: { fontSize: 12, color: "#6b7280" } }, t.notas) : null,
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
  );
}

function formatearCabeceraDia(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return `${dias[dt.getDay()]} ${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}`;
}
