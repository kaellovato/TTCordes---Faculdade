// ==================== MIDDLEWARE: AUTH ====================
// Validação de JWT em requisições protegidas da TTCordes

// TODO
// - Extrair Authorization header
// - Validar JWT token
// - Decodificar payload para req.user
// - Retornar 401 se inválido

const authMiddleware = (req, res, next) => {
  try {
    // TODO: Implementar lógica de validação JWT
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Token inválido ou expirado'
    });
  }
};

module.exports = authMiddleware;

