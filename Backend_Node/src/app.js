const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>¡Hola desde Nodedsadsadas.js!</h1>');
});

server.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
