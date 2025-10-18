import { useState, useEffect, useRef } from "react";
import Core from "smooothy";

type Food = {
  name: string;
  calories: number;
  image: string;
};

const foods: Food[] = [
  { name: "Hamburguesa con queso", calories: 550, image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" },
  { name: "Ensalada César", calories: 180, image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  // ... otras comidas
];

function getRandomFood(exclude?: Food): Food {
  let f: Food;
  do {
    f = foods[Math.floor(Math.random() * foods.length)];
  } while (exclude && f.name === exclude.name);
  return f;
}

export function MoreLessGame() {
  const [currentFood, setCurrentFood] = useState<Food>(getRandomFood());
  const [nextFood, setNextFood] = useState<Food>(getRandomFood());
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      new Core(sliderRef.current, {
        infinite: true,
        snap: true,
      });
    }
  }, []);

  const handleGuess = (guess: "more" | "less") => {
    if (gameOver || revealed) return;
    setRevealed(true);

    const correct =
      (guess === "more" && nextFood.calories >= currentFood.calories) ||
      (guess === "less" && nextFood.calories < currentFood.calories);

    if (correct) {
      setMessage("✅ ¡Correcto!");
      setTimeout(() => {
        setScore((prev) => prev + 1);
        setCurrentFood(nextFood);
        setNextFood(getRandomFood(nextFood));
        setRevealed(false);
        setMessage("");
      }, 1200);
    } else {
      setMessage(`❌ ${nextFood.name} tiene ${nextFood.calories} calorías.`);
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setRevealed(false);
    setMessage("");
    setCurrentFood(getRandomFood());
    setNextFood(getRandomFood());
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">¿Más o Menos Calorías?</h1>

      <div className="w-full max-w-md">
        <div className="slider-wrapper" ref={sliderRef}>
          <div className="slide">
            <img src={currentFood.image} alt={currentFood.name} className="w-24 h-24 my-2" />
            <p className="text-lg font-medium">{currentFood.name}</p>
            <p className="text-gray-500">{currentFood.calories} cal</p>
          </div>
          <div className="slide">
            <img src={nextFood.image} alt={nextFood.name} className="w-24 h-24 my-2" />
            <p className="text-lg font-medium">{nextFood.name}</p>
            {revealed && <p className="text-gray-600 mt-2">{nextFood.calories} cal</p>}
          </div>
        </div>

        {!gameOver && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleGuess("less")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-lg"
            >
              Menos 🔽
            </button>
            <button
              onClick={() => handleGuess("more")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-lg"
            >
              Más 🔼
            </button>
          </div>
        )}

        <p className="mt-4 text-xl">{message}</p>
        <p className="mt-2 font-bold text-green-700">Puntaje: {score}</p>

        {gameOver && (
          <button
            onClick={handleRestart}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Jugar de nuevo 🔄
          </button>
        )}
      </div>
    </div>
  );
}
