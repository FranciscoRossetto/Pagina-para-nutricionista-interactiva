import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import WhatsAppBubble from "../../components/WhatsAppBubble/WhatsAppBubble";
import heroImage from "../../assets/imagenes/healthy_illustration.png";

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
      {/*inicio*/}
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

        {/*foto*/}
        <motion.img
          src={heroImage}
          alt="Nutrición saludable"
          className={styles.heroImage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </section>

      {/*porque?*/}
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
            {
              icon: "🥗",
              title: "Recetas saludables",
              desc: "Ideas fáciles, deliciosas y balanceadas para tu día a día.",
              to: "/recetas",
            },
            {
              icon: "📅",
              title: "Agenda tu turno",
              desc: "Agenda tu turno con la Dr.Guadalupe.",
              to: "/agenda",
            },
            {
              icon: "🎮",
              title: "Juego interactivo",
              desc: "Aprendé jugando con nuestro MoreAndLess de nutrición.",
              to: "/juego",
            },
          ].map((card, i) => (
            <Link
              key={i}
              to={card.to}
              className={styles.cardLink}
              onClick={() => window.scrollTo(0, 0)}
            >
              <motion.div
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
            </Link>
          ))}
        </div>
      </section>

      {/*acerca de*/}
      <motion.section
        className={styles.aboutGuadalupe}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImageWrapper}>
            <img
              src={heroImage}
              alt="Guadalupe"
              className={styles.aboutImage}
            />
          </div>
          <div className={styles.aboutText}>
            <h2>Conocé a Guadalupe</h2>
            <p>
              Soy Guadalupe, nutricionista apasionada por acompañar a las personas en el proceso
              de transformar su relación con la comida. Creo que una buena alimentación no se
              trata de restricciones, sino de equilibrio, bienestar y disfrute. Mi objetivo es
              ayudarte a construir hábitos saludables que se adapten a tu estilo de vida, para
              que te sientas bien por dentro y por fuera, todos los días.
            </p>

            <div className={styles.aboutValues}>
              {[
                {
                  title: "Equilibrio",
                  desc: "Encontrá la armonía entre salud y disfrute.",
                },
                {
                  title: "Sostenibilidad",
                  desc: "Hábitos que perduran y se adaptan a vos.",
                },
                {
                  title: "Apoyo Personalizado",
                  desc: "Acompañamiento cercano en cada paso.",
                },
              ].map((val, i) => (
                <motion.div
                  key={i}
                  className={styles.valueCard}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <h4>{val.title}</h4>
                  <p>{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/*wpp*/}
      <WhatsAppBubble />
    </motion.div>
  );
}
