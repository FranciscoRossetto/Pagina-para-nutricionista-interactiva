// src/utils/dateUtils.ts

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const hoyISO = (): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export const addDays = (iso: string, delta: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  dt.setHours(0, 0, 0, 0);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
};

export const addDaysISO = addDays;

export const localDateFromISO = (iso: string): Date => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const weekMonday = (iso: string): string => {
  const dt = localDateFromISO(iso);
  const wd = dt.getDay();
  const offset = wd === 0 ? -6 : 1 - wd;
  return addDays(iso, offset);
};

export const monToFri = (weekMonISO: string): string[] =>
  [0, 1, 2, 3, 4].map((n) => addDays(weekMonISO, n));

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function formatWeekRange(mondayISO: string): string {
  const end = addDays(mondayISO, 4);
  return `${mondayISO} — ${end}`;
}

export const SLOTS = [
  "09:00","10:00","11:00","12:00","13:00",
  "14:00","15:00","16:00","17:00","18:00",
];

export const addOneHour = (hhmm: string): string => {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0, 0, 1, hh, mm);
  end.setHours(end.getHours() + 1);
  return `${pad2(end.getHours())}:${pad2(end.getMinutes())}`;
};

export const isPastSlot = (fecha: string, hora: string): boolean => {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime() <= Date.now();
};

export const isPastDateTime = isPastSlot;
