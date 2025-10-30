import React from "react";
import styles from "./Agenda.module.css";

import type { Motivo } from "../../components/AgendaComponente/AgendaComponente";
import {
  useAgenda,
} from "../../components/AgendaComponente/AgendaComponente";

export default function Agenda(): React.ReactElement {
  const {
    weekDays, motivo, setMotivo,
    SLOTS, addOneHour,
    isTaken, isPastSlot, mineAt,
    startReservar, cancelReservar, confirmReservar,
    isEditing, nota, setNota,
    cancelar,
    nextWeek, prevWeek, prevDisabled,
    localDateFromISO,
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

        {/* Header con alineación uniforme en Y */}
        <div className={`${styles.panel} ${styles.header}`}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Agenda semanal</div>
            <div className={styles.weekRange}>{rango}</div>
          </div>
          <div className={styles.headerRight}>
            <select
              className={`${styles.btnSized} ${styles.select}`}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as Motivo)}
              title="Motivo"
            >
              <option value="consulta">Consulta</option>
              <option value="control">Control</option>
              <option value="plan">Plan</option>
              <option value="otro">Otro</option>
            </select>

            <button
              className={styles.btn}
              type="button"
              onClick={prevWeek}
              disabled={prevDisabled}
              title={prevDisabled ? "No podés ir a semanas pasadas" : "Semana previa"}
            >
              ⟵ Semana previa
            </button>
            <button className={styles.btn} type="button" onClick={nextWeek}>
              Semana siguiente ⟶
            </button>
          </div>
        </div>

        <div className={`${styles.panel} ${styles.gridWrap}`}>
          <div className={styles.gridWeek}>
            {weekDays.map((dia) => (
              <div key={dia} className={styles.col}>
                <div className={styles.colHead}>
                  {localDateFromISO(dia).toLocaleDateString(undefined, {
                    weekday: "long", day: "2-digit", month: "2-digit"
                  })}
                </div>

                <div className={styles.tableDay}>
                  {SLOTS.map((hora) => {
                    const mine = mineAt(dia, hora);
                    const taken = isTaken(dia, hora);
                    const past  = isPastSlot(dia, hora);
                    const editing = isEditing(dia, hora);

                    return (
                      <div key={hora} className={styles.rowSlot}>
                        {/* Fila superior: hora a la izquierda, acción a la derecha */}
                        <div className={styles.slotRow}>
                          <div className={styles.slotHour}>
                            {hora}–{addOneHour(hora)}
                          </div>

                          <div className={styles.slotAction}>
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
                            ) : past ? (
                              <div className={styles.cellPast}>Pasado</div>
                            ) : taken ? (
                              <div className={styles.cellBusy}>Ocupado</div>
                            ) : editing ? (
                              <div className={styles.cellEditing}>Reservando…</div>
                            ) : (
                              <button
                                className={styles.btnPrimary}
                                type="button"
                                onClick={() => startReservar(dia, hora)}
                              >
                                Reservar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Segunda fila: notas SIEMPRE visibles debajo */}
                        <div className={styles.noteRow}>
                          <input
                            className={styles.inputNote}
                            placeholder="Notas (máx 15)"
                            value={editing ? nota : (mine?.notas ?? "")}
                            onChange={(e) => editing ? setNota(e.target.value.slice(0,15)) : undefined}
                            maxLength={15}
                            disabled={!editing}
                          />
                          {editing && (
                            <div className={styles.editButtons}>
                              <button className={styles.btnPrimary} type="button" onClick={confirmReservar}>
                                Confirmar
                              </button>
                              <button className={styles.btn} type="button" onClick={cancelReservar}>
                                Cancelar
                              </button>
                            </div>
                          )}
                        </div>
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
