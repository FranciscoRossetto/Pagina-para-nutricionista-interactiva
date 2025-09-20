function Recetas() {
  const recetas = [
    { nombre: "Ensalada César", plan: "Light" },
    { nombre: "Pollo con arroz", plan: "Proteico" },
  ];

  return (
    <div>
      <h1>Recetas</h1>
      <ul>
        {recetas.map((r, i) => (
          <li key={i}>
            {r.nombre} - Plan: {r.plan}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recetas;
