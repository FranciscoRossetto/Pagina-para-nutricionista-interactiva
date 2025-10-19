import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Recetas from "./pages/Recetas";
import Agenda from "./pages/Agenda";
import MoreLessGame from "./pages/MoreLessGame";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recetas" element={<Recetas />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/juego" element={<MoreLessGame />} />
      </Routes>
    </>
  );
}

export default App;
