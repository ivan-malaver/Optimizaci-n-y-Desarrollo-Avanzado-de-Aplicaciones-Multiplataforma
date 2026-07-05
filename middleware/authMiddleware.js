const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = decoded; // Inyecta { id, email, role }
    next();
  });
};

// Middleware para autorización por roles (RBAC)
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Permisos insuficientes. Se requiere rol: ${allowedRoles.join(' o ')}`
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };