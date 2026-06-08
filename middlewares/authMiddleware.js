const { verifyToken } = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // Valida a presença do cabeçalho de autorização sob o esquema Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Token de autenticação não fornecido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Token inválido ou expirado'
      });
    }

    // Anexa os metadados do utilizador autenticado ao objeto de requisição (req.user)
    // Disponível de forma global para os controladores seguintes na cadeia de execução
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Erro na validação do token'
    });
  }
};

module.exports = authMiddleware;