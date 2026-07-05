require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/api', productRoutes);

// Ruta de prueba de conexión a la BD
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({ success: true, time: result.rows[0].current_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error de conexión a la BD' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});