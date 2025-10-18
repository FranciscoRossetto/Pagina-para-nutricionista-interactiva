import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Recetas } from "./pages/Recetas";
import { Agenda } from "./pages/Agenda";
import { MoreLessGame } from "./pages/MoreLessGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/juego" element={<MoreLessGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
