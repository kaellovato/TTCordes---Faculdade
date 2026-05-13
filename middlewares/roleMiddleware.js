// ==================== MIDDLEWARE: ROLE ====================
// Validação de role (manager vs seller)

// TODO: Sprint 3
// - Receber array de roles permitidas
// - Verificar req.user.role
// - Retornar 403 se não tem permissão

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // TODO: Implementar lógica de verificação de role
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilizador não autenticado'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Sem permissão para realizar esta operação'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao validar permissões'
      });
    }
  };
};

module.exports = roleMiddleware;

