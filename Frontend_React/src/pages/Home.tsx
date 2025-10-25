import { motion } from "framer-motion";
import styles from "./Home.module.css";
import WhatsAppBubble from "../components/WhatsAppBubble";
import heroImage from "../assets/imagenes/healthy_illustration.png"; // 👈 agregá una ilustración SVG o PNG en /src/assets/

type HomeProps = {
  setSection?: (s: "home" | "recetas" | "agenda" | "juego") => void;
};

export default function Home({ setSection }: HomeProps) {
  return (
    <motion.div
      className={styles.home}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, delay: 0.2 }}
        >
          <h1>
            No a las <span>dietas</span>, sí al <span>cambio de hábitos</span>
          </h1>
          <p>Mejorá tu relación con la comida, sin restricciones extremas.</p>
          {setSection && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSection("recetas")}
              className={styles.button}
            >
              ¡Empezá tu cambio hoy!
            </motion.button>
          )}
        </motion.div>

        {/* Imagen ilustrativa */}
        <motion.img
          src={heroImage}
          alt="Nutrición saludable"
          className={styles.heroImage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </section>

      {/* Por qué elegirnos */}
      <section className={styles.why}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ¿Por qué elegirnos?
        </motion.h2>
        <p>
          En NutriApp creemos que una alimentación saludable no tiene por qué ser aburrida.
          Te ayudamos a construir hábitos sostenibles con recetas simples y un enfoque personalizado.
        </p>

        <div className={styles.cards}>
          {[
            { icon: "🥗", title: "Recetas saludables", desc: "Ideas fáciles, deliciosas y balanceadas para tu día a día." },
            { icon: "📅", title: "Agenda tu progreso", desc: "Organizá tus comidas y seguí tu evolución semana a semana." },
            { icon: "🎮", title: "Juego interactivo", desc: "Aprendé jugando con nuestro quiz de nutrición." },
          ].map((card, i) => (
            <motion.div
              key={i}
              className={styles.card}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <span className={styles.icon}>{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Acerca de Guadalupe */}
      <motion.section
        className={styles.aboutGuadalupe}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Acerca sobre Guadalupe</h2>
        <p>
          Soy Guadalupe, nutricionista apasionada por acompañar a las personas en el proceso de transformar su relación con la comida. 
          Creo que una buena alimentación no se trata de restricciones, sino de equilibrio, bienestar y disfrute. 
          Mi objetivo es ayudarte a construir hábitos saludables que se adapten a tu estilo de vida, para que te sientas bien por dentro y por fuera, todos los días.
        </p>
      </motion.section>

      {/* Contacto */}
      <motion.section
        className={styles.contact}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2>Contacto</h2>
        <p>Dirección: Calle Falsa 123, Ciudad</p>
        <p>Email: contacto@nutriapp.com</p>
        <p>Teléfono: +54 9 11 1234-5678</p>
        <p>Redes sociales: @nutriapp</p>
      </motion.section>

      {/* Burbuja de WhatsApp */}
      <WhatsAppBubble />
    </motion.div>
  );
}
