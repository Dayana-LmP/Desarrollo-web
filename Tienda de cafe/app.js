const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Lista en memoria de pedidos (solo para prueba)
const pedidos = [];

// Función para calcular precio
function calcularPrecio(drink, ounce, shots) {
  let base = 0;

  switch (drink) {
    case 'americano': base = 30; break;
    case 'cappuccino': base = 35; break;
    case 'espresso': base = 25; break;
    case 'latte': base = 40; break;
    default: base = 0;
  }

  let sizeExtra = 0;
  if (ounce === '12') sizeExtra = 10;
  else if (ounce === '16') sizeExtra = 15;

  const shotsExtra = (shots - 1) * 5;

  return base + sizeExtra + shotsExtra;
}

// Ruta principal - muestra formulario y lista pedidos
app.get('/', (req, res) => {
  res.render('index', { pedidos });
});

// Recibir datos del formulario
app.post('/pedido', (req, res) => {
  const { nombre, drink, ounce, shots } = req.body;
  const precio = calcularPrecio(drink, ounce, Number(shots));
  const fechaHora = new Date();

  const pedido = {
    id: pedidos.length + 1,
    nombre,
    drink,
    ounce,
    shots: Number(shots),
    precio,
    estatus: 'En preparación',
    fechaHora,
  };

  pedidos.push(pedido);

  // Redirigir a la página principal para mostrar la lista actualizada
  res.redirect('/');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:3000`);
});
