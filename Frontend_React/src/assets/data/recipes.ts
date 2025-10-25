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
    ingredients: [
      "250g de quinoa",
      "2 tomates medianos",
      "1 pepino grande",
      "1 palta madura",
      "2 cucharadas de aceite de oliva",
      "Jugo de 1 limón",
      "Sal y pimienta al gusto",
    ],
    steps:
      "1. Cocina la quinoa según las instrucciones del paquete (aproximadamente 15-20 minutos). 2. Mientras tanto, corta los tomates y el pepino en cubos pequeños. 3. Corta la palta en cubos y reserva. 4. Una vez que la quinoa esté cocida, déjala enfriar. 5. Mezcla la quinoa con los vegetales y el aceite de oliva. 6. Agrega jugo de limón y mezcla bien. 7. Sirve fría.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
  {
    id: 2,
    title: "Pollo al horno con calabaza",
    image: "/imagenes/pollo.jpg",
    description: "Pollo jugoso al horno acompañado de calabaza asada.",
    ingredients: [
      "1 pollo de 1,5 kg",
      "1 calabaza grande",
      "2 cucharadas de aceite de oliva",
      "2 ramitas de romero fresco",
      "Sal baja al gusto",
    ],
    steps:
      "1. Precalienta el horno a 200°C. 2. Corta la calabaza en rodajas gruesas y colócalas en una bandeja para horno. 3. Coloca el pollo en la bandeja con las rodajas de calabaza. 4. Rocía con aceite de oliva y coloca las ramitas de romero encima del pollo. 5. Hornea durante 45 minutos o hasta que el pollo esté dorado y cocido. 6. Sirve caliente.",
    type: { sinHarina: true },
  },
  {
    id: 3,
    title: "Pan integral sin sal",
    image: "/imagenes/pan.jpg",
    description: "Pan integral sin sal, ideal para acompañar comidas.",
    ingredients: [
      "500g de harina integral",
      "10g de levadura seca",
      "350ml de agua tibia",
      "1 cucharada de aceite de oliva",
    ],
    steps:
      "1. Mezcla la harina y la levadura en un tazón grande. 2. Agrega el agua tibia y el aceite de oliva. 3. Amasa durante 10 minutos hasta que la masa esté suave. 4. Deja reposar en un lugar cálido durante 1 hora o hasta que haya duplicado su tamaño. 5. Precalienta el horno a 180°C. 6. Forma los panes y colócalos en una bandeja para horno. 7. Hornea durante 25 minutos o hasta que estén dorados.",
    type: { celiaco: false, vegetariano: true, sinSal: true },
  },
  {
    id: 4,
    title: "Galletas de avena y banana",
    image: "/imagenes/galletas.jpg",
    description: "Galletas dulces sin harina, hechas con avena y banana.",
    ingredients: [
      "2 bananas maduras",
      "200g de avena",
      "1 cucharadita de canela en polvo",
    ],
    steps:
      "1. Pela las bananas y aplástalas en un tazón. 2. Agrega la avena y la canela. 3. Mezcla hasta que esté bien combinado. 4. Forma las galletas y colócalas en una bandeja para horno. 5. Hornea a 180°C durante 15 minutos o hasta que estén doradas.",
    type: { sinHarina: true, vegetariano: true, vegano: true },
  },
  {
    id: 5,
    title: "Sopa verde de espinaca y calabacín",
    image: "/imagenes/sopa.jpg",
    description: "Sopa ligera y saludable sin sal ni harina.",
    ingredients: [
      "200g de espinacas frescas",
      "1 calabacín grande",
      "1 cebolla pequeña",
      "2 cucharadas de aceite de oliva",
      "500ml de agua",
    ],
    steps:
      "1. Calienta el aceite en una olla y sofríe la cebolla hasta que esté suave. 2. Agrega el calabacín y cocina durante 5 minutos. 3. Agrega las espinacas y cocina hasta que estén tiernas. 4. Agrega el agua y cocina durante 10 minutos. 5. Licúa la sopa hasta que esté suave. 6. Sirve caliente.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: false },
  },
  {
    id: 6,
    title: "Budín de manzana y avena",
    image: "/imagenes/budin.jpg",
    description: "Budín húmedo con avena, sin harina ni sal.",
    ingredients: [
      "200g de avena",
      "2 manzanas grandes",
      "2 bananas maduras",
      "1 cucharadita de canela en polvo",
      "100ml de leche",
    ],
    steps:
      "1. Mezcla la avena, las manzanas picadas, las bananas aplastadas y la canela en un tazón. 2. Agrega la leche y mezcla hasta que esté bien combinado. 3. Coloca la mezcla en un molde para budín. 4. Hornea a 180°C durante 25 minutos o hasta que esté dorado.",
    type: { celiaco: true, vegetariano: true, vegano: false, sinHarina: true, sinSal: true },
  },
  {
    id: 7,
    title: "Smoothie verde energizante",
    image: "/imagenes/smoothie.jpg",
    description: "Bebida refrescante con espinaca, manzana y limón.",
    ingredients: [
      "200g de espinacas frescas",
      "1 manzana grande",
      "1 banana madura",
      "Jugo de 1 limón",
      "200ml de agua",
    ],
    steps:
      "1. Licúa todos los ingredientes hasta que estén bien combinados. 2. Sirve frío.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
  {
    id: 8,
    title: "Hummus clásico",
    image: "/imagenes/hummus.jpg",
    description: "Crema de garbanzos suave y sin sal.",
    ingredients: [
      "250g de garbanzos cocidos",
      "2 cucharadas de tahini",
      "Jugo de 1 limón",
      "2 cucharadas de aceite de oliva",
    ],
    steps:
      "1. Licúa todos los ingredientes hasta que estén bien combinados. 2. Sirve con vegetales crudos o crackers.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: false },
  },
  {
    id: 9,
    title: "Ensalada tibia de lentejas",
    image: "/imagenes/lentejas.jpg",
    description: "Combinación de lentejas, zanahoria y cebolla al vapor.",
    ingredients: [
      "200g de lentejas cocidas",
      "1 zanahoria grande",
      "1 cebolla pequeña",
      "2 cucharadas de aceite de oliva",
    ],
    steps:
      "1. Cocina las lentejas según las instrucciones del paquete. 2. Mientras tanto, corta la zanahoria y la cebolla en cubos pequeños. 3. Cocina al vapor durante 5 minutos. 4. Mezcla las lentejas con los vegetales y el aceite de oliva. 5. Sirve tibia.",
    type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
  },
  {
  id: 10,
  title: "Salteado de vegetales con tofu",
  image: "/imagenes/salteado.jpg",
  description: "Plato rápido y apto celíacos, con tofu y vegetales.",
  ingredients: [
    "200g de tofu firme",
    "1 zanahoria grande",
    "1 brócoli grande",
    "2 cucharadas de aceite de sésamo",
    "Sal y pimienta al gusto",
  ],
  steps:
    "1. Corta el tofu en cubos pequeños y reserva. 2. Corta la zanahoria y el brócoli en trozos pequeños. 3. Calienta el aceite en una sartén y sofríe el tofu hasta que esté dorado. 4. Agrega la zanahoria y el brócoli y cocina durante 5 minutos o hasta que estén tiernos. 5. Sirve caliente.",
  type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true },
},
{
  id: 11,
  title: "Arroz integral con verduras",
  image: "/imagenes/arroz.jpg",
  description: "Arroz integral con vegetales frescos y condimentos naturales.",
  ingredients: [
    "200g de arroz integral",
    "1 pimiento rojo",
    "1 cebolla pequeña",
    "1 zanahoria grande",
    "2 cucharadas de aceite de oliva",
  ],
  steps:
    "1. Cocina el arroz según las instrucciones del paquete. 2. Mientras tanto, corta el pimiento, la cebolla y la zanahoria en cubos pequeños. 3. Calienta el aceite en una sartén y sofríe los vegetales hasta que estén tiernos. 4. Mezcla el arroz cocido con los vegetales y sirve.",
  type: { celiaco: true, vegetariano: true },
},
{
  id: 12,
  title: "Papas al horno con romero",
  image: "/imagenes/papas.jpg",
  description: "Papas doradas al horno, sin harina ni gluten.",
  ingredients: [
    "4 papas grandes",
    "2 cucharadas de aceite de oliva",
    "2 ramitas de romero fresco",
  ],
  steps:
    "1. Precalienta el horno a 200°C. 2. Corta las papas en rodajas gruesas. 3. Mezcla las papas con el aceite y el romero en un tazón. 4. Coloca las papas en una bandeja para horno y hornea durante 40 minutos o hasta que estén doradas. 5. Sirve caliente.",
  type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true },
},
{
  id: 13,
  title: "Fideos con salsa de tomate",
  image: "/imagenes/fideos.jpg",
  description: "Clásico plato de pastas con salsa natural.",
  ingredients: [
    "200g de fideos",
    "2 tomates grandes",
    "1 cebolla pequeña",
    "2 cucharadas de aceite de oliva",
  ],
  steps:
    "1. Cocina los fideos según las instrucciones del paquete. 2. Mientras tanto, corta los tomates y la cebolla en cubos pequeños. 3. Calienta el aceite en una sartén y sofríe la cebolla hasta que esté suave. 4. Agrega los tomates y cocina durante 10 minutos. 5. Mezcla los fideos cocidos con la salsa y sirve.",
  type: { vegetariano: true },
},
{
  id: 14,
  title: "Jugo de naranja y zanahoria",
  image: "/imagenes/jugo.jpg",
  description: "Refrescante jugo natural sin azúcar ni sal.",
  ingredients: [
    "4 naranjas",
    "2 zanahorias grandes",
    "200ml de agua",
  ],
  steps:
    "1. Exprime las naranjas y las zanahorias en una licuadora. 2. Agrega el agua y mezcla bien. 3. Sirve frío.",
  type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
},
{
  id: 15,
  title: "Tortilla de papas sin sal",
  image: "/imagenes/tortilla.jpg",
  description: "Tortilla liviana sin sal agregada.",
  ingredients: [
    "4 papas grandes",
    "4 huevos",
    "2 cucharadas de aceite de oliva",
  ],
  steps:
    "1. Corta las papas en cubos pequeños y cocina en agua hirviendo hasta que estén tiernas. 2. Escurre las papas y mezcla con los huevos batidos. 3. Calienta el aceite en una sartén y cocina la mezcla hasta que esté dorada y cocida. 4. Sirve caliente.",
  type: { vegetariano: true, sinSal: true },
},
{
  id: 16,
  title: "Brochetas de verduras al horno",
  image: "/imagenes/brochetas.jpg",
  description: "Coloridas brochetas de vegetales asados.",
  ingredients: [
    "1 zanahoria grande",
    "1 zapallito grande",
    "1 morrón grande",
    "2 cucharadas de aceite de oliva",
  ],
  steps:
    "1. Precalienta el horno a 200°C. 2. Corta los vegetales en trozos pequeños y ensarta en brochetas. 3. Mezcla con el aceite y hornea durante 20 minutos o hasta que estén tiernos. 4. Sirve caliente.",
  type: { vegetariano: true, vegano: true, sinHarina: true },
},
{
  id: 17,
  title: "Brownie sin gluten",
  image: "/imagenes/brownie.jpg",
  description: "Brownie húmedo hecho con harina de almendras.",
  ingredients: [
    "200g de chocolate negro",
    "100g de harina de almendras",
    "4 huevos",
  ],
  steps:
    "1. Mezcla el chocolate derretido con la harina de almendras y los huevos batidos. 2. Coloca la mezcla en un molde para brownie. 3. Hornea a 180°C durante 20 minutos o hasta que esté cocido. 4. Sirve frío.",
  type: { celiaco: true, vegetariano: true },
},
{
  id: 18,
  title: "Hamburguesa vegetal",
  image: "/imagenes/hamburguesa.jpg",
  description: "Hamburguesa a base de legumbres y avena.",
  ingredients: [
    "200g de porotos cocidos",
    "100g de avena",
    "1 cebolla pequeña",
    "1 ajo picado",
  ],
  steps:
    "1. Mezcla los porotos cocidos con la avena, la cebolla y el ajo. 2. Forma hamburguesas y cocina en una sartén con aceite hasta que estén doradas. 3. Sirve caliente.",
  type: { vegetariano: true, vegano: true, sinHarina: true },
},
{
  id: 19,
  title: "Mix de frutas frescas",
  image: "/imagenes/frutas.jpg",
  description: "Postre natural de frutas frescas y sin sal.",
  ingredients: [
    "1 manzana grande",
    "1 banana madura",
    "1 naranja grande",
    "1 frutilla fresca",
  ],
  steps:
    "1. Corta las frutas en trozos pequeños y mezcla en un tazón. 2. Sirve frío.",
  type: { celiaco: true, vegetariano: true, vegano: true, sinHarina: true, sinSal: true },
}
]