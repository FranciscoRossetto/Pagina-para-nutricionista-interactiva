// src/pages/Agenda/Agenda.tsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Agenda.module.css";
import { useUser } from "../../contexts/UserContext";
import { API } from "../../config/api";


const SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00"];

/*fechas*/
const pad2 = (n: number) => String(n).padStart(2, "0");

function toISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysISO(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return toISODate(dt);
}

function startOfMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay(); // 0..6  (0=Domingo)
  const diff = day === 0 ? -6 : 1 - day; // mueve a lunes
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

/*motivos*/
type Motivo = "consulta" | "control" | "plan" | "otro";
type ApiAppointment = {
  _id: string;
  fecha: string;
  inicio: string;
  fin: string;
  motivo: Motivo;
  notas?: string;
};

/*component*/
export default function Agenda(): React.ReactElement {
  const { token, user } = useUser();

  // estado d semana y navegación
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const currentMondayISO = useMemo(() => toISODate(startOfMonday(today)), [today]);

  const [weekMondayISO, setWeekMondayISO] = useState<string>(currentMondayISO);
  const [motivo, setMotivo] = useState<Motivo>("consulta");

  // ocupación d la semana
  const [takenMap, setTakenMap] = useState<Record<string, Set<string>>>({});

  const [myAppointments, setMyAppointments] = useState<Record<string, string>>({}); 

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [notaTmp, setNotaTmp] = useState<string>("");

  // días L–V visibles
  const daysISO = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < 5; i++) out.push(addDaysISO(weekMondayISO, i));
    return out;
  }, [weekMondayISO]);

  useEffect(() => {
    const from = weekMondayISO;
    const to = addDaysISO(weekMondayISO, 4);
    (async () => {
      try {
        const r = await fetch(`${API}/appointments/taken?from=${from}&to=${to}`);
        if (!r.ok) throw new Error(await r.text());
        const rows: { fecha: string; slots: string[] }[] = await r.json();
        const map: Record<string, Set<string>> = {};
        for (const row of rows) map[row.fecha] = new Set(row.slots);
        setTakenMap(map);
      } catch {
        setTakenMap({});
      }
    })();
  }, [weekMondayISO]);

  /*carga mis turnos de la semana*/
  useEffect(() => {
    if (!token) {
      setMyAppointments({});
      return;
    }
    const from = weekMondayISO;
    const to = addDaysISO(weekMondayISO, 4);
    (async () => {
      try {
        const r = await fetch(`${API}/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) {
          setMyAppointments({});
          return;
        }
        const rows: ApiAppointment[] = await r.json();
        const map: Record<string, string> = {};
        for (const appt of rows) {
          map[`${appt.fecha}|${appt.inicio}`] = appt._id;
        }
        setMyAppointments(map);
      } catch {
        setMyAppointments({});
      }
    })();
  }, [token, weekMondayISO]);

  /*Acciones*/
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
    if (!token) {
      alert("Debes iniciar sesión para poder sacar un turno.");
      return;
    }
    const key = `${iso}|${slot}`;
    setEditingKey(key);
    setNotaTmp("");
  }

  async function confirmReserve(iso: string, slot: string) {
    if (!token) {
      alert("Debes iniciar sesión para poder sacar un turno.");
      return;
    }
    if (isPastDateTime(iso, slot)) return;

    try {
      const r = await fetch(`${API}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fecha: iso,
          inicio: slot,
          paciente: user || "usuario",
          motivo,
          notas: notaTmp || undefined,
        }),
      });
      if (!r.ok) {
        const msg = await r.text();
        alert(`Error al reservar: ${msg}`);
        return;
      }
      setEditingKey(null);
      setNotaTmp("");
      // recargar datos de la semana
      const from = weekMondayISO;
      const to = addDaysISO(weekMondayISO, 4);
      {
        const rt = await fetch(`${API}/appointments/taken?from=${from}&to=${to}`);
        if (rt.ok) {
          const rows: { fecha: string; slots: string[] }[] = await rt.json();
          const map: Record<string, Set<string>> = {};
          for (const row of rows) map[row.fecha] = new Set(row.slots);
          setTakenMap(map);
        }
      }
      {
        const rm = await fetch(`${API}/appointments?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (rm.ok) {
          const rows: ApiAppointment[] = await rm.json();
          const map: Record<string, string> = {};
          for (const appt of rows) map[`${appt.fecha}|${appt.inicio}`] = appt._id;
          setMyAppointments(map);
        }
      }
    } catch {
      alert("No se pudo conectar para reservar.");
    }
  }

  async function cancelMine(iso: string, slot: string) {
    if (!token) return;
    const key = `${iso}|${slot}`;
    const id = myAppointments[key];
    if (!id) return;
    try {
      const r = await fetch(`${API}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) {
        const msg = await r.text();
        alert(`No se pudo cancelar: ${msg}`);
        return;
      }
      // actualiza estado local
      setMyAppointments((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
      setTakenMap((prev) => {
        const n = { ...prev };
        const set = new Set(n[iso] || []);
        set.delete(slot);
        n[iso] = set;
        return n;
      });
      if (editingKey === key) {
        setEditingKey(null);
        setNotaTmp("");
      }
    } catch {
      alert("Error de conexión al cancelar.");
    }
  }

  /*render*/
  const weekLabel = formatWeekRange(weekMondayISO);
  const prevDisabled = addDaysISO(weekMondayISO, -7) < currentMondayISO;

  return (
    <div className={styles.bg}>
      <div className={styles.cont}>
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Agenda semanal</div>
            <div className={styles.weekRange}>{weekLabel}</div>
          </div>

          <div className={styles.headerRight}>
            <select
              className={styles.select}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as Motivo)}
            >
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
          </div>
        </div>

        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.grid}>
            {daysISO.map((iso) => (
              <div key={iso} className={styles.dayCol}>
                <div className={styles.dayHeader}>
                  <span>
                    {new Date(iso).toLocaleDateString(undefined, {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>

                {SLOTS.map((slot) => {
                  const key = `${iso}|${slot}`;
                  const isMine = !!myAppointments[key];
                  const isTaken = (takenMap[iso]?.has(slot) ?? false) && !isMine;
                  const past = isPastDateTime(iso, slot);

                  return (
                    <div
                      key={key}
                      className={`${styles.hourRow} ${past ? styles.pastSlot : ""} ${isTaken ? styles.occupied : ""
                        }`}
                    >
                      <div className={styles.hourLeft}>{slot}</div>

                      <div className={styles.hourRight}>
                        {isMine ? (
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => cancelMine(iso, slot)}
                          >
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

                      {/*notas*/}
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
                                style={{
                                  marginLeft: 8,
                                  height: 28,
                                  padding: "0 10px",
                                  borderRadius: 8,
                                  border: "1px solid #ec4899",
                                  background: "#ec4899",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                                onClick={() => confirmReserve(iso, slot)}
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                style={{
                                  marginLeft: 6,
                                  height: 28,
                                  padding: "0 10px",
                                  borderRadius: 8,
                                  border: "1px solid #e5e7eb",
                                  background: "#fff",
                                  color: "#374151",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setEditingKey(null);
                                  setNotaTmp("");
                                }}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
