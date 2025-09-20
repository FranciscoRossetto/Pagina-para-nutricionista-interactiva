type NavbarProps = {
  setSection: (s: "home"|"recetas"|"agenda"|"juego") => void;
};

export const Navbar = ({ setSection }: NavbarProps) => {
  return (
    <nav className="navbar">
      <button onClick={() => setSection("home")}>Inicio</button>
      <button onClick={() => setSection("recetas")}>Recetas</button>
      <button onClick={() => setSection("agenda")}>Agenda</button>
      <button onClick={() => setSection("juego")}>Juego</button>
    </nav>
  );
};
