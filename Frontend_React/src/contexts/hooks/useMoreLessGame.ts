import { useState, useEffect } from "react";
import type { Food } from "../../assets/data/foodData";
import { getRandomFood, foodList } from "../../assets/data/foodData";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { API } from "../../config/api";

export default function useMoreLessGame() {
  const { user } = useUser();

  const [leftFood, setLeftFood] = useState<Food | null>(null);
  const [rightFood, setRightFood] = useState<Food | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [deck, setDeck] = useState<Food[]>([]);

  useEffect(() => {
    const shuffled = shuffleArray([...foodList]);
    setDeck(shuffled);

    const left = shuffled[0];
    const right = shuffled[1] || getRandomFood([left]);
    setLeftFood(left);
    setRightFood(right);
    setDeck(shuffled.slice(2));
  }, []);

  function shuffleArray(array: Food[]): Food[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  useEffect(() => {
    const fetchHighScore = async () => {
      if (user && user.trim() !== "") {
        try {
          const res = await axios.get(`${API}/highscore/${user}`);
          setHighScore(res.data?.score || 0);
        } catch (err) {
          console.error("Error al obtener highscore:", err);
        }
      } else {
        const local = localStorage.getItem("localHighScore");
        if (local) setHighScore(Number(local));
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
            await axios.post(`${API}/highscore`, { player: user, score });
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

    const correct =
      leftFood.calories === rightFood.calories
        ? "either"
        : leftFood.calories >= rightFood.calories
        ? "left"
        : "right";

    setRevealed(true);

    if (correct === "either" || selected === correct) {
      setScore(prev => prev + 1);
    } else {
      setGameOver(true);
    }

    setTimeout(() => {
      let newLeft = rightFood;
      let newRight: Food;

      let newDeck = [...deck];
      if (newDeck.length < 1) {
        newDeck = shuffleArray([...foodList]);
      }

      do {
        newRight = newDeck[0];
        newDeck = newDeck.slice(1);
      } while (newRight.name === newLeft.name && newDeck.length > 0);

      setLeftFood(newLeft);
      setRightFood(newRight);
      setDeck(newDeck);
      setRevealed(false);
    }, 1000);
  };

  const handleRestart = () => {
    const shuffled = shuffleArray([...foodList]);
    const left = shuffled[0];
    const right = shuffled[1] || getRandomFood([left]);
    setLeftFood(left);
    setRightFood(right);
    setDeck(shuffled.slice(2));
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
