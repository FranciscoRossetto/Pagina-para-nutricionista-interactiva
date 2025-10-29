export type Food = {
  name: string;
  calories: number;
  image: string;
};

export const foodList: Food[] = [
  { name: "Caramelo de miel", calories: 22, image: "/imagenes/imagenesJuego/Caramelo de miel.jpg" },
  { name: "Manzana", calories: 52, image: "/imagenes/imagenesJuego/Manzana.jpg" },
  { name: "Pera", calories: 57, image: "/imagenes/imagenesJuego/Pera.jpg" },
  { name: "Huevo duro", calories: 77, image: "/imagenes/imagenesJuego/Huevo duro.jpg" },
  { name: "Banana", calories: 89, image: "/imagenes/imagenesJuego/Banana.jpg" },
  { name: "Pochoclos", calories: 105, image: "/imagenes/imagenesJuego/Pochoclos.jpg" },
  { name: "Ensalada César", calories: 165, image: "/imagenes/imagenesJuego/ensaladaCesar.jpg" },
  { name: "Flan", calories: 150, image: "/imagenes/imagenesJuego/Flan.jpg" },
  { name: "Medialuna", calories: 190, image: "/imagenes/imagenesJuego/Medialuna.jpg" },
  { name: "Helado", calories: 210, image: "/imagenes/imagenesJuego/Helado.jpg" },
  { name: "Tortilla de papa", calories: 215, image: "/imagenes/imagenesJuego/Tortilla de papa.jpg" },
  { name: "Empanada de carne", calories: 260, image: "/imagenes/imagenesJuego/Empanada de carne.jpg" },
  { name: "Nuggets de pollo", calories: 275, image: "/imagenes/imagenesJuego/Nuggets de pollo.jpg" },
  { name: "Pancho", calories: 290, image: "/imagenes/imagenesJuego/pancho.jpg" },
  { name: "Albóndigas", calories: 310, image: "/imagenes/imagenesJuego/Albondigas.jpg" },
  { name: "Oreos", calories: 160, image: "/imagenes/imagenesJuego/Oreos.jpg" },
  { name: "Papas", calories: 320, image: "/imagenes/imagenesJuego/Papas.jpg" },
  { name: "Sándwich de jamón y queso", calories: 340, image: "/imagenes/imagenesJuego/Sandwich de jamon y queso.jpg" },
  { name: "Ravioles", calories: 350, image: "/imagenes/imagenesJuego/Ravioles.jpg" },
  { name: "Donas", calories: 290, image: "/imagenes/imagenesJuego/donas.jpg" },
  { name: "Churros", calories: 420, image: "/imagenes/imagenesJuego/Churros.jpg" },
  { name: "Chocotorta", calories: 430, image: "/imagenes/imagenesJuego/Chocotorta.jpg" },
  { name: "Milanesa con puré", calories: 540, image: "/imagenes/imagenesJuego/Milanesa con pure.jpg" },
  { name: "Choripan", calories: 650, image: "/imagenes/imagenesJuego/Choripan.jpg" },
  { name: "Bizcochuelo", calories: 280, image: "/imagenes/imagenesJuego/Bizcochuelo.jpg" },
  { name: "Gelatina", calories: 90, image: "/imagenes/imagenesJuego/Gelatina.jpg" },
  { name: "Gomitas", calories: 150, image: "/imagenes/imagenesJuego/Gomitas.jpg" },
  { name: "Pan francés", calories: 150, image: "/imagenes/imagenesJuego/Pan frances.jpg" },
  { name: "Panqueque con dulce de leche", calories: 220, image: "/imagenes/imagenesJuego/Panqueque con dulce de leche.jpg" },
  { name: "Papas fritas", calories: 300, image: "/imagenes/imagenesJuego/Papas Fritas.jpg" },
  { name: "Pizza muzzarella", calories: 270, image: "/imagenes/imagenesJuego/Pizza muzzarella.jpg" },
  { name: "Tortilla francesa", calories: 150, image: "/imagenes/imagenesJuego/Tortilla Francesa.jpg" },
];


export function getRandomFood(exclude: Food[] = []): Food {
  const filtered = foodList.filter(f => !exclude.some(e => e.name === f.name));
  return filtered[Math.floor(Math.random() * filtered.length)];
}
