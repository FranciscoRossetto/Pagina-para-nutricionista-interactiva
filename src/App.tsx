import { useState } from "react";
import "./App.css";

import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { NutricionistaData } from "./components/NutricionistaData";
import { Bonos } from "./components/Bonos";
import { RecipeCard } from "./components/RecipeCard";
import { Agenda } from "./components/Agenda";
import { MoreLessGame } from "./components/MoreLessGame";

export default function App() {
  const [section, setSection] = useState<"home"|"recetas"|"agenda"|"juego">("home");

  const recetas = [
    { title: "Ensalada César", description: "Lechuga, pollo y aderezo" },
    { title: "Smoothie de frutas", description: "Banana, fresa, leche" }
  ];

  return (
    <div>
      <Navbar setSection={setSection} />

      <div className="container">
        {section === "home" && <Home setSection={setSection} />}
        
        {section === "recetas" && <Recetas />}
        
        {section === "agenda" && <Agenda />}
        
        {section === "juego" && <MoreLessGame />}
      </div>


      <Footer />
    </div>
  );
}
