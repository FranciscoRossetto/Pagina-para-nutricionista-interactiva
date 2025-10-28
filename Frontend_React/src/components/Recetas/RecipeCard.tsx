import { useState, useEffect } from "react";
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
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`/api/likes/${recipe.id}`)
      .then((r) => r.json())
      .then((d) => setLikes(d.likes));
  }, [recipe.id]);

  const handleLike = async () => {
    if (!token) return alert("Inicia sesión para dar like");
    setLiked(!liked);
    setLikes((l) => (liked ? l - 1 : l + 1));
    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ recipeId: recipe.id }),
    });
  };

  const handleFavorite = async () => {
    if (!token) return alert("Inicia sesión para guardar favoritos");
    setFavorited(!favorited);
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ recipeId: recipe.id }),
    });
  };

  return (
    <motion.div
      className={`${styles.card} ${flipped ? styles.flipped : ""}`}
      onClick={onFlip}
    >
      <motion.div className={styles.front}>
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>

        <div className={styles.actions}>
          <button
            className={`${styles.heart} ${liked ? styles.active : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            ❤️ {likes}
          </button>

          <button
            className={`${styles.star} ${favorited ? styles.active : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          >
            ⭐
          </button>
        </div>
      </motion.div>

      <motion.div className={styles.back}>
        <h3>{recipe.title}</h3>
        <p className={styles.description}>{recipe.description}</p>
      </motion.div>
    </motion.div>
  );
}
