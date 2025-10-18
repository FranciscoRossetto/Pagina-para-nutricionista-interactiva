import { useState, useEffect } from "react";

type Food = {
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
  { name: "Papas fritas", calories: 365, image: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png" },
  { name: "Pollo a la plancha", calories: 165, image: "https://cdn-icons-png.flaticon.com/512/590/590836.png" },
  { name: "Panqueques con miel", calories: 300, image: "https://cdn-icons-png.flaticon.com/512/3174/3174880.png" },
  { name: "Yogur natural", calories: 100, image: "https://cdn-icons-png.flaticon.com/512/706/706195.png" },
  { name: "Empanada de carne", calories: 230, image: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png" },
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
    <div className="flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-2xl shadow-lg max-w-lg mx-auto mt-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">¿Más o Menos Calorías?</h1>

      <div className="w-full bg-white rounded-2xl p-6 flex flex-col items-center shadow-md">
        <div className="flex flex-col items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Comida actual</h3>
          <img src={currentFood.image} alt={currentFood.name} className="w-24 h-24 my-2" />
          <p className="text-lg font-medium">{currentFood.name}</p>
          <p className="text-gray-500">{currentFood.calories} cal</p>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-700">¿Y esta?</h3>
          <img src={nextFood.image} alt={nextFood.name} className="w-24 h-24 my-2" />
          <p className="text-lg font-medium">{nextFood.name}</p>

          {revealed && (
            <p className="text-gray-600 mt-2">{nextFood.calories} cal</p>
          )}

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
        </div>

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
