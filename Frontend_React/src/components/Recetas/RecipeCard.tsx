import { motion } from "framer-motion";
import styles from "../../pages/Recetas/Recetas.module.css";
import type { Recipe } from "../../assets/data/recipes";

export default function RecipeCard({
  recipe,
  flipped,
  onFlip,
}: {
  recipe: Recipe;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <motion.div
      className={`${styles.card} ${flipped ? styles.flipped : ""}`}
      onClick={onFlip}
    >
      <motion.div className={styles.front}>
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
      </motion.div>

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
  );
}
