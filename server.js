// Requerir dependencias
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar dotenv
dotenv.config();

// Crear una instancia de la aplicación Express
const app = express();

// Configurar puerto
const port = process.env.PORT || 3000;

// Configurar CORS
app.use(cors());

// Configurar body-parser para procesar datos JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar la conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'horror_times',
});

db.connect(err => {
  if (err) throw err;
  console.log('Conexión a la base de datos establecida');
});

// Ruta para obtener productos
app.get('/obtener_productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Ruta para agregar un producto
app.post('/agregar_producto', (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;
  const query = 'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, imagen], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Producto agregado exitosamente', producto: req.body });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
