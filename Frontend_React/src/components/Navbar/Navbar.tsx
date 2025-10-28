// …imports
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useUser } from "../../contexts/UserContext";

export default function Navbar() {
  const [open, setOpen] = useState(false); // menú móvil
  const [dropdownOpen, setDropdownOpen] = useState(false); // dropdown usuario
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown si clickeas afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { to: "/recetas", label: "Recetas" },
    { to: "/agenda", label: "Agenda" },
    { to: "/juego", label: "Juego" },
    { to: "/imc", label: "Calculadora IMC" },
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

        {/* Botón menú móvil */}
        <button className={styles.toggle} onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>

        {/* Links principales */}
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
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className={styles.underline}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Usuario o botones de login/register */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button
                className={styles.userNameButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user} ▼
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setDropdownOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    Perfil
                  </button>
                  <button
                    onClick={logout}
                    className={styles.logoutButton}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button className={styles.loginButton} onClick={() => navigate("/login")}>
                Iniciar sesión
              </button>
              <button className={styles.registerButton} onClick={() => navigate("/register")}>
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
