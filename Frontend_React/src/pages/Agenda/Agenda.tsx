import React from "react";
import styles from "./Agenda.module.css";

import type { Motivo } from "../../components/AgendaComponente/AgendaComponente";
import {
  useAgenda,
  addOneHour,
  formatearCabeceraDia,
  hoyISO,
} from "../../components/AgendaComponente/AgendaComponente";

export default function Agenda(): React.ReactElement {
  const {
    form, weekDays, turnosVista, filtroPaciente,
    setFiltroPaciente, onChange, crearTurno, borrarTurno,
    disponiblesPara, seleccionarSlot, nextWeek, prevWeek,
  } = useAgenda();

  const tagClass = (m: Motivo) =>
    m === "consulta" ? styles.tag + " " + styles.tagConsulta :
    m === "control"  ? styles.tag + " " + styles.tagControl  :
    m === "plan"     ? styles.tag + " " + styles.tagPlan     :
                       styles.tag + " " + styles.tagOtro;

  const rango = weekDays.length
    ? `${weekDays[0]} → ${weekDays[weekDays.length-1]}`
    : "";

  return (
    <div className={styles.bg}>
      <div className={styles.cont}>

        {/* Header */}
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.title}>Agenda de nutrición</div>
          <div>Semana: {rango}</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button className={styles.btn} type="button" onClick={prevWeek}>⟵ Semana previa</button>
            <button className={styles.btn} type="button" onClick={nextWeek}>Semana siguiente ⟶</button>
            <input
              className={styles.input}
              placeholder="Filtrar por paciente"
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
            />
          </div>
        </div>

        {/* Formulario */}
        <div className={styles.panel}>
          <form className={styles.form} onSubmit={crearTurno}>
            <input
              className={styles.input}
              type="date"
              min={hoyISO()}
              value={form.fecha}
              onChange={(e) => onChange("fecha", e.target.value)}
            />
            <select
              className={styles.select}
              value={form.inicio}
              onChange={(e) => onChange("inicio", e.target.value)}
            >
              { (disponiblesPara(form.fecha)).map((s) => (
                <option key={s} value={s}>{`${s} a ${addOneHour(s)}`}</option>
              ))}
            </select>
            <input
              className={styles.input}
              placeholder="Paciente"
              value={form.paciente}
              onChange={(e) => onChange("paciente", e.target.value)}
            />
            <select
              className={styles.select}
              value={form.motivo}
              onChange={(e) => onChange("motivo", e.target.value as any)}
            >
              <option value="consulta">Consulta</option>
              <option value="control">Control</option>
              <option value="plan">Plan</option>
              <option value="otro">Otro</option>
            </select>
            <input
              className={styles.input}
              placeholder="Notas (opcional)"
              value={form.notas}
              onChange={(e) => onChange("notas", e.target.value)}
            />
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className={styles.btnPrimary} type="submit">Agregar turno</button>
            </div>
          </form>
        </div>

        {/* Semana actual con slots ocupados/libres */}
        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.gridWeek}>
            {weekDays.map((dia) => (
              <div key={dia} className={styles.col}>
                <div className={styles.colHead}>{formatearCabeceraDia(dia)}</div>

                {/* Chips de slots: ocupado vs libre */}
                <div className={styles.slotWrap}>
                  {disponiblesPara(dia).length === 0 && (
                    <span className={styles.slotBusy} title="Sin disponibilidad">Sin disponibilidad</span>
                  )}
                  {disponiblesPara(dia).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.slotFree}
                      title={`${s} - ${addOneHour(s)}`}
                      onClick={() => seleccionarSlot(dia, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Mis turnos del día */}
                {turnosVista
                  .filter((t) => t.fecha === dia)
                  .map((t) => (
                    <div key={t.id} className={styles.card}>
                      <div className={styles.row}>
                        <span className={styles.time}>{`${t.inicio}–${t.fin}`}</span>
                        <span className={tagClass(t.motivo as Motivo)}>{t.motivo}</span>
                      </div>
                      <div>{t.paciente}</div>
                      {t.notas ? <div className={styles.notes}>{t.notas}</div> : null}
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <button
                          className={styles.btn}
                          type="button"
                          onClick={() => borrarTurno(t.id)}
                          style={{ borderColor: "#ef4444", color: "#ef4444" }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
