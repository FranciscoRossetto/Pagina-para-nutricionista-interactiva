import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Recetas from "./components/Recetas";
import Agenda from "./components/Agenda";
import Nutricionista from "./components/Nutricionista";
import Bonos from "./components/Bonos";
import Juego from "./components/Juego";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Recetas</Link> |{" "}
        <Link to="/agenda">Agenda</Link> |{" "}
        <Link to="/nutricionista">Nutricionista</Link> |{" "}
        <Link to="/bonos">Bonos</Link> |{" "}
        <Link to="/juego">Juego</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Recetas />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/nutricionista" element={<Nutricionista />} />
        <Route path="/bonos" element={<Bonos />} />
        <Route path="/juego" element={<Juego />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;