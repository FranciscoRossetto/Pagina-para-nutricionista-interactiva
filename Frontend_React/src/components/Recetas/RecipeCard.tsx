import { motion } from "framer-motion";
import styles from "../../pages/Recetas/Recetas.module.css";
import type { Recipe } from "../../assets/data/recipes";
import { useUser } from "../../contexts/UserContext";
import {
  toggleLike as apiToggleLike,
  getRecipeLikes as apiGetLikes,
  toggleFavorite,
  getRecipeFavorite,
} from "../../utils/api";
import { useState, useEffect } from "react";
import { Heart, Star, StarOff } from "lucide-react";

export default function RecipeCard({
  recipe,
  flipped,
  onFlip,
  onUpdateFavorites,
  likeTick,          // ⬅️ llega desde arriba
  bumpLike,          // ⬅️ función global que incrementa el tick
}: {
  recipe: Recipe;
  flipped: boolean;
  onFlip: () => void;
  onUpdateFavorites?: () => void;
  likeTick: number;
  bumpLike: () => void;
}) {
  const { user, token } = useUser();
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [favAnim, setFavAnim] = useState(false);

  const recipeIdStr = recipe.id.toString();

  // Re-fetch de likes también cuando cambia likeTick
  useEffect(() => {
    let mounted = true;

    const loadLikes = async () => {
      try {
        const likes = await apiGetLikes(recipeIdStr, token ?? "");
        if (!mounted) return;
        setLikesCount(likes.likes ?? 0);
        setLiked(!!likes.likedByUser);
      } catch (err) {
        if (!mounted) return;
        console.error("Error cargando likes:", err);
      }
    };

    const loadFav = async () => {
      try {
        const fav = await getRecipeFavorite(recipeIdStr, token ?? "");
        if (!mounted) return;
        setFavorited(!!fav.favoritedByUser);
      } catch (err) {
        if (!mounted) return;
        console.error("Error cargando favorito:", err);
        setFavorited(false);
      }
    };

    loadLikes();
    loadFav();
    return () => {
      mounted = false;
    };
    // ⬇️ clave: dependemos de likeTick para que TODAS las tarjetas se actualicen
  }, [user, token, recipeIdStr, likeTick]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return alert("Tenés que iniciar sesión para dar like ❤️");

    try {
      setLikeAnim(true);
      await apiToggleLike(recipeIdStr, token);
      // Reconsulta local
      const updated = await apiGetLikes(recipeIdStr, token);
      setLikesCount(updated.likes ?? 0);
      setLiked(!!updated.likedByUser);
      // 🔁 Propaga actualización al resto
      bumpLike();
    } catch (err) {
      console.error("Error toggleLike:", err);
    } finally {
      setTimeout(() => setLikeAnim(false), 250);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !token) return alert("Tenés que iniciar sesión para agregar a favoritos ⭐");

    try {
      setFavAnim(true);
      await toggleFavorite(recipeIdStr, token);
      const updated = await getRecipeFavorite(recipeIdStr, token);
      setFavorited(!!updated.favoritedByUser);
      onUpdateFavorites?.();
    } catch (err) {
      console.error("Error toggleFavorite:", err);
    } finally {
      setTimeout(() => setFavAnim(false), 250);
    }
  };

  return (
    <motion.div
      className={`${styles.card} ${flipped ? styles.flipped : ""}`}
      onClick={onFlip}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div className={styles.front}>
        <img src={recipe.image} alt={recipe.title} />
        <h3>{recipe.title}</h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.2rem",
            marginTop: "0.5rem",
          }}
        >
          {/* LIKE */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            animate={likeAnim ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={handleLike}
            title={user ? "" : "Iniciá sesión para dar like"}
            style={{
              background: "none",
              border: "none",
              cursor: user ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: liked ? "red" : "gray",
              opacity: user ? 1 : 0.6,
            }}
          >
            <Heart fill={liked ? "red" : "none"} stroke={liked ? "red" : "gray"} size={35} />
            <span style={{ fontWeight: 600 }}>{likesCount}</span>
          </motion.button>

          {/* FAVORITO */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            animate={favAnim ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            onClick={handleFavorite}
            title={user ? "" : "Iniciá sesión para agregar a favoritos"}
            style={{
              background: "none",
              border: "none",
              cursor: user ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              color: favorited ? "goldenrod" : "gray",
              opacity: user ? 1 : 0.6,
            }}
          >
            {favorited ? <Star fill="gold" stroke="gold" size={35} /> : <StarOff stroke="gray" size={35} />}
          </motion.button>
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
