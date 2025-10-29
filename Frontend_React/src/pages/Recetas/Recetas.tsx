import React, { useState } from "react";
import { motion } from "framer-motion";
import { recipes, Recipe } from "../../assets/data/recipes";
import styles from "./Recetas.module.css";

const Recetas: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("todos");

  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    if (selectedFilter === "todos") return true;
    return recipe.type[selectedFilter as keyof Recipe["type"]];
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Recetario Saludable</h1>

      <div className={styles.filtros}>
        <button onClick={() => setSelectedFilter("todos")}>Todos</button>
        <button onClick={() => setSelectedFilter("celiaco")}>Apto celíacos</button>
        <button onClick={() => setSelectedFilter("vegetariano")}>Vegetariano</button>
        <button onClick={() => setSelectedFilter("vegano")}>Vegano</button>
        <button onClick={() => setSelectedFilter("sinHarina")}>Sin harina</button>
        <button onClick={() => setSelectedFilter("sinSal")}>Sin sal</button>
      </div>

      <div className={styles.grid}>
        {filteredRecipes.map((recipe: Recipe, idx: number) => (
          <motion.div
            key={`${recipe.id}-${idx}`}
            className={styles.card}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.imageContainer}>
              <img src={recipe.image} alt={recipe.title} className={styles.image} />
            </div>
            <h2>{recipe.title}</h2>
            <p>{recipe.description}</p>

            <div className={styles.tags}>
              {recipe.type.celiaco && <span className={styles.tag}>Celiaco</span>}
              {recipe.type.vegetariano && <span className={styles.tag}>Vegetariano</span>}
              {recipe.type.vegano && <span className={styles.tag}>Vegano</span>}
              {recipe.type.sinHarina && <span className={styles.tag}>Sin harina</span>}
              {recipe.type.sinSal && <span className={styles.tag}>Sin sal</span>}
            </div>

            <details className={styles.details}>
              <summary>Ver más</summary>
              <div>
                <h3>Ingredientes:</h3>
                <ul>
                  {recipe.ingredients.map((i: string, idx2: number) => (
                    <li key={`${recipe.id}-ing-${idx2}`}>{i}</li>
                  ))}
                </ul>
                <h3>Pasos:</h3>
                <p>{recipe.steps}</p>
              </div>
            </details>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recetas;
