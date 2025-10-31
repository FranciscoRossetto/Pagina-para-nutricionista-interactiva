import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./IMCPage.module.css";

export default function IMCPage() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const [categoria, setCategoria] = useState("");

  const calcularIMC = () => {
    const alturaM = parseFloat(altura) / 100;
    const pesoKg = parseFloat(peso);

    if (!pesoKg || !alturaM) {
      setImc(null);
      setCategoria("");
      return;
    }

    const imcCalc = pesoKg / (alturaM * alturaM);
    setImc(imcCalc);

    if (imcCalc < 18.5) setCategoria("Bajo peso");
    else if (imcCalc < 24.9) setCategoria("Peso normal");
    else if (imcCalc < 29.9) setCategoria("Sobrepeso");
    else setCategoria("Obesidad");
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <motion.h2
        className={styles.title}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Calculadora de IMC
      </motion.h2>

      <motion.div
        className={styles.form}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label>
          Peso (kg):
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ej: 70"
          />
        </label>

        <label>
          Altura (cm):
          <input
            type="number"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Ej: 175"
          />
        </label>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={calcularIMC}
          className={styles.button}
        >
          Calcular
        </motion.button>
      </motion.div>

      {imc !== null && (
        <motion.div
          className={styles.result}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Tu IMC es: {imc.toFixed(2)}</h3>
          <p className={styles[categoria.replace(" ", "").toLowerCase()]}>
            {categoria}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
