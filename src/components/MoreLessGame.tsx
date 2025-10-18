import { useState } from "react";

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
      setMessage(`❌ ${nextFood.name} tiene ${nextFood.calories} cal.`);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">¿Más o Menos Calorías?</h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Comida actual */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <img src={currentFood.image} alt={currentFood.name} className="w-40 h-40 object-contain mb-4" />
          <p className="font-semibold text-lg">{currentFood.name}</p>
          <p className="text-gray-500">{currentFood.calories} cal</p>
        </div>

        {/* Comida siguiente */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center transform transition duration-300 hover:scale-105">
          <img src={nextFood.image} alt={nextFood.name} className="w-40 h-40 object-contain mb-4" />
          <p className="font-semibold text-lg">{nextFood.name}</p>
          {revealed && <p className="text-gray-600 mt-2">{nextFood.calories} cal</p>}

          {!gameOver && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleGuess("less")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Menos 🔽
              </button>
              <button
                onClick={() => handleGuess("more")}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Más 🔼
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl mb-2">{message}</p>
        <p className="font-bold text-green-600 text-lg">Puntaje: {score}</p>
        {gameOver && (
          <button
            onClick={handleRestart}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Jugar de nuevo 🔄
          </button>
        )}
      </div>
    </div>
  );
}
