-- Eliminar tablas si existen (para reiniciar limpiamente)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Tabla de usuarios con roles
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos (asociados a un usuario)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_users_email ON users(email);