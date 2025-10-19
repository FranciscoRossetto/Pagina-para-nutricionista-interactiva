export interface Recipe {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  type: {
    celiaco?: boolean;
    vegetariano?: boolean;
    vegano?: boolean;
    sinHarina?: boolean;
    sinSal?: boolean;
  };
}
//poner las imagenes, descargarlas, y despues poner bien la data que esta asi nomas

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Ensalada de quinoa y vegetales",
    image: "/imagenes/ensalada.jpg",
    description: "Una ensalada fresca y nutritiva con quinoa, tomate, pepino y palta.",
    ingredients: ["Quinoa", "Tomate", "Pepino", "Palta", "Aceite de oliva"],
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
  {
    id: 2,
    title: "Pollo al horno con calabaza",
    image: "/imagenes/pollo.jpg",
    description: "Pollo jugoso al horno acompañado de calabaza asada.",
    ingredients: ["Pollo", "Calabaza", "Aceite de oliva", "Romero", "Sal baja"],
    type: { sinHarina: true },
  },
  {
    id: 3,
    title: "Pan integral sin sal",
    image: "/imagenes/pan.jpg",
    description: "Pan integral sin sal, ideal para acompañar comidas.",
    ingredients: ["Harina integral", "Levadura", "Agua", "Aceite"],
    type: { celiaco: false, vegetariano: true, sinSal: true },
  },
  {
    id: 4,
    title: "Galletas de avena y banana",
    image: "/imagenes/galletas.jpg",
    description: "Galletas dulces sin harina, hechas con avena y banana.",
    ingredients: ["Banana", "Avena", "Canela"],
    type: { sinHarina: true, vegetariano: true, vegano: true },
  },
];
