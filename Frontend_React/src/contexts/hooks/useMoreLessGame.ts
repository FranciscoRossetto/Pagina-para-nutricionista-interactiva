import { useState, useEffect } from "react";

export type Food = {
  name: string;
  calories: number;
  image: string;
};

const foods: Food[] = [
  { name: "Hamburguesa con queso", calories: 550, image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { name: "Ensalada César", calories: 180, image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  { name: "Pizza de muzzarella", calories: 285, image: "https://cdn-icons-png.flaticon.com/512/1404/1404945.png" },
  { name: "Banana", calories: 89, image: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
  { name: "Helado de chocolate", calories: 210, image: "https://cdn-icons-png.flaticon.com/512/813/813860.png" },
  { name: "Taco", calories: 300, image: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png" },
  { name: "Sushi", calories: 200, image: "https://cdn-icons-png.flaticon.com/512/1046/1046787.png" },
  { name: "Papas fritas", calories: 365, image: "https://cdn-icons-png.flaticon.com/512/1046/1046785.png" },
  { name: "Hot Dog", calories: 400, image: "https://cdn-icons-png.flaticon.com/512/1046/1046788.png" },
  { name: "Manzana", calories: 52, image: "https://cdn-icons-png.flaticon.com/512/415/415734.png" },
  { name: "Brownie", calories: 320, image: "https://cdn-icons-png.flaticon.com/512/1046/1046789.png" },
  { name: "Donut", calories: 250, image: "https://cdn-icons-png.flaticon.com/512/1046/1046790.png" },
  { name: "Espagueti", calories: 220, image: "https://cdn-icons-png.flaticon.com/512/1046/1046791.png" },
  { name: "Pollo frito", calories: 450, image: "https://cdn-icons-png.flaticon.com/512/1046/1046792.png" },
];

function getRandomFood(excludeList: Food[] = []): Food {
  while (true) {
    const f = foods[Math.floor(Math.random() * foods.length)];
    if (!excludeList.some(food => food.name === f.name)) return f;
  }
}

export function useMoreLessGame() {
  const [leftFood, setLeftFood] = useState<Food>(() => getRandomFood());
  const [rightFood, setRightFood] = useState<Food>(() => getRandomFood([leftFood]));
  const [lastRight, setLastRight] = useState<Food | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("highScore");
    return saved ? parseInt(saved) : 0;
  });
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // 🧩 Actualiza el puntaje máximo
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
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
      const newRight = getRandomFood([newLeft, ...(lastRight ? [lastRight] : [])]);
      setRightFood(newRight);
      setLastRight(newRight);
      setRevealed(false);
    }, 1200);
  };

  const handleRestart = () => {
    const newLeft = getRandomFood();
    const newRight = getRandomFood([newLeft]);
    setLeftFood(newLeft);
    setRightFood(newRight);
    setLastRight(newRight);
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
