import { useState } from "react";

function Agenda() {
  const [horarios, setHorarios] = useState([
    { hora: "10:00", disponible: true },
    { hora: "11:00", disponible: true },
    { hora: "12:00", disponible: true },
  ]);

  const reservar = (index: number) => {
    const nuevos = [...horarios];
    nuevos[index].disponible = false; // simula la seña
    setHorarios(nuevos);
  };

  return (
    <div>
      <h1>Agenda</h1>
      <ul>
        {horarios.map((h, i) => (
          <li key={i}>
            {h.hora} - {h.disponible ? "Libre" : "Reservado"}{" "}
            {h.disponible && <button onClick={() => reservar(i)}>Reservar</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Agenda;
