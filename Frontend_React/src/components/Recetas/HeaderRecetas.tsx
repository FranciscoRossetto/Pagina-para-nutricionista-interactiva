import styles from "../../pages/Recetas/Recetas.module.css";

export default function HeaderRecetas({
  onToggleMenu,
  showMenu,
}:

{
  onToggleMenu: () => void;
  showMenu: boolean;
}) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Recetario</h1>
      <button className={styles.filterButton} onClick={onToggleMenu}>
        {showMenu ? "Cerrar filtros" : "Abrir filtros"}
      </button>
    </header>
  );
}
