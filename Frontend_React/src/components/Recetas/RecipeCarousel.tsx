import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import RecipeCard from "./RecipeCard";
import type { Recipe } from "../../assets/data/recipes";
import styles from "../../pages/Recetas/Recetas.module.css";

export default function RecipeCarousel({
  title,
  data,
}: {
  title: string;
  data: Recipe[];
}) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: { perView: 3, spacing: 20 },
    breakpoints: {
      "(max-width: 1200px)": { slides: { perView: 2, spacing: 15 } },
      "(max-width: 768px)": { slides: { perView: 1, spacing: 10 } },
    },
  });

  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.carouselTitle}>{title}</h2>

      <div
        key={data.length + title}
        ref={sliderRef}
        className={`keen-slider ${styles.slider}`}
      >
        {data.map((recipe) => (
          <div key={recipe.id} className={`keen-slider__slide ${styles.slide}`}>
            <RecipeCard
              recipe={recipe}
              flipped={flippedCard === recipe.id}
              onFlip={() =>
                setFlippedCard(flippedCard === recipe.id ? null : recipe.id)
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
