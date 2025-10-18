import "./Home.module.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>No a las dietas, sí al cambio de hábitos</h1>
          <p>Mejorá tu relación con la comida, sin restricciones extremas.</p>
          <button className="cta-btn" onClick={() => navigate("/recetas")}>
            Comenzar ahora
          </button>
        </div>
      </section>

      <section className="about">
        <h2>¿Por qué elegirnos?</h2>
        <p>
          En NutriApp creemos que una alimentación saludable no tiene por qué ser aburrida.
          Te ayudamos a construir hábitos sostenibles con recetas simples y un enfoque personalizado.
        </p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🍎 Recetas saludables</h3>
          <p>Ideas fáciles, deliciosas y balanceadas para tu día a día.</p>
        </div>
        <div className="feature-card">
          <h3>🗓️ Agenda tu progreso</h3>
          <p>Organizá tus comidas y seguí tu evolución semana a semana.</p>
        </div>
        <div className="feature-card">
          <h3>🎮 Juego interactivo</h3>
          <p>Aprendé jugando con nuestro quiz de nutrición.</p>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 NutriApp - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
