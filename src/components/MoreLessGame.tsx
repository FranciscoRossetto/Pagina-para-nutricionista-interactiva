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
  { name: "Papas fritas", calories: 365, image: "https://cdn-icons-png.flaticon.com/512/1046/1046786.png" },
  { name: "Pollo a la plancha", calories: 165, image: "https://cdn-icons-png.flaticon.com/512/590/590836.png" },
  { name: "Panqueques con miel", calories: 300, image: "https://cdn-icons-png.flaticon.com/512/3174/3174880.png" },
];

export function MoreLessGame() {
  const [currentFood, setCurrentFood] = useState<Food>(foods[Math.floor(Math.random() * foods.length)]);
  const [nextFood, setNextFood] = useState<Food>(foods[Math.floor(Math.random() * foods.length)]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = (guess: "more" | "less") => {
    if (gameOver) return;

    const correct =
      (guess === "more" && nextFood.calories >= currentFood.calories) ||
      (guess === "less" && nextFood.calories < currentFood.calories);

    if (correct) {
      setScore((prev) => prev + 1);
      setMessage("✅ ¡Correcto!");
      setCurrentFood(nextFood);
      setNextFood(foods[Math.floor(Math.random() * foods.length)]);
    } else {
      setMessage(`❌ Incorrecto. ${nextFood.name} tiene ${nextFood.calories} calorías.`);
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setMessage("");
    setGameOver(false);
    setCurrentFood(foods[Math.floor(Math.random() * foods.length)]);
    setNextFood(foods[Math.floor(Math.random() * foods.length)]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Juego: ¿Más o Menos Calorías?</h2>

      <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-md">
        <h3 className="text-lg font-semibold">Comida actual:</h3>
        <img src={currentFood.image} alt={currentFood.name} className="w-24 h-24" />
        <p className="font-medium">{currentFood.name}</p>
        <p className="text-gray-600">{currentFood.calories} cal</p>

        <hr className="w-full my-4" />

        <h3 className="text-lg font-semibold">¿La siguiente tiene más o menos calorías?</h3>
        <img src={nextFood.image} alt={nextFood.name} className="w-24 h-24" />
        <p className="font-medium">{nextFood.name}</p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleGuess("less")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Menos 🔽
          </button>
          <button
            onClick={() => handleGuess("more")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Más 🔼
          </button>
        </div>

        <p className="mt-4 text-lg">{message}</p>
        <p className="mt-2 font-bold text-green-700">Puntaje: {score}</p>

        {gameOver && (
          <button
            onClick={handleRestart}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Reiniciar 🔄
          </button>
        )}
      </div>
    </div>
  );
}
