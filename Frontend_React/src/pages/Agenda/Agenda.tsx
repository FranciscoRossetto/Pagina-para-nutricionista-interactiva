import React from "react";
import styles from "./Agenda.module.css";

import type { Motivo } from "../../components/AgendaComponente/AgendaComponente";
import {
  useAgenda,
  addOneHour,
} from "../../components/AgendaComponente/AgendaComponente";

export default function Agenda(): React.ReactElement {
  const {
    weekDays, motivo, setMotivo,
    SLOTS, isTaken, mineAt, reservar, cancelar,
    nextWeek, prevWeek,
  } = useAgenda();

  const tagClass = (m: Motivo) =>
    m === "consulta" ? styles.tag + " " + styles.tagConsulta :
    m === "control"  ? styles.tag + " " + styles.tagControl  :
    m === "plan"     ? styles.tag + " " + styles.tagPlan     :
                       styles.tag + " " + styles.tagOtro;

  const rango = weekDays.length ? `${weekDays[0]} → ${weekDays[4]}` : "";

  return (
    <div className={styles.bg}>
      <div className={styles.cont}>

        {/* Header con motivo + paginación semanal */}
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.title}>Agenda semanal</div>
          <div className={styles.weekRange}>{rango}</div>

          <div className={styles.headerRight}>
            <select
              className={styles.select}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as Motivo)}
              title="Motivo del turno"
            >
              <option value="consulta">Consulta</option>
              <option value="control">Control</option>
              <option value="plan">Plan</option>
              <option value="otro">Otro</option>
            </select>

            <button className={styles.btn} type="button" onClick={prevWeek}>⟵ Semana previa</button>
            <button className={styles.btn} type="button" onClick={nextWeek}>Semana siguiente ⟶</button>
          </div>
        </div>

        {/* Grilla L–V. Cada día: “tabla” 1 columna, filas por hora */}
        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.gridWeek}>
            {weekDays.map((dia) => (
              <div key={dia} className={styles.col}>
                <div className={styles.colHead}>
                  {new Date(dia).toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "2-digit" })}
                </div>

                <div className={styles.tableDay}>
                  {SLOTS.map((hora) => {
                    const mine = mineAt(dia, hora);
                    const taken = isTaken(dia, hora);
                    return (
                      <div key={hora} className={styles.rowSlot}>
                        <div className={styles.slotHour}>
                          {hora}–{addOneHour(hora)}
                        </div>

                        {mine ? (
                          <div className={styles.cellMine}>
                            <span className={tagClass(mine.motivo)}>{mine.motivo}</span>
                            <button
                              className={styles.btnDanger}
                              type="button"
                              onClick={() => cancelar(mine.id)}
                              title="Cancelar mi turno"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : taken ? (
                          <div className={styles.cellBusy}>Ocupado</div>
                        ) : (
                          <div>
                            <button
                              className={styles.btnPrimary}
                              type="button"
                              onClick={() => reservar(dia, hora)}
                              title="Reservar este horario"
                            >
                              Reservar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
