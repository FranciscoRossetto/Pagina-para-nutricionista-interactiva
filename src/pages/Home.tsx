import styles from "./Home.module.css";

type HomeProps = {
  setSection?: (s: "home" | "recetas" | "agenda" | "juego") => void;
};

export default function Home({ setSection }: HomeProps) {
  return (
    <div className={styles.home}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>No a las dietas, sí al cambio de hábitos</h1>
          <p>Mejorá tu relación con la comida, sin restricciones extremas.</p>
          {setSection && (
            <button onClick={() => setSection("recetas")} className={styles.button}>
              Comenzar ahora
            </button>
          )}
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className={styles.why}>
        <h2>¿Por qué elegirnos?</h2>
        <p>
          En NutriApp creemos que una alimentación saludable no tiene por qué ser aburrida.
          Te ayudamos a construir hábitos sostenibles con recetas simples y un enfoque personalizado.
        </p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <span className={styles.icon}>🥗</span>
            <h3>Recetas saludables</h3>
            <p>Ideas fáciles, deliciosas y balanceadas para tu día a día.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>📅</span>
            <h3>Agenda tu progreso</h3>
            <p>Organizá tus comidas y seguí tu evolución semana a semana.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>🎮</span>
            <h3>Juego interactivo</h3>
            <p>Aprendé jugando con nuestro quiz de nutrición.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
