export type Food = {
  name: string;
  calories: number;
  image: string;
};

export const foodList: Food[] = [
  { name: "Arroz", calories: 130, image: "/imagenes/arroz.jpg" },
  { name: "Brochetas", calories: 250, image: "/imagenes/brochetas.jpg" },
  { name: "Brownie", calories: 400, image: "/imagenes/brownie.jpg" },
  { name: "Ensalada", calories: 80, image: "/imagenes/ensalada.jpg" },
  { name: "Fideos", calories: 350, image: "/imagenes/fideos.jpg" },
  { name: "Frutas", calories: 90, image: "/imagenes/frutas.jpg" },
  { name: "Galletas", calories: 280, image: "/imagenes/galletas.jpg" },
  { name: "Hamburguesa", calories: 550, image: "/imagenes/hamburguesa.jpg" },
  { name: "Hummus", calories: 180, image: "/imagenes/hummus.jpg" },
  { name: "Jugo", calories: 110, image: "/imagenes/jugo.jpg" },
  { name: "Lentejas", calories: 230, image: "/imagenes/lentejas.jpg" },
  { name: "Pan", calories: 270, image: "/imagenes/pan.jpg" },
  { name: "Papas", calories: 320, image: "/imagenes/papas.jpg" },
  { name: "Pollo", calories: 240, image: "/imagenes/pollo.jpg" },
  { name: "Salteado", calories: 210, image: "/imagenes/salteado.jpg" },
  { name: "Smoothie", calories: 190, image: "/imagenes/smoothie.jpg" },
  { name: "Sopa", calories: 150, image: "/imagenes/sopa.jpg" },
  { name: "Tortilla", calories: 220, image: "/imagenes/tortilla.jpg" },
  { name: "Budín", calories: 370, image: "/imagenes/budin.jpg" },
];

export function getRandomFood(exclude: Food[] = []): Food {
  const filtered = foodList.filter(f => !exclude.some(e => e.name === f.name));
  return filtered[Math.floor(Math.random() * filtered.length)];
}
