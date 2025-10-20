const express = require('express');

//Creo instancia express
const app = express();

//Middlewares para que express entienda json
app.use(express.json());

//ruta get
app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
