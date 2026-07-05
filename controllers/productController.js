const pool = require('../config/db');

// Obtener todos los productos (público)
exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.email AS seller_email
      FROM products p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID (público)
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, u.email AS seller_email
      FROM products p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

// Crear producto (solo admin)
exports.createProduct = async (req, res) => {
  const { name, description, price, user_id } = req.body;

  // Validaciones básicas
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'El precio debe ser un número mayor que 0' });
  }
  if (!user_id) {
    return res.status(400).json({ message: 'user_id es obligatorio' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name.trim(), description, price, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
};

// Actualizar producto (solo admin)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, user_id } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'El precio debe ser un número mayor que 0' });
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, user_id = $4
       WHERE id = $5
       RETURNING *`,
      [name.trim(), description, price, user_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Eliminar producto (solo admin)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};