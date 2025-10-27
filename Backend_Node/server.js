const express = require('express');

//Creo instancia express
const app = express();

//Middlewares para que express entienda json
app.use(express.json());

//ruta get leer/consultar informacion
app.get('/', (req, res) => {
    res.send('Hola Mundo dsdadsa Express');
});

//Para crear recursos en el servidr POST
app.post('/productos', (req, res) => {
    const nuevoProducto = req.body;
    res.json({mensaje: 'Producto creado', status: "ok", producto: nuevoProducto});
});

//Para actualizar recursos en el servidor PUT
app.put('/productos/:id', (req, res) => {
    const id = req.params.id;
    const productoActualizado = req.body;
    res.json({mensaje: `Producto con id ${id} actualizado`, producto: productoActualizado});
});

//Para eliminar recursos en el servidor DELETE
app.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    res.json({mensaje: `Producto con id ${id} eliminado`});
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
