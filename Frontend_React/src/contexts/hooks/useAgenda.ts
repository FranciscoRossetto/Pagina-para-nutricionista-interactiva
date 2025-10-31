import { useMemo, useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { hoyISO, addDays, localDateFromISO, weekMonday, monToFri, SLOTS, addOneHour, isPastSlot } from "../../utils/dateUtils";
import { fetchAppointments, fetchTakenSlots, postAppointment, deleteAppointment } from "../../utils/api";

export type Turno = {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
  paciente: string;
  motivo: string;
  notas?: string;
};

type ApiAppointment = Omit<Turno, "id"> & { _id: string };

export function useAgenda() {
  const { token, user } = useUser();

  const currentWeekStart = weekMonday(hoyISO());
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const weekDays = useMemo(() => monToFri(weekStart), [weekStart]);

  const [motivo, setMotivo] = useState("consulta");
  const [misTurnos, setMisTurnos] = useState<Turno[]>([]);
  const [ocupados, setOcupados] = useState<Record<string, Set<string>>>({});
  const [editSlot, setEditSlot] = useState<{ fecha: string; hora: string } | null>(null);
  const [nota, setNota] = useState("");

  useEffect(() => {
    if (!token || !weekDays.length) return;
    (async () => {
      try {
        const rows: ApiAppointment[] = await fetchAppointments(weekDays[0], weekDays[4], token);
        setMisTurnos(rows.map(a => ({ ...a, id: a._id })));
      } catch { setMisTurnos([]); }
    })();
  }, [token, weekDays.join(",")]);

  useEffect(() => {
    if (!weekDays.length) return;
    (async () => {
      try {
        const data = await fetchTakenSlots(weekDays[0], weekDays[4]);
        const map: Record<string, Set<string>> = {};
        data.forEach((d: { fecha: string; slots: string[] }) => (map[d.fecha] = new Set(d.slots)));
        setOcupados(map);
      } catch { setOcupados({}); }
    })();
  }, [weekDays.join(",")]);

  const isTaken = (fecha: string, hora: string) => ocupados[fecha]?.has(hora) ?? false;
  const mineAt = (fecha: string, hora: string) => misTurnos.find(t => t.fecha === fecha && t.inicio === hora);

  const startReservar = (fecha: string, hora: string) => {
    if (!token) return alert("Debes iniciar sesión.");
    if (isPastSlot(fecha, hora)) return alert("Fecha u hora pasada.");
    if (isTaken(fecha, hora)) return alert("Horario ocupado.");
    setEditSlot({ fecha, hora }); setNota("");
  };
  const cancelReservar = () => setEditSlot(null);

  const confirmReservar = async () => {
    if (!token || !editSlot) return;
    const { fecha, hora } = editSlot;
    try {
      await postAppointment({ fecha, inicio: hora, paciente: user, motivo, notas: nota.slice(0, 15) }, token);
      const [mine, taken] = await Promise.all([
        fetchAppointments(weekDays[0], weekDays[4], token),
        fetchTakenSlots(weekDays[0], weekDays[4]),
      ]);
      setMisTurnos(mine.map((a: ApiAppointment) => ({ ...a, id: a._id })));
      const map: Record<string, Set<string>> = {};
      taken.forEach((d: { fecha: string; slots: string[] }) => (map[d.fecha] = new Set(d.slots)));
      setOcupados(map);
      cancelReservar();
    } catch { alert("No se pudo reservar."); }
  };

  const cancelar = async (id: string) => {
    if (!token) return alert("Iniciá sesión.");
    try {
      await deleteAppointment(id, token);
      setMisTurnos(prev => prev.filter(t => t.id !== id));
      const taken = await fetchTakenSlots(weekDays[0], weekDays[4]);
      const map: Record<string, Set<string>> = {};
      taken.forEach((d: { fecha: string; slots: string[] }) => (map[d.fecha] = new Set(d.slots)));
      setOcupados(map);
    } catch { alert("Error al cancelar."); }
  };

  const nextWeek = () => setWeekStart(prev => addDays(prev, 7));
  const prevWeek = () => setWeekStart(prev => (addDays(prev, -7) < currentWeekStart ? prev : addDays(prev, -7)));
  const prevDisabled = weekStart <= currentWeekStart;
  const isEditing = (fecha: string, hora: string) => !!editSlot && editSlot.fecha === fecha && editSlot.hora === hora;

  return { weekDays, motivo, setMotivo, SLOTS, addOneHour, isTaken, isPastSlot, mineAt, startReservar, cancelReservar, confirmReservar, isEditing, nota, setNota, cancelar, nextWeek, prevWeek, prevDisabled, localDateFromISO };
}
