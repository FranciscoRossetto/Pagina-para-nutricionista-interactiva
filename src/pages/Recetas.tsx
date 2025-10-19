import { useState } from "react";
import { recipes } from "../assets/data/recipes";
import type { Recipe } from "../assets/data/recipes";

import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import styles from "./Recetas.module.css";

const filtersList = [
  { key: "celiaco", label: "Apto celíacos" },
  { key: "vegetariano", label: "Vegetariano" },
  { key: "vegano", label: "Vegano" },
  { key: "sinHarina", label: "Sin harina" },
  { key: "sinSal", label: "Sin sal" },
];

export default function Recetas() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleFilterChange = (key: string) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const filteredRecipes = recipes.filter((r) =>
    selectedFilters.length === 0
      ? true
      : selectedFilters.every((key) => (r.type as any)[key])
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recetas Saludables 🍽️</h1>

      <div className={styles.filters}>
        {filtersList.map((f) => (
          <label key={f.key} className={styles.filterItem}>
            <input
              type="checkbox"
              checked={selectedFilters.includes(f.key)}
              onChange={() => handleFilterChange(f.key)}
            />
            {f.label}
          </label>
        ))}
      </div>

      <Swiper
  spaceBetween={30}
  slidesPerView={3}
  loop={true}
  centeredSlides={true}
  grabCursor={true}
  className={styles.swiper}
>
  {filteredRecipes.map((recipe) => (
    <SwiperSlide key={recipe.id}>
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
          <p>{recipe.description}</p>
          <ul>
            {recipe.ingredients.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </SwiperSlide>
  ))}
</Swiper>

    </div>
  );
}
