import React from "react";
import styles from "./Agenda.module.css";

import type { Motivo } from "../../components/AgendaComponente/AgendaComponente.tsx";

import {
  useAgenda,
  SLOTS,
  addOneHour,
  formatearCabeceraDia,
  hoyISO,
} from "../../components/AgendaComponente/AgendaComponente.tsx";

export default function Agenda(): React.ReactElement {
  const {
    form, diasVista, turnosVista, filtroPaciente,
    setFiltroPaciente, onChange, crearTurno, borrarTurno,
  } = useAgenda();

  const tagClass = (m: Motivo) =>
    m === "consulta" ? styles.tag + " " + styles.tagConsulta :
    m === "control"  ? styles.tag + " " + styles.tagControl  :
    m === "plan"     ? styles.tag + " " + styles.tagPlan     :
                       styles.tag + " " + styles.tagOtro;

  return (
    <div className={styles.bg}>
      <div className={styles.cont}>

        {/* Header */}
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.title}>Agenda de nutrición</div>
          <div>Próximos 15 días hábiles</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
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
              {SLOTS.map((s) => (
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

        {/* Agenda 15 días hábiles */}
        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.grid}>
            {diasVista.map((dia) => (
              <div key={dia} className={styles.col}>
                <div className={styles.colHead}>{formatearCabeceraDia(dia)}</div>
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
