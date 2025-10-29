// src/components/MoreLessGame/MoreLessGame.tsx
import { motion } from "framer-motion";
import useMoreLessGame from "../../contexts/hooks/useMoreLessGame";
import { useUser } from "../../contexts/UserContext";
import styles from "./MoreLessGame.module.css";

function MoreLessGame() {
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

  // 🧠 Evitar render si todavía no hay comidas cargadas
  if (!leftFood || !rightFood) {
    return (
      <div className={styles.container}>
        <h1>Cargando juego...</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>¿Cuál tiene más calorías?</h1>
      <p className={styles.score}>Puntaje: {score}</p>
      <p className={styles.highscore}>
        🏆 {user ? `${user} - Récord:` : "Récord:"} {highScore}
      </p>

      <div className={styles.cards}>
        {!gameOver && (
          <>
            <motion.div
              key={leftFood.name}
              className={styles.card}
              onClick={() => handleClick("left")}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <img src={leftFood.image} alt={leftFood.name} />
              <p className={styles.foodName}>{leftFood.name}</p>
              {revealed && <p className={styles.calories}>{leftFood.calories} cal</p>}
            </motion.div>

            <motion.div
              key={rightFood.name}
              className={styles.card}
              onClick={() => handleClick("right")}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              <img src={rightFood.image} alt={rightFood.name} />
              <p className={styles.foodName}>{rightFood.name}</p>
              {revealed && <p className={styles.calories}>{rightFood.calories} cal</p>}
            </motion.div>
          </>
        )}
      </div>

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
            <button onClick={handleRestart}>Jugar de nuevo 🔄</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default MoreLessGame;
