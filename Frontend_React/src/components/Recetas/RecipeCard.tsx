import { motion } from "framer-motion";
import styles from "../../pages/Recetas/Recetas.module.css";
import type { Recipe } from "../../assets/data/recipes";
import { useUser } from "../../contexts/UserContext";
import { toggleLike, getRecipeLikes, toggleFavorite, getUserFavorites } from "../../utils/api";
import { useState, useEffect } from "react";

export default function RecipeCard({
  recipe,
  flipped,
  onFlip,
}: {
  recipe: Recipe;
  flipped: boolean;
  onFlip: () => void;
}) {
  const { user, token } = useUser();
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  // Traemos estado inicial de likes y favoritos
  useEffect(() => {
    const fetchData = async () => {
      const likes = await getRecipeLikes(recipe.id.toString(), token || undefined);
      setLikesCount(likes.likes);
      setLiked(likes.likedByUser || false); // si no hay usuario, false
  
      if (user && token) {
        const favs = await getUserFavorites(token!);
        setFavorited(favs.some((f: any) => f.recipeId === recipe.id));
      }
    };
    fetchData();
  }, [user, token, recipe.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return alert("Debes iniciar sesión para dar like");
  
    await toggleLike(recipe.id.toString(), token!); 
    const likes = await getRecipeLikes(recipe.id.toString(), token!);
    setLikesCount(likes.likes);
    setLiked(likes.likedByUser);
  };
  
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return alert("Debes iniciar sesión para agregar a favoritos");
  
    await toggleFavorite(recipe.id.toString(), token!);
    const favs = await getUserFavorites(token!);
    setFavorited(favs.some((f: any) => f.recipeId === recipe.id));
  };
  

  return (
    <motion.div
      className={`${styles.card} ${flipped ? styles.flipped : ""}`}
      onClick={onFlip}
    >
      <motion.div className={styles.front}>
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "0.5rem" }}>
          <span 
            style={{ cursor: "pointer", color: liked ? "red" : "gray", fontSize: "1.5rem" }}
            onClick={handleLike}
          >
            ❤️ {likesCount}
          </span>
          <span 
            style={{ cursor: "pointer", color: favorited ? "gold" : "gray", fontSize: "1.5rem" }}
            onClick={handleFavorite}
          >
            ⭐
          </span>
        </div>
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
