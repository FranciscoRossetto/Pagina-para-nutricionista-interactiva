import { useState } from "react";
import "./App.css";

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
        {section === "home" && (
          <div>
            <h1>Bienvenido a NutriApp</h1>
            <NutricionistaData />
            <Bonos />
          </div>
        )}

        {section === "recetas" && (
          <div>
            <h1>Recetas</h1>
            {recetas.map((r, i) => <RecipeCard key={i} {...r} />)}
          </div>
        )}

        {section === "agenda" && (
          <div>
            <h1>Agenda</h1>
            <Agenda />
          </div>
        )}

        {section === "juego" && (
          <div>
            <MoreLessGame />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
