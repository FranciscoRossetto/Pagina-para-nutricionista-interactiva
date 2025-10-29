// src/pages/MoreLessGame/MoreLessGame.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useMoreLessGame from "../../contexts/hooks/useMoreLessGame";
import { useUser } from "../../contexts/UserContext";
import styles from "./MoreLessGame.module.css";

function AnimatedNumber({
  value,
  trigger,
  duration = 700,
}: {
  value: number;
  trigger: boolean;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setDisplay(0);
      return;
    }
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress; // easeInOut-ish
      const current = Math.round(value * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value, trigger, duration]);

  return <>{display}</>;
}

export default function MoreLessGame() {
  const { user } = useUser();
  const {
    leftFood,
    rightFood,
    revealed,
    gameOver,
    score,
    highScore,
    handleClick,
    handleRestart,
  } = useMoreLessGame();

  const [localSelected, setLocalSelected] = useState<"left" | "right" | null>(null);

  // Reset selección local para la siguiente ronda
  useEffect(() => {
    if (!revealed) setLocalSelected(null);
  }, [revealed]);

  if (!leftFood || !rightFood) {
    return (
      <div className={styles.container}>
        <h1>Cargando juego...</h1>
      </div>
    );
  }

  const correctSide = leftFood.calories >= rightFood.calories ? "left" : "right";

  const onCardClick = (side: "left" | "right") => {
    setLocalSelected(side);
    handleClick(side);
  };

  // Función para manejar las clases de las cartas
  const getCardClass = (side: "left" | "right") => {
    if (!revealed) return styles.card;

    if (localSelected === side) {
      return localSelected === correctSide
        ? `${styles.card} ${styles.correct}`
        : `${styles.card} ${styles.incorrect}`;
    }

    if (correctSide === side) {
      return `${styles.card} ${styles.revealCorrect}`;
    }

    return styles.card;
  };

  return (
    <div className={styles.container}>
      <h1>¿Cuál tiene más calorías?</h1>
      <p className={styles.score}>Puntaje: {score}</p>
      <p className={styles.highscore}>
        🏆 {user ? `${user} - Récord:` : "Récord:"} {highScore}
      </p>

      <div className={styles.cards}>
        {/* LEFT CARD */}
        <motion.div
          key={`${leftFood.name}-${leftFood.calories}`}
          className={getCardClass("left")}
          onClick={() => onCardClick("left")}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <img src={leftFood.image} alt={leftFood.name} />
          <p className={styles.foodName}>{leftFood.name}</p>
          {revealed && (
            <p className={styles.calories}>
              <AnimatedNumber value={leftFood.calories} trigger={revealed} /> cal
            </p>
          )}
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          key={`${rightFood.name}-${rightFood.calories}`}
          className={getCardClass("right")}
          onClick={() => onCardClick("right")}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <img src={rightFood.image} alt={rightFood.name} />
          <p className={styles.foodName}>{rightFood.name}</p>
          {revealed && (
            <p className={styles.calories}>
              <AnimatedNumber value={rightFood.calories} trigger={revealed} /> cal
            </p>
          )}
        </motion.div>
      </div>

      {/* GAME OVER MODAL */}
      {gameOver && (
        <motion.div
          className={styles.gameoverWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={styles.gameover}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2>¡Game Over!</h2>
            <p className={styles.finalScore}>Tu puntaje: {score}</p>
            <p className={styles.highscore}>
              🏆 {user ? `${user} - Récord:` : "Récord:"} {highScore}
            </p>
            <button
              onClick={() => {
                handleRestart();
                setLocalSelected(null);
              }}
            >
              Jugar de nuevo 🔄
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
