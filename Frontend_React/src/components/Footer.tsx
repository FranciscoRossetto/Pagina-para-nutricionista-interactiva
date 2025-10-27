import styles from "./Footer.module.css";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo y lema */}
        <div className={styles.brand}>

          <div>
            <h3 className={styles.title}>NutriApp</h3>
            <p className={styles.slogan}>
              Cuidá tu cuerpo, nutrí tu mente 🍎
            </p>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className={styles.links}>
          <h4>Enlaces rápidos</h4>
          <ul>
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="/recetas">Recetas</a>
            </li>
            <li>
              <a href="/imc">Calculadora IMC</a>
            </li>
            <li>
              <a href="/agenda">Agenda</a>
            </li>
            <li>
              <a href="/juego">Juego</a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div className={styles.contact}>
          <h4>Contacto</h4>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/giulibernacchia/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="mailto:contacto@nutriapp.com">
              <MdEmail />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copy}>
        © 2025 - María Guadalupe Naveyra. Todos los derechos reservados.
      </div>
    </footer>
  );
}
