/*
import ensalada from "../imagenes/ensalada.jpg"; 
import pollo from "../imagenes/pollo.jpg";
import pan from "../imagenes/pan.jpg";
import galletas from "../imagenes/galletas.jpg";
import sopa from "../imagenes/sopa.jpg";
import budin from "../imagenes/budin.jpg";
import smoothie from "../imagenes/smoothie.jpg";
import hummus from "../imagenes/hummus.jpg";
import lentejas from "../imagenes/lentejas.jpg";
import salteado from "../imagenes/salteado.jpg";
import arroz from "../imagenes/arroz.jpg";
import papas from "../imagenes/papas.jpg";
import fideos from "../imagenes/fideos.jpg";
import jugo from "../imagenes/jugo.jpg";

import tortilla from "../imagenes/tortilla.jpg";
 
import brochetas from "../imagenes/zapallitos.jpg";
/*
import brownie from "../imagenes/brownie.jpg";
import hamburguesa from "../imagenes/hamburguesa.jpg";
import frutas from "../imagenes/frutas.jpg";


ESTO HAY QUE USARLO SI TENGO LAS CARPETA DE IMAGENES ADENTRO DE ASSETS PERO COMO LO PASE A PUBLIC NO HACE FALTA
*/
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
    image: "/imagenes/ensalada.jpg",
    description:
      "Una ensalada fresca y nutritiva con quinoa, tomate, pepino y palta.",
    ingredients: ["Quinoa", "Tomate", "Pepino", "Palta", "Aceite de oliva"],
    steps:
      "Cociná la quinoa hasta que esté tierna. Cortá los vegetales en cubos y mezclalos con la quinoa. Agregá aceite de oliva y jugo de limón. Serví fría.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
 
  {
    id: 2,
    title: "Pollo al horno con calabaza",
    image: "/imagenes/pollo.jpg",
    description: "Pollo jugoso al horno acompañado de calabaza asada.",
    ingredients: ["Pollo", "Calabaza", "Aceite de oliva", "Romero", "Sal baja"],
    steps:
      "Colocá el pollo en una fuente con las rodajas de calabaza. Agregá aceite y romero. Horneá a 200°C durante 45 minutos o hasta que esté dorado.",
    type: { sinHarina: true },
  },
   
  {
    id: 3,
    title: "Pan integral sin sal",
     image: "/imagenes/pan.jpg",
    description: "Pan integral sin sal, ideal para acompañar comidas.",
    ingredients: ["Harina integral", "Levadura", "Agua", "Aceite"],
    steps:
      "Mezclá los ingredientes y amasá hasta obtener una masa uniforme. Dejá reposar una hora, formá los panes y horneá 25 minutos a 180°C.",
    type: { celiaco: false, vegetariano: true, sinSal: true },
  },
  {
    id: 4,
    title: "Galletas de avena y banana",
     image: "/imagenes/galletas.jpg",
    description: "Galletas dulces sin harina, hechas con avena y banana.",
    ingredients: ["Banana", "Avena", "Canela"],
    steps:
      "Pisá las bananas y mezclalas con la avena y la canela. Formá las galletas y horneá 15 minutos a 180°C.",
    type: { sinHarina: true, vegetariano: true, vegano: true },
  },

  {
    id: 5,
    title: "Sopa verde de espinaca y calabacín",
     image: "/imagenes/sopa.jpg",
    description: "Sopa ligera y saludable sin sal ni harina.",
    ingredients: ["Espinaca", "Calabacín", "Cebolla", "Aceite de oliva"],
    steps: "Salteá los vegetales, agregá agua y cociná hasta ablandar. Procesá y serví.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: false },
  },
  {
    id: 6,
    title: "Budín de manzana y avena",
     image: "/imagenes/budin.jpg",
    description: "Budín húmedo con avena, sin harina ni sal.",
    ingredients: ["Avena", "Manzana", "Banana", "Canela", "leche"],
    steps: "Mezclá todo, colocá en un molde y horneá 25 minutos.",
    type: { celiaco: true, vegetariano: true, vegano: false, sinHarina: true, sinSal: true },
  },
  {
    id: 7,
    title: "Smoothie verde energizante",
     image: "/imagenes/smoothie.jpg",
    description: "Bebida refrescante con espinaca, manzana y limón.",
    ingredients: ["Espinaca", "Manzana", "Banana", "Jugo de limón"],
    steps: "Licuar todo con agua fría hasta obtener una textura cremosa.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
  {
    id: 8,
    title: "Hummus clásico",
    image: "/imagenes/hummus.jpg",
    description: "Crema de garbanzos suave y sin sal.",
    ingredients: ["Garbanzos", "Tahini", "Jugo de limón", "Aceite de oliva"],
    steps: "Procesá todos los ingredientes hasta obtener una pasta cremosa.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: false },
  },
  {
    id: 9,
    title: "Ensalada tibia de lentejas",
     image: "/imagenes/lentejas.jpg",
    description: "Combinación de lentejas, zanahoria y cebolla al vapor.",
    ingredients: ["Lentejas", "Zanahoria", "Cebolla", "Aceite de oliva"],
    steps: "Cociná las lentejas y mezclalas con los vegetales al vapor.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },

  
  {
    id: 10,
    title: "Salteado de vegetales con tofu",
     image: "/imagenes/salteado.jpg",
    description: "Plato rápido y apto celíacos, con tofu y vegetales.",
    ingredients: ["Tofu", "Zanahoria", "Brócoli", "Aceite de sésamo"],
    steps: "Salteá los ingredientes a fuego fuerte y serví caliente.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true },
  },
  {
    id: 11,
    title: "Arroz integral con verduras",
     image: "/imagenes/arroz.jpg",
    description: "Arroz integral con vegetales frescos y condimentos naturales.",
    ingredients: ["Arroz integral", "Pimiento", "Cebolla", "Zanahoria"],
    steps: "Cociná el arroz y mezclá con los vegetales salteados.",
    type: { celiaco: true, vegetariano: true },
  },
  {
    id: 12,
    title: "Papas al horno con romero",
     image: "/imagenes/papas.jpg",
    description: "Papas doradas al horno, sin harina ni gluten.",
    ingredients: ["Papas", "Aceite de oliva", "Romero"],
    steps: "Cortá las papas, mezclá con aceite y romero y horneá 40 minutos.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true },
  },

  {
    id: 13,
    title: "Fideos con salsa de tomate",
     image: "/imagenes/fideos.jpg",
    description: "Clásico plato de pastas con salsa natural.",
    ingredients: ["Fideos", "Tomate", "Cebolla", "Aceite de oliva"],
    steps: "Herví los fideos y mezclá con la salsa casera.",
    type: { vegetariano: true },
  },
  {
    id: 14,
    title: "Jugo de naranja y zanahoria",
     image: "/imagenes/jugo.jpg",
    description: "Refrescante jugo natural sin azúcar ni sal.",
    ingredients: ["Naranja", "Zanahoria", "Agua"],
    steps: "Licuar todo y servir bien frío.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },

  {
    id: 15,
    title: "Tortilla de papas sin sal",
       image: "/imagenes/tortilla.jpg",
    description: "Tortilla liviana sin sal agregada.",
    ingredients: ["Papas", "Huevos", "Aceite de oliva"],
    steps: "Batí los huevos, mezclá con papas cocidas y cociná en sartén.",
    type: { vegetariano: true, sinSal: true },
  },
   
  {
    id: 16,
    title: "Brochetas de verduras al horno",
       image: "/imagenes/brochetas.jpg",
    description: "Coloridas brochetas de vegetales asados.",
    ingredients: ["Zanahoria", "Zapallito", "Morrón", "Aceite de oliva"],
    steps: "Armá las brochetas y horneá hasta dorar.",
    type: { vegetariano: true, vegano: true, sinHarina: true },
  },
 
  {
    id: 17,
    title: "Brownie sin gluten",
       image: "/imagenes/brownie.jpg",
    description: "Brownie húmedo hecho con harina de almendras.",
    ingredients: ["Chocolate", "Huevos", "Harina de almendras"],
    steps: "Mezclá los ingredientes y horneá 20 minutos a 180°C.",
    type: { celiaco: true, vegetariano: true },
  },
  {
    id: 18,
    title: "Hamburguesa vegetal",
       image: "/imagenes/hamburguesa.jpg",
    description: "Hamburguesa a base de legumbres y avena.",
    ingredients: ["Porotos", "Avena", "Cebolla", "Ajo"],
    steps: "Procesá los ingredientes, formá las hamburguesas y cociná a la plancha.",
    type: { vegetariano: true, vegano: true, sinHarina: true },
  },
  {
    id: 19,
    title: "Mix de frutas frescas",
       image: "/imagenes/frutas.jpg",
    description: "Postre natural de frutas frescas y sin sal.",
    ingredients: ["Manzana", "Banana", "Naranja", "Frutilla"],
    steps: "Cortá y mezclá todas las frutas en un bol.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
];

