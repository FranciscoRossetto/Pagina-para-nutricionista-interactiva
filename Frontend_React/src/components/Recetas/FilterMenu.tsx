import styles from "../../pages/Recetas/Recetas.module.css";

export default function FilterMenu({
  filters,
  selected,
  onToggle,
}:

{
  filters: { key: string; label: string }[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className={styles.filterMenu}>
      {filters.map((f) => (
        <div
          key={f.key}
          className={styles.filterOption}
          style={{
            backgroundColor: selected.includes(f.key) ? "#007b5e" : "#f0f0f0",
            color: selected.includes(f.key) ? "#fff" : "#333",
          }}
          onClick={() => onToggle(f.key)}
        >
          {f.label}
        </div>
      ))}
    </div>
  );
}
