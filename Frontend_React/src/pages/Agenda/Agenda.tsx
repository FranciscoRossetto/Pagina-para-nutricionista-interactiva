// src/pages/Agenda/Agenda.tsx
// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Agenda.module.css";
import { useUser } from "../../contexts/UserContext";

/* ===== Config ===== */
const API = "http://localhost:4000";
const SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

/* ===== Helpers de fecha ===== */
const pad2 = (n: number) => String(n).padStart(2, "0");
const toISODate = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;

function addDaysISO(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  dt.setHours(0, 0, 0, 0);
  return toISODate(dt);
}
function startOfMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();               // 0=Dom
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}
function formatWeekRange(mondayISO: string): string {
  const end = addDaysISO(mondayISO, 4);
  return `${mondayISO} — ${end}`;
}
function isPastDateTime(isoDate: string, hhmm: string): boolean {
  const [y, m, d] = isoDate.split("-").map(Number);
  const [hh, mm] = hhmm.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return dt.getTime() < Date.now();
}
function isPastDay(isoDate: string): boolean {
  const [y, m, d] = isoDate.split("-").map(Number);
  const end = new Date(y, m - 1, d, 23, 59, 59, 999);
  return end.getTime() < Date.now();
}

/* ===== Tipos mínimos ===== */
type Motivo = "consulta" | "control" | "plan" | "otro";
type ApiAppointment = {
  _id: string;
  fecha: string;
  inicio: string;
  fin: string;
  motivo: Motivo;
  notas?: string;
};

/* ===== Componente ===== */
export default function Agenda(): React.ReactElement {
  const { token, user } = useUser();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const currentMondayISO = useMemo(() => toISODate(startOfMonday(today)), [today]);

  const [weekMondayISO, setWeekMondayISO] = useState<string>(currentMondayISO);
  const [motivo, setMotivo] = useState<Motivo>("consulta");

  /* Ocultar/mostrar pasados */
  const [showPast, setShowPast] = useState(false);

  const [takenMap, setTakenMap] = useState<Record<string, Set<string>>>({});
  const [myAppointments, setMyAppointments] = useState<Record<string, string>>({}); // key: date|slot -> apptId
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [notaTmp, setNotaTmp] = useState<string>("");

  // Días L–V base
  const baseDaysISO = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < 5; i++) out.push(addDaysISO(weekMondayISO, i));
    return out;
  }, [weekMondayISO]);

  // Días visibles según toggle de pasados
  const daysISO = useMemo(() => {
    if (showPast) return baseDaysISO;
    return baseDaysISO.filter((iso) => !isPastDay(iso));
  }, [baseDaysISO, showPast]);

  /* ===== Carga ocupación pública ===== */
  useEffect(() => {
    const from = weekMondayISO;
    const to = addDaysISO(weekMondayISO, 4);
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`);
        if (!r.ok) throw new Error(await r.text());
        const rows: { fecha: string; slots: string[] }[] = await r.json();
        const map: Record<string, Set<string>> = {};
        for (const row of rows) {
          const keep = showPast
            ? row.slots
            : row.slots.filter((hhmm) => !isPastDateTime(row.fecha, hhmm));
          if (keep.length) map[row.fecha] = new Set(keep);
        }
        setTakenMap(map);
      } catch {
        setTakenMap({});
      }
    })();
  }, [weekMondayISO, showPast]);

  /* ===== Carga mis turnos de la semana ===== */
  useEffect(() => {
    if (!token) { setMyAppointments({}); return; }
    const from = weekMondayISO;
    const to = addDaysISO(weekMondayISO, 4);
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) { setMyAppointments({}); return; }
        const rows: ApiAppointment[] = await r.json();
        const map: Record<string, string> = {};
        for (const appt of rows) {
          if (!showPast && isPastDateTime(appt.fecha, appt.inicio)) continue;
          map[`${appt.fecha}|${appt.inicio}`] = appt._id;
        }
        setMyAppointments(map);
      } catch {
        setMyAppointments({});
      }
    })();
  }, [token, weekMondayISO, showPast]);

  /* ===== Acciones ===== */
  function onPrevWeek() {
    const prev = addDaysISO(weekMondayISO, -7);
    if (prev < currentMondayISO) return;
    setWeekMondayISO(prev);
    setEditingKey(null);
    setNotaTmp("");
  }
  function onNextWeek() {
    const next = addDaysISO(weekMondayISO, 7);
    setWeekMondayISO(next);
    setEditingKey(null);
    setNotaTmp("");
  }
  function clickReserve(iso: string, slot: string) {
    if (!token) { alert("Debes iniciar sesión para poder sacar un turno."); return; }
    const key = `${iso}|${slot}`;
    setEditingKey(key);
    setNotaTmp("");
  }
  async function confirmReserve(iso: string, slot: string) {
    if (!token) { alert("Debes iniciar sesión para poder sacar un turno."); return; }
    if (isPastDateTime(iso, slot)) return;

    try {
      const r = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fecha: iso, inicio: slot, paciente: user || "usuario", motivo, notas: notaTmp || undefined }),
      });
      if (!r.ok) { alert(`Error al reservar: ${await r.text()}`); return; }

      setEditingKey(null); setNotaTmp("");

      const from = weekMondayISO, to = addDaysISO(weekMondayISO, 4);
      const [rt, rm] = await Promise.all([
        fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`),
        fetch(`${API}/api/appointments?from=${from}&to=${to}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (rt.ok) {
        const rows: { fecha: string; slots: string[] }[] = await rt.json();
        const map: Record<string, Set<string>> = {};
        for (const row of rows) {
          const keep = showPast ? row.slots : row.slots.filter((s) => !isPastDateTime(row.fecha, s));
          if (keep.length) map[row.fecha] = new Set(keep);
        }
        setTakenMap(map);
      }
      if (rm.ok) {
        const rows: ApiAppointment[] = await rm.json();
        const mine: Record<string, string> = {};
        for (const appt of rows) {
          if (!showPast && isPastDateTime(appt.fecha, appt.inicio)) continue;
          mine[`${appt.fecha}|${appt.inicio}`] = appt._id;
        }
        setMyAppointments(mine);
      }
    } catch { alert("No se pudo conectar para reservar."); }
  }
  async function cancelMine(iso: string, slot: string) {
    if (!token) return;
    const key = `${iso}|${slot}`;
    const id = myAppointments[key];
    if (!id) return;
    try {
      const r = await fetch(`${API}/api/appointments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) { alert(`No se pudo cancelar: ${await r.text()}`); return; }

      setMyAppointments((prev) => { const n = { ...prev }; delete n[key]; return n; });
      setTakenMap((prev) => {
        const n = { ...prev };
        const set = new Set(n[iso] || []);
        set.delete(slot);
        if (set.size) n[iso] = set; else delete n[iso];
        return n;
      });
      if (editingKey === key) { setEditingKey(null); setNotaTmp(""); }
    } catch { alert("Error de conexión al cancelar."); }
  }

  /* ===== Render ===== */
  const weekLabel = formatWeekRange(weekMondayISO);
  const prevDisabled = addDaysISO(weekMondayISO, -7) < currentMondayISO;
  const todayISO = toISODate(today);

  return (
    <div className={styles.bg}>
      <div className={styles.cont}>
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Agenda semanal</div>
            <div className={styles.weekRange}>{weekLabel}</div>
          </div>

          <div className={styles.headerRight}>
            <select className={styles.select} value={motivo} onChange={(e) => setMotivo(e.target.value as Motivo)}>
              <option value="consulta">Consulta</option>
              <option value="control">Control</option>
              <option value="plan">Plan</option>
              <option value="otro">Otro</option>
            </select>

            <button
              type="button"
              className={`${styles.navBtn} ${prevDisabled ? styles.navBtnDisabled : ""}`}
              onClick={onPrevWeek}
              disabled={prevDisabled}
              aria-disabled={prevDisabled}
              title={prevDisabled ? "No puedes ir a semanas pasadas" : "Semana previa"}
            >
              ← Semana previa
            </button>

            <button type="button" className={styles.navBtn} onClick={onNextWeek}>
              Semana siguiente →
            </button>

            <button
              type="button"
              className={styles.togglePast}
              aria-pressed={showPast}
              onClick={() => setShowPast(v => !v)}
              title={showPast ? "Ocultar pasados" : "Mostrar pasados"}
            >
              {showPast ? "Ocultar pasados" : "Mostrar pasados"}
            </button>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.grid}>
            {daysISO.map((iso) => {
              const dayIsPast = isPastDay(iso);
              const isToday = iso === todayISO;
              const daySlots = showPast
                ? SLOTS
                : SLOTS.filter((slot) => !(isToday && isPastDateTime(iso, slot)));

              return (
                <div key={iso} className={`${styles.dayCol} ${dayIsPast ? styles.pastDay : ""}`}>
                  <div className={styles.dayHeader}>
                    <span>
                      {new Date(iso).toLocaleDateString(undefined, {
                        weekday: "long", day: "2-digit", month: "2-digit",
                      })}
                    </span>
                    {dayIsPast && <span className={styles.pastBadge}>Pasado</span>}
                  </div>

                  {daySlots.map((slot) => {
                    const key = `${iso}|${slot}`;
                    const isMine = !!myAppointments[key];
                    const isTaken = (takenMap[iso]?.has(slot) ?? false) && !isMine;
                    const past = isPastDateTime(iso, slot);

                    return (
                      <div
                        key={key}
                        className={`${styles.hourRow} ${past ? styles.pastSlot : ""} ${isTaken ? styles.occupied : ""}`}
                      >
                        <div className={styles.hourLeft}>{slot}</div>

                        <div className={styles.hourRight}>
                          {isMine ? (
                            <button type="button" className={styles.cancelBtn} onClick={() => cancelMine(iso, slot)}>
                              Cancelar
                            </button>
                          ) : isTaken ? (
                            <span>Ocupado</span>
                          ) : (
                            <button
                              type="button"
                              className={styles.reserveBtn}
                              onClick={() => !past && clickReserve(iso, slot)}
                              disabled={past}
                              title={past ? "Horario pasado" : "Reservar"}
                            >
                              Reservar
                            </button>
                          )}
                        </div>

                        <div className={styles.noteSpace}>
                          {editingKey === key && !isTaken && !isMine && !past && (
                            <>
                              <input
                                className={styles.noteInput}
                                maxLength={15}
                                placeholder="Notas (máx. 15)"
                                value={notaTmp}
                                onChange={(e) => setNotaTmp(e.target.value)}
                              />
                              <div className={styles.noteHelp}>
                                Máximo 15 caracteres.
                                <button
                                  type="button"
                                  style={{ marginLeft: 8, height: 28, padding: "0 10px", borderRadius: 8, border: "1px solid #ec4899", background: "#ec4899", color: "#fff", cursor: "pointer" }}
                                  onClick={() => confirmReserve(iso, slot)}
                                >
                                  Confirmar
                                </button>
                                <button
                                  type="button"
                                  style={{ marginLeft: 6, height: 28, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer" }}
                                  onClick={() => { setEditingKey(null); setNotaTmp(""); }}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
