import { useState, useEffect } from "react";
import axios from "axios";
import type { Food } from "../../assets/data/foodData";
import { foods, getRandomFood } from "../../assets/data/foodData";


export function useMoreLessGame() {
  const [leftFood, setLeftFood] = useState<Food>(() => getRandomFood());
  const [rightFood, setRightFood] = useState<Food>(() => getRandomFood([leftFood]));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // 🔹 Obtener high score de la base de datos al iniciar
  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/highscore");
        setHighScore(res.data?.score || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHighScore();
  }, []);

  // 🔹 Actualizar score local y enviar a la base de datos si es récord
  useEffect(() => {
    const updateHighScore = async () => {
      if (score > highScore) {
        setHighScore(score);
        try {
          await axios.post("http://localhost:4000/api/highscore", {
            player: "Jugador1", // podés reemplazar por nombre del jugador
            score,
          });
        } catch (err) {
          console.error(err);
        }
      }
    };
    updateHighScore();
  }, [score]);

  const handleClick = (selected: "left" | "right") => {
    if (revealed || gameOver) return;
    const correct = leftFood.calories >= rightFood.calories ? "left" : "right";
    setRevealed(true);

    if (selected === correct) setScore(prev => prev + 1);
    else setGameOver(true);

    setTimeout(() => {
      const newLeft = rightFood;
      setLeftFood(newLeft);
      const newRight = getRandomFood([newLeft]);
      setRightFood(newRight);
      setRevealed(false);
    }, 1200);
  };

  const handleRestart = () => {
    setLeftFood(getRandomFood());
    setRightFood(getRandomFood());
    setScore(0);
    setRevealed(false);
    setGameOver(false);
  };

  return { leftFood, rightFood, revealed, gameOver, score, highScore, handleClick, handleRestart };
}
