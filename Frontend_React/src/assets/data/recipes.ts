import ensalada from "../imagenes/ensalada.jpg"; 
import pollo from "../imagenes/pollo.jpg";
import pan from "../imagenes/pan.jpg";
import galletas from "../imagenes/galletas.jpg";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string;
  type: {
    celiaco?: boolean;
    vegetariano?: boolean;
    vegano?: boolean;
    sinHarina?: boolean;
    sinSal?: boolean;
  };
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Ensalada de quinoa y vegetales",
    image: ensalada,
    description:
      "Una ensalada fresca y nutritiva con quinoa, tomate, pepino y palta.",
    ingredients: ["Quinoa", "Tomate", "Pepino", "Palta", "Aceite de oliva"],
    steps:
      "Cociná la quinoa hasta que esté tierna. Cortá los vegetales en cubos y mezclalos con la quinoa. Agregá aceite de oliva y, si querés, jugo de limón. Serví fría.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
  {
    id: 2,
    title: "Pollo al horno con calabaza",
    image: pollo,
    description: "Pollo jugoso al horno acompañado de calabaza asada.",
    ingredients: ["Pollo", "Calabaza", "Aceite de oliva", "Romero", "Sal baja"],
    steps:
      "Colocá el pollo en una fuente con las rodajas de calabaza. Agregá aceite y romero. Horneá a 200°C durante 45 minutos o hasta que esté dorado.",
    type: { sinHarina: true },
  },
  {
    id: 3,
    title: "Pan integral sin sal",
    image: pan,
    description: "Pan integral sin sal, ideal para acompañar comidas.",
    ingredients: ["Harina integral", "Levadura", "Agua", "Aceite"],
    steps:
      "Mezclá los ingredientes y amasá hasta obtener una masa uniforme. Dejá reposar una hora, formá los panes y horneá 25 minutos a 180°C.",
    type: { celiaco: false, vegetariano: true, sinSal: true },
  },
  {
    id: 4,
    title: "Galletas de avena y banana",
    image: galletas,
    description: "Galletas dulces sin harina, hechas con avena y banana.",
    ingredients: ["Banana", "Avena", "Canela"],
    steps:
      "Pisá las bananas y mezclalas con la avena y la canela. Formá las galletas y horneá 15 minutos a 180°C.",
    type: { sinHarina: true, vegetariano: true, vegano: true },
  },
];
