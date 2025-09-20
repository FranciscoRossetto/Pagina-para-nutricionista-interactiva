import { useState } from "react";

function Bonos() {
  const [visitas, setVisitas] = useState(0);

  return (
    <div>
      <h1>Bonos</h1>
      <p>Visitas: {visitas}</p>
      <button onClick={() => setVisitas(visitas + 1)}>Simular visita</button>
      {visitas >= 5 && <p>🎉 ¡Tenés un bono de descuento!</p>}
    </div>
  );
}

export default Bonos;
