export type Motivo = "consulta" | "control" | "plan" | "otro";

export const hoyISO = (): string => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

export const addDays = (iso: string, delta: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return dt.toISOString().split("T")[0];
};

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

export const SLOTS = Array.from({ length: 10 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);

export const addOneHour = (hhmm: string): string => {
  const [hh, mm] = hhmm.split(":").map(Number);
  const end = new Date(0, 0, 1, hh + 1, mm);
  return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
};

export const isPastSlot = (fecha: string, hora: string): boolean => {
  const [y, m, d] = fecha.split("-").map(Number);
  const [hh, mm] = hora.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm).getTime() <= Date.now();
};
