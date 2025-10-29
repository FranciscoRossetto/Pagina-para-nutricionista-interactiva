import { useState } from "react";
import { recipes } from "../../assets/data/recipes";
import RecipeCarousel from "../../components/Recetas/RecipeCarousel";
import FilterMenu from "../../components/Recetas/FilterMenu";
import HeaderRecetas from "../../components/Recetas/HeaderRecetas";
import styles from "./Recetas.module.css";

const filtersList = [
  { key: "celiaco", label: "Apto celíacos" },
  { key: "vegetariano", label: "Vegetariano" },
  { key: "vegano", label: "Vegano" },
  { key: "sinHarina", label: "Sin harina" },
  { key: "sinSal", label: "Sin sal" },
];

export default function Recetas() {
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFilter = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );

  const filtered = recipes.filter((r) =>
    selected.length === 0
      ? false
      : selected.every((key) => (r.type as any)[key])
  );

  const grouped = filtersList.map((f) => ({
    title: f.label,
    data: recipes.filter((r) => (r.type as any)[f.key]),
  }));

  return (
    <div className={styles.container}>
      <HeaderRecetas onToggleMenu={() => setShowMenu(!showMenu)} showMenu={showMenu} />

      {showMenu && (
        <FilterMenu filters={filtersList} selected={selected} onToggle={toggleFilter} />
      )}

      {selected.length > 0 && filtered.length > 0 && (
        <RecipeCarousel
          title={`Recetas filtradas: ${selected
            .map((f) => filtersList.find((i) => i.key === f)?.label || f)
            .join(", ")}`}
          data={filtered}
        />
      )}

      {grouped.map(
        (g) => g.data.length > 0 && <RecipeCarousel key={g.title} {...g} />
      )}
    </div>
  );
}
