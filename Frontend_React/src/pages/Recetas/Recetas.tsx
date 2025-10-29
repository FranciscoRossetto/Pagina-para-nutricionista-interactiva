import { useState, useEffect } from "react";
import { recipes } from "../../assets/data/recipes";
import RecipeCarousel from "../../components/Recetas/RecipeCarousel";
import FilterMenu from "../../components/Recetas/FilterMenu";
import HeaderRecetas from "../../components/Recetas/HeaderRecetas";
import { useUser } from "../../contexts/UserContext";
import { getUserFavorites } from "../../utils/api";
import styles from "./Recetas.module.css";

const filtersList = [
  { key: "celiaco", label: "Apto celíacos" },
  { key: "vegetariano", label: "Vegetariano" },
  { key: "vegano", label: "Vegano" },
  { key: "sinHarina", label: "Sin harina" },
  { key: "sinSal", label: "Sin sal" },
];

export default function Recetas() {
  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesKey, setFavoritesKey] = useState(0);
  const [filteredKey, setFilteredKey] = useState(0); 

  const { user, token } = useUser();

  const toggleFilter = (key: string) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );

 
  useEffect(() => {
    setFilteredKey((prev) => prev + 1);
  }, [selected]);

  const filtered = recipes.filter((r) =>
    selected.length === 0 ? false : selected.every((key) => (r.type as any)[key])
  );

  const grouped = filtersList.map((f) => ({
    title: f.label,
    data: recipes.filter((r) => (r.type as any)[f.key]),
  }));

  
  const fetchFavorites = async () => {
    if (!user || !token) return setFavorites([]);
    try {
      const favs = await getUserFavorites(token); 
      const favRecipes = recipes.filter((r) =>
        favs.some((f: any) => f.recipeId === r.id.toString())
      );
      setFavorites(favRecipes);
      setFavoritesKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, token]);

  return (
    <div className={styles.container}>
      <HeaderRecetas onToggleMenu={() => setShowMenu(!showMenu)} showMenu={showMenu} />

      {showMenu && (
        <FilterMenu filters={filtersList} selected={selected} onToggle={toggleFilter} />
      )}

      {/* === RECETAS FILTRADAS === */}
      {selected.length > 0 && filtered.length > 0 && (
        <RecipeCarousel
          key={filteredKey} 
          title={`Recetas filtradas: ${selected
            .map((f) => filtersList.find((i) => i.key === f)?.label || f)
            .join(", ")}`}
          data={filtered}
          onUpdateFavorites={fetchFavorites}
        />
      )}

      {/* === FAVORITOS === */}
      {user && (
        <section style={{ marginTop: "2rem", width: "100%" }}>
          <h2
            style={{
              textAlign: "center",
              color: "#333",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            ⭐ Mis Favoritos
          </h2>

          {favorites.length > 0 ? (
            <RecipeCarousel
              key={favoritesKey}
              title=""
              data={favorites}
              onUpdateFavorites={fetchFavorites}
            />
          ) : (
            <p style={{ textAlign: "center", color: "#777", marginBottom: "2rem" }}>
              Todavía no agregaste favoritos ⭐
            </p>
          )}
        </section>
      )}

      {/* === CARRUSELES POR TIPO === */}
      {grouped.map(
        (g) =>
          g.data.length > 0 && (
            <RecipeCarousel
              key={g.title}
              title={g.title}
              data={g.data}
              onUpdateFavorites={fetchFavorites}
            />
          )
      )}
    </div>
  );
}
