// ==================== CONFIGURAÇÃO DE JWT ====================
// Este arquivo será completado no Sprint 2
// Configurações de JWT (Secret, Algoritmo, Expiração)

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-secreto-desenvolvimento';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Função para gerar JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Função para verificar JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  generateToken,
  verifyToken
};

