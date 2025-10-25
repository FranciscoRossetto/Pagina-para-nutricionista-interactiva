import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import { recipes } from "../assets/data/recipes";
import type { Recipe } from "../assets/data/recipes";
import styles from "./Recetas.module.css";

const filtersList = [
  { key: "celiaco", label: "Apto celíacos" },
  { key: "vegetariano", label: "Vegetariano" },
  { key: "vegano", label: "Vegano" },
  { key: "sinHarina", label: "Sin harina" },
  { key: "sinSal", label: "Sin sal" },
];

function RecipeCarousel({ title, data }: { title: string; data: Recipe[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    renderMode: "performance",
    drag: true,
    slides: { perView: 3, spacing: 20, origin: "center" },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1.2, spacing: 10, origin: "center" },
      },
      "(max-width: 1200px)": {
        slides: { perView: 2.2, spacing: 15, origin: "center" },
      },
    },
  });

  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  return (
    <div className={styles.carouselSection}>
      <h2 className={styles.carouselTitle}>{title}</h2>
      <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
        {data.map((recipe) => (
          <div key={recipe.id} className={`keen-slider__slide ${styles.slide}`}>
            <motion.div
              className={`${styles.card} ${
                flippedCard === recipe.id ? styles.flipped : ""
              }`}
              onClick={() =>
                setFlippedCard(flippedCard === recipe.id ? null : recipe.id)
              }
            >
              {/* Frente */}
              <motion.div className={styles.front}>
                <img src={recipe.image} alt={recipe.title} />
                <h3>{recipe.title}</h3>
              </motion.div>

              {/* Dorso */}
              <motion.div className={styles.back}>
                <h3>{recipe.title}</h3>
                <p className={styles.description}>{recipe.description}</p>

                <h4>Ingredientes:</h4>
                <ul className={styles.ingredientsList}>
                  {recipe.ingredients.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>

                <h4>Preparación:</h4>
                <p className={styles.steps}>{recipe.steps}</p>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Recetas() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (key: string) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const filteredRecipes = recipes.filter((r) =>
    selectedFilters.length === 0
      ? false
      : selectedFilters.every((key) => (r.type as any)[key])
  );

 
  const groupedRecipes = filtersList.map((filter) => ({
    title: filter.label,
    data: recipes.filter((r) => (r.type as any)[filter.key]),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recetas Saludables 🍽️</h1>

        <button
          className={styles.filterButton}
          onClick={() => setShowFilterMenu(!showFilterMenu)}
        >
          {showFilterMenu ? "Cerrar filtros" : "🔍 Filtrar"}
        </button>
      </div>

      {}
      {showFilterMenu && (
        <div className={styles.filterMenu}>
          {filtersList.map((f) => (
            <label key={f.key} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={selectedFilters.includes(f.key)}
                onChange={() => handleFilterChange(f.key)}
              />
              {f.label}
            </label>
          ))}
        </div>
      )}

      {}
      {selectedFilters.length > 0 && filteredRecipes.length > 0 && (
        <RecipeCarousel
          title={`Recetas filtradas: ${selectedFilters
            .map(
              (f) => filtersList.find((item) => item.key === f)?.label || f
            )
            .join(", ")}`}
          data={filteredRecipes}
        />
      )}

      {}
      {groupedRecipes.map(
        (group) =>
          group.data.length > 0 && (
            <RecipeCarousel
              key={group.title}
              title={group.title}
              data={group.data}
            />
          )
      )}
    </div>
  );
}
