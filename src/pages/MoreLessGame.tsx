import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// 🔹 Versión segura de getRandomFood
function getRandomFood(excludeList: Food[] = []): Food {
  while (true) {
    const f = foods[Math.floor(Math.random() * foods.length)];
    if (!excludeList.some(food => food.name === f.name)) return f;
  }
}

function MoreLessGame() {
  const [leftFood, setLeftFood] = useState<Food>(getRandomFood());
  const [rightFood, setRightFood] = useState<Food>(getRandomFood([leftFood]));
  const [lastRight, setLastRight] = useState<Food | null>(null);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (selected: "left" | "right") => {
    if (revealed || gameOver) return;

    const correct = leftFood.calories >= rightFood.calories ? "left" : "right";
    setRevealed(true);

    if (selected === correct) setScore(prev => prev + 1);
    else setGameOver(true);

    setTimeout(() => {
      const newLeft = rightFood; // siempre mover la derecha a la izquierda
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

  return (
    <div className="container">
      <h1>¿Cuál tiene más calorías?</h1>
      <p className="score">Puntaje: {score}</p>

      <div className="cards">
        {!gameOver && (
          <>
            <motion.div
              key={leftFood.name}
              className="card"
              onClick={() => handleClick("left")}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <img src={leftFood.image} alt={leftFood.name} />
              <p className="food-name">{leftFood.name}</p>
              {revealed && <p className="calories">{leftFood.calories} cal</p>}
            </motion.div>

            <motion.div
              key={rightFood.name}
              className="card"
              onClick={() => handleClick("right")}
              initial={{ x: 300, opacity: 0, rotate: 20 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: 300, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <img src={rightFood.image} alt={rightFood.name} />
              <p className="food-name">{rightFood.name}</p>
              {revealed && <p className="calories">{rightFood.calories} cal</p>}
            </motion.div>
          </>
        )}
      </div>

      {gameOver && (
        <motion.div
          className="gameover-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="gameover"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2>¡Game Over!</h2>
            <p className="final-score">Tu puntaje: {score}</p>
            <button onClick={handleRestart}>Jugar de nuevo 🔄</button>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ffecd2, #fcb69f);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
          position: relative;
        }
        h1 {
          font-size: 2.8rem;
          margin-bottom: 20px;
          color: #333;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.2);
        }
        .score {
          font-size: 1.5rem;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 20px;
        }
        .cards {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }
        .card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          width: 220px;
          box-shadow: 0 12px 25px rgba(0,0,0,0.15);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s, border 0.3s;
        }
        .card:hover {
          transform: scale(1.1);
          box-shadow: 0 16px 30px rgba(0,0,0,0.25);
        }
        img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          margin-bottom: 15px;
        }
        .food-name {
          font-weight: bold;
          font-size: 1.2rem;
          margin-bottom: 5px;
        }
        .calories {
          color: #666;
          font-size: 1rem;
        }

        /* Game Over */
        .gameover-wrapper {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .gameover {
          background: white;
          padding: 40px 60px;
          border-radius: 25px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gameover h2 {
          font-size: 2.5rem;
          margin-bottom: 15px;
          color: #e74c3c;
        }
        .gameover .final-score {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 25px;
        }
        .gameover button {
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 15px;
          border: none;
          background: #27ae60;
          color: white;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }
        .gameover button:hover {
          background: #2ecc71;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

export default MoreLessGame;