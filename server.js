// server.js
require('dotenv').config();
const express = require('express');
const productRoutes = require('./productController'); // o la ruta donde tengas el controlador

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas de productos
app.get('/products', productRoutes.getProducts);
app.get('/products/:id', productRoutes.getProductById);
app.post('/products', productRoutes.createProduct);
app.put('/products/:id', productRoutes.updateProduct);
app.delete('/products/:id', productRoutes.deleteProduct);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});