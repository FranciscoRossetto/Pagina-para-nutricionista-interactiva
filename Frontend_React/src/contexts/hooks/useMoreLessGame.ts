import { useState, useEffect } from "react";
import axios from "axios";
import type { Food } from "../../assets/data/foodData";
import { getRandomFood } from "../../assets/data/foodData";
import { useUser } from "../../contexts/UserContext";

const API_URL = "http://localhost:4000/api";

export default function useMoreLessGame() {
  const { user } = useUser();

  const [leftFood, setLeftFood] = useState<Food | null>(null);
  const [rightFood, setRightFood] = useState<Food | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const left = getRandomFood();
    let right = getRandomFood([left]);
    while (right.name === left.name) right = getRandomFood([left]);
    setLeftFood(left);
    setRightFood(right);
  }, []);

  useEffect(() => {
    const fetchHighScore = async () => {
      if (!user || user.trim() === "") return;
      try {
        const res = await axios.get(`${API_URL}/highscore/${user}`);
        setHighScore(res.data?.score || 0);
      } catch (err) {
        console.error("Error al obtener highscore:", err);
      }
    };
    fetchHighScore();
  }, [user]);

  useEffect(() => {
    const updateHighScore = async () => {
      if (score > highScore) {
        setHighScore(score);
        if (user && user.trim() !== "") {
          try {
            await axios.post(`${API_URL}/highscore`, { player: user, score });
          } catch (err) {
            console.error("Error al guardar highscore:", err);
          }
        } else {
          localStorage.setItem("localHighScore", String(score));
        }
      }
    };
    updateHighScore();
  }, [score, user]);

  const handleClick = (selected: "left" | "right") => {
    if (!leftFood || !rightFood || revealed || gameOver) return;

    const correct = leftFood.calories >= rightFood.calories ? "left" : "right";
    setRevealed(true);

    if (selected === correct) {
      setScore(prev => prev + 1);
    } else {
      setGameOver(true);
    }

    setTimeout(() => {
      const newLeft = rightFood;
      let newRight = getRandomFood([newLeft]);
      while (newRight.name === newLeft.name) newRight = getRandomFood([newLeft]);
      setLeftFood(newLeft);
      setRightFood(newRight);
      setRevealed(false);
    }, 1000);
  };

  const handleRestart = () => {
    const left = getRandomFood();
    let right = getRandomFood([left]);
    while (right.name === left.name) right = getRandomFood([left]);
    setLeftFood(left);
    setRightFood(right);
    setScore(0);
    setRevealed(false);
    setGameOver(false);
  };

  return {
    leftFood,
    rightFood,
    revealed,
    gameOver,
    score,
    highScore,
    handleClick,
    handleRestart,
  };
}
