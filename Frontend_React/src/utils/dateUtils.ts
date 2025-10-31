// src/utils/dateUtils.ts

/* ===== Utilitarios base ===== */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/* YYYY-MM-DD de hoy */
export const hoyISO = (): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

/* Suma/días a un ISO (conserva medianoche local) */
export const addDays = (iso: string, delta: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  dt.setHours(0, 0, 0, 0);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};

/* Alias con el nombre que usa el componente */
export const addDaysISO = addDays;

/* Date local desde ISO */
export const localDateFromISO = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/* Lunes de la semana de un ISO */
export const weekMonday = (iso: string): string => {
  const dt = localDateFromISO(iso);
  const wd = dt.getDay();                // 0..6 (0=Dom)
  const offset = wd === 0 ? -6 : 1 - wd; // llevar a lunes
  return addDays(iso, offset);
};

/* Lunes -> Viernes */
export const monToFri = (weekMonISO: string): string[] =>
  [0, 1, 2, 3, 4].map((n) => addDays(weekMonISO, n));

/* ===== Nombres extra ===== */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();                 // 0..6
  const diff = day === 0 ? -6 : 1 - day;  // mover a lunes
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function formatWeekRange(mondayISO: string): string {
  const end = addDays(mondayISO, 4);
  return `${mondayISO} — ${end}`;
}

/* ===== Slots y tiempo ===== */

/* Horas en punto 09:00..18:00 */
export const SLOTS = [
  "09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00",
];

/* Suma una hora a HH:mm */
export const addOneHour = (hhmm: string): string => {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0, 0, 1, hh, mm);
  end.setHours(end.getHours() + 1);
  return `${pad2(end.getHours())}:${pad2(end.getMinutes())}`;
};

/* ¿Fecha/hora en pasado? */
export const isPastSlot = (fecha: string, hora: string): boolean => {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime() <= Date.now();
};

/* Alias */
export const isPastDateTime = isPastSlot;
