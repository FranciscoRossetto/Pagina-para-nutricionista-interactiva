import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/recetas", label: "Recetas" },
    { to: "/agenda", label: "Agenda" },
    { to: "/juego", label: "Juego" },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className={styles.navbar}
    >
      <div className={styles.container}>
        {/* Logo */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className={styles.logo}
          onClick={() => {
            navigate("/");
            setOpen(false);
          }}
        >
          NutriApp 🥗
        </motion.h1>

        {/* Menú móvil */}
        <button className={styles.toggle} onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <ul className={`${styles.links} ${open ? styles.open : ""}`}>
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <motion.li
                key={link.to}
                className={styles.linkItem}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.to}
                  className={`${styles.link} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {/* Animación subrayado */}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className={styles.underline}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}
