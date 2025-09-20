export const Agenda = () => {
  const horarios = ["09:00", "10:00", "11:00", "14:00", "15:00"];

  return (
    <ul>
      {horarios.map(h => (
        <li key={h}>
          {h} <button>Reservar</button>
        </li>
      ))}
    </ul>
  );
};
