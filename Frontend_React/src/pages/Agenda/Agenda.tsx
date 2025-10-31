// src/pages/Agenda/Agenda.tsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./Agenda.module.css";
import { useUser } from "../../contexts/UserContext";

/* ===== Config ===== */
const API = "http://localhost:4000";
const SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

<<<<<<< HEAD
/* ===== Helpers seguros (sin UTC) ===== */
=======
<<<<<<< HEAD
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
=======
/* ===== Helpers de fecha (robustos a huso/UTC) ===== */
>>>>>>> f5da8251bd1dabf191e27a5dc497dab90a7b22dd
const pad2 = (n:number) => String(n).padStart(2,"0");
const toISODate = (d:Date) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;

/* parse local de 'YYYY-MM-DD' */
function localDateFromISO(iso:string): Date {
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d, 0, 0, 0, 0); // local
}

function addDaysISO(iso:string, delta:number):string {
  const dt = localDateFromISO(iso);
  dt.setDate(dt.getDate()+delta);
<<<<<<< HEAD
=======
  dt.setHours(0,0,0,0);
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
>>>>>>> f5da8251bd1dabf191e27a5dc497dab90a7b22dd
  return toISODate(dt);
}
function startOfMonday(d:Date):Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
<<<<<<< HEAD
  const day = x.getDay();              // 0=Dom
=======
<<<<<<< HEAD
  const day = x.getDay(); // 0..6  (0=Domingo)
  const diff = day === 0 ? -6 : 1 - day; // mueve a lunes
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
=======
  const day = x.getDay();             // 0=Dom
>>>>>>> f5da8251bd1dabf191e27a5dc497dab90a7b22dd
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate()+diff);
  x.setHours(0,0,0,0);
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
  return x;
}
function formatWeekRange(mondayISO:string){ return `${mondayISO} — ${addDaysISO(mondayISO,4)}`; }

/* comparaciones por fecha pura */
function hoyISO(): string {
  const n = new Date(); n.setHours(0,0,0,0);
  return toISODate(n);
}
function isPastDay(iso:string, todayISO:string){ return iso < todayISO; }
function nowHHMM():string {
  const n = new Date();
  return `${pad2(n.getHours())}:${pad2(n.getMinutes())}`;
}
function isPastDateTime(iso:string, hhmm:string, todayISO:string):boolean {
  if (iso < todayISO) return true;
  if (iso > todayISO) return false;
  return hhmm <= nowHHMM();
}
/* label local sin UTC */
function labelFromISO(iso:string): string {
  const d = localDateFromISO(iso);
  return d.toLocaleDateString(undefined, { weekday:"long", day:"2-digit", month:"2-digit" });
}

/*motivos*/
type Motivo = "consulta" | "control" | "plan" | "otro";
type ApiAppointment = { _id:string; fecha:string; inicio:string; fin:string; motivo:Motivo; notas?:string };

/*component*/
export default function Agenda(): React.ReactElement {
  const { token, user } = useUser();

<<<<<<< HEAD
  const currentMondayISO = useMemo(() => toISODate(startOfMonday(new Date())), []);
=======
<<<<<<< HEAD
  // estado d semana y navegación
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
=======
  const today = useMemo(() => { const d=new Date(); d.setHours(0,0,0,0); return d; }, []);
  const todayISO = useMemo(() => toISODate(new Date()), []); // solo fecha de “hoy”
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
  const currentMondayISO = useMemo(() => toISODate(startOfMonday(today)), [today]);

>>>>>>> f5da8251bd1dabf191e27a5dc497dab90a7b22dd
  const [weekMondayISO, setWeekMondayISO] = useState<string>(currentMondayISO);
  const [motivo, setMotivo] = useState<Motivo>("consulta");
  const [showPast, setShowPast] = useState(false);

<<<<<<< HEAD
  // ocupación d la semana
  const [takenMap, setTakenMap] = useState<Record<string, Set<string>>>({});

  const [myAppointments, setMyAppointments] = useState<Record<string, string>>({}); 

  const [editingKey, setEditingKey] = useState<string | null>(null);
=======
  const [takenMap, setTakenMap] = useState<Record<string, Set<string>>>({});
  const [myAppointments, setMyAppointments] = useState<Record<string,string>>({});
  const [editingKey, setEditingKey] = useState<string|null>(null);
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
  const [notaTmp, setNotaTmp] = useState<string>("");

  const todayISO = useMemo(() => hoyISO(), []);

  /* L–V base */
  const baseDaysISO = useMemo(() => Array.from({length:5},(_,i)=>addDaysISO(weekMondayISO,i)), [weekMondayISO]);

  /* Días visibles */
  const daysISO = useMemo(
    () => showPast ? baseDaysISO : baseDaysISO.filter(iso => !isPastDay(iso, todayISO)),
    [baseDaysISO, showPast, todayISO]
  );

  useEffect(() => {
    const from = weekMondayISO, to = addDaysISO(weekMondayISO,4);
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`);
        if (!r.ok) throw new Error(await r.text());
        const rows: { fecha:string; slots:string[] }[] = await r.json();
        const map: Record<string, Set<string>> = {};
        for (const row of rows) {
          const keep = showPast
            ? row.slots
            : row.slots.filter((s) => !isPastDateTime(row.fecha, s, todayISO));
          if (keep.length) map[row.fecha] = new Set(keep);
        }
        setTakenMap(map);
      } catch { setTakenMap({}); }
    })();
  }, [weekMondayISO, showPast, todayISO]);

<<<<<<< HEAD
  /*carga mis turnos de la semana*/
=======
  /* ===== Carga mis turnos ===== */
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
  useEffect(() => {
    if (!token) { setMyAppointments({}); return; }
    const from = weekMondayISO, to = addDaysISO(weekMondayISO,4);
    (async () => {
      try {
        const r = await fetch(`${API}/api/appointments?from=${from}&to=${to}`, { headers:{ Authorization:`Bearer ${token}` } });
        if (!r.ok) { setMyAppointments({}); return; }
        const rows: ApiAppointment[] = await r.json();
        const map: Record<string,string> = {};
        for (const appt of rows) {
          if (!showPast && isPastDateTime(appt.fecha, appt.inicio, todayISO)) continue;
          map[`${appt.fecha}|${appt.inicio}`] = appt._id;
        }
        setMyAppointments(map);
      } catch { setMyAppointments({}); }
    })();
  }, [token, weekMondayISO, showPast, todayISO]);

<<<<<<< HEAD
  /*Acciones*/
  function onPrevWeek() {
    const prev = addDaysISO(weekMondayISO, -7);
    if (prev < currentMondayISO) return;
    setWeekMondayISO(prev);
    setEditingKey(null);
    setNotaTmp("");
=======
  /* ===== Acciones ===== */
  function onPrevWeek(){
    const prev = addDaysISO(weekMondayISO,-7);
    if (prev < currentMondayISO) return;
    setWeekMondayISO(prev); setEditingKey(null); setNotaTmp("");
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
  }
  function onNextWeek(){
    setWeekMondayISO(addDaysISO(weekMondayISO,7)); setEditingKey(null); setNotaTmp("");
  }
  function clickReserve(iso:string, slot:string){
    if (!token) { alert("Debes iniciar sesión para poder sacar un turno."); return; }
    setEditingKey(`${iso}|${slot}`); setNotaTmp("");
  }
  async function confirmReserve(iso:string, slot:string){
    if (!token) { alert("Debes iniciar sesión para poder sacar un turno."); return; }
    if (isPastDateTime(iso, slot, todayISO)) return;
    try {
      const r = await fetch(`${API}/api/appointments`, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ fecha: iso, inicio: slot, paciente: user || "usuario", motivo, notas: notaTmp || undefined }),
      });
<<<<<<< HEAD
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
=======
      if (!r.ok) { alert(`Error al reservar: ${await r.text()}`); return; }
      setEditingKey(null); setNotaTmp("");
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98

      const from = weekMondayISO, to = addDaysISO(weekMondayISO,4);
      const [rt, rm] = await Promise.all([
        fetch(`${API}/api/appointments/taken?from=${from}&to=${to}`),
        fetch(`${API}/api/appointments?from=${from}&to=${to}`, { headers:{ Authorization:`Bearer ${token}` } }),
      ]);
      if (rt.ok){
        const rows: { fecha:string; slots:string[] }[] = await rt.json();
        const map: Record<string, Set<string>> = {};
        for (const row of rows){
          const keep = showPast ? row.slots : row.slots.filter((s)=>!isPastDateTime(row.fecha,s,todayISO));
          if (keep.length) map[row.fecha] = new Set(keep);
        }
        setTakenMap(map);
      }
      if (rm.ok){
        const rows: ApiAppointment[] = await rm.json();
        const mine: Record<string,string> = {};
        for (const appt of rows){
          if (!showPast && isPastDateTime(appt.fecha, appt.inicio, todayISO)) continue;
          mine[`${appt.fecha}|${appt.inicio}`] = appt._id;
        }
        setMyAppointments(mine);
      }
    } catch { alert("No se pudo conectar para reservar."); }
  }
  async function cancelMine(iso:string, slot:string){
    if (!token) return;
    const id = myAppointments[`${iso}|${slot}`];
    if (!id) return;
    try{
      const r = await fetch(`${API}/api/appointments/${id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token}` } });
      if (!r.ok) { alert(`No se pudo cancelar: ${await r.text()}`); return; }
      setMyAppointments(prev => { const n={...prev}; delete n[`${iso}|${slot}`]; return n; });
      setTakenMap(prev => {
        const n={...prev}; const s=new Set(n[iso]||[]);
        s.delete(slot); if (s.size) n[iso]=s; else delete n[iso]; return n;
      });
<<<<<<< HEAD
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
=======
      if (editingKey === `${iso}|${slot}`){ setEditingKey(null); setNotaTmp(""); }
    } catch { alert("Error de conexión al cancelar."); }
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
  }

  /*render*/
  const weekLabel = formatWeekRange(weekMondayISO);
  const prevDisabled = addDaysISO(weekMondayISO,-7) < currentMondayISO;

  return (
    <div className={styles.bg}>
      <div className={styles.cont}>
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Agenda semanal</div>
            <div className={styles.weekRange}>{weekLabel}</div>
          </div>

          <div className={styles.headerRight}>
            <select className={styles.select} value={motivo} onChange={(e)=>setMotivo(e.target.value as Motivo)}>
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
              onClick={()=>setShowPast(v=>!v)}
              title={showPast ? "Ocultar pasados" : "Mostrar pasados"}
            >
              {showPast ? "Ocultar pasados" : "Mostrar pasados"}
            </button>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.grid}>
            {daysISO.map((iso) => {
              const dayIsPast = isPastDay(iso, todayISO);
              const isToday = iso === todayISO;
              const daySlots = showPast ? SLOTS : SLOTS.filter(s => !(isToday && isPastDateTime(iso, s, todayISO)));

              return (
                <div key={iso} className={`${styles.dayCol} ${dayIsPast ? styles.pastDay : ""}`}>
                  <div className={styles.dayHeader}>
                    <span>{labelFromISO(iso)}</span>
                    {dayIsPast && <span className={styles.pastBadge}>Pasado</span>}
                  </div>

                  {daySlots.map((slot) => {
                    const key = `${iso}|${slot}`;
                    const isMine = !!myAppointments[key];
                    const isTaken = (takenMap[iso]?.has(slot) ?? false) && !isMine;
                    const past = isPastDateTime(iso, slot, todayISO);

                    return (
                      <div key={key} className={`${styles.hourRow} ${past ? styles.pastSlot : ""} ${isTaken ? styles.occupied : ""}`}>
                        <div className={styles.hourLeft}>{slot}</div>

                        <div className={styles.hourRight}>
                          {isMine ? (
                            <button type="button" className={styles.cancelBtn} onClick={()=>cancelMine(iso, slot)}>Cancelar</button>
                          ) : isTaken ? (
                            <span>Ocupado</span>
                          ) : (
                            <button
                              type="button"
                              className={styles.reserveBtn}
                              onClick={()=>!past && clickReserve(iso, slot)}
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
                                onChange={(e)=>setNotaTmp(e.target.value)}
                              />
                              <div className={styles.noteHelp}>
                                Máximo 15 caracteres.
                                <button
                                  type="button"
                                  style={{ marginLeft:8, height:28, padding:"0 10px", borderRadius:8, border:"1px solid #ec4899", background:"#ec4899", color:"#fff", cursor:"pointer" }}
                                  onClick={()=>confirmReserve(iso, slot)}
                                >
                                  Confirmar
                                </button>
                                <button
                                  type="button"
                                  style={{ marginLeft:6, height:28, padding:"0 10px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", color:"#374151", cursor:"pointer" }}
                                  onClick={()=>{ setEditingKey(null); setNotaTmp(""); }}
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
<<<<<<< HEAD

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
=======
              );
            })}
>>>>>>> bb5e0ec2ff4689ff7a668b4faab5e8849822ec98
          </div>
        </div>
      </div>
    </div>
  );
}
