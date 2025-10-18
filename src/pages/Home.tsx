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

      {/* Sección "Acerca sobre Guadalupe" */}
      <section className={styles.aboutGuadalupe}>
        <h2>Acerca sobre Guadalupe</h2>
        <p>
          Guadalupe es especialista en nutrición y bienestar. Su enfoque está basado en hábitos saludables, equilibrio y atención personalizada. Aquí podés poner cualquier otra info que quieras destacar.
        </p>
      </section>

      {/* Sección de contacto */}
      <section className={styles.contact}>
        <h2>Contacto</h2>
        <p>Dirección: Calle Falsa 123, Ciudad</p>
        <p>Email: contacto@nutriapp.com</p>
        <p>Teléfono: +54 9 11 1234-5678</p>
        <p>Redes sociales: @nutriapp</p>
      </section>

      {/* Burbuja de WhatsApp */}
      <a
        href="https://wa.me/541112345678" // Pon tu número real
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBubble}
      >
        💬
      </a>
    </div>
  );
}
