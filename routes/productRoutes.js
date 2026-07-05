const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Rutas públicas (lectura)
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);

// Rutas protegidas (solo admin)
router.post('/products', authenticateToken, authorizeRole(['admin']), createProduct);
router.put('/products/:id', authenticateToken, authorizeRole(['admin']), updateProduct);
router.delete('/products/:id', authenticateToken, authorizeRole(['admin']), deleteProduct);

module.exports = router;