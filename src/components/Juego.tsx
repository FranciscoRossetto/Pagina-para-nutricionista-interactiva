import { useState } from "react";

const alimentos = [
  { nombre: "Hamburguesa", calorias: 500 },
  { nombre: "Ensalada", calorias: 150 },
  { nombre: "Pizza", calorias: 700 },
  { nombre: "Manzana", calorias: 80 },
];

function Juego() {
  const [puntaje, setPuntaje] = useState(0);
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);

  const siguiente = () => {
    setA(Math.floor(Math.random() * alimentos.length));
    setB(Math.floor(Math.random() * alimentos.length));
  };

  const elegir = (mas: boolean) => {
    if (
      (mas && alimentos[a].calorias >= alimentos[b].calorias) ||
      (!mas && alimentos[a].calorias <= alimentos[b].calorias)
    ) {
      setPuntaje(puntaje + 1);
    } else {
      setPuntaje(0);
    }
    siguiente();
  };

  return (
    <div>
      <h1>Juego More/Less</h1>
      <p>Puntaje: {puntaje}</p>
      <p>{alimentos[a].nombre} vs {alimentos[b].nombre}</p>
      <button onClick={() => elegir(true)}>Más calorías</button>
      <button onClick={() => elegir(false)}>Menos calorías</button>
      {puntaje >= 5 && <p>🏆 ¡Ganaste un premio!</p>}
    </div>
  );
}

export default Juego;
