// ==================== MIDDLEWARE: ROLE ====================
// Validação de role (manager vs seller)

// TODO: Sprint 3
// - Receber array de roles permitidas
// - Verificar req.user.role
// - Retornar 403 se não tem permissão

/**
 * @param {String[]} allowedRoles - Array com os cargos permitidos (ex: ['manager'])
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1. Segurança extra: Verifica se o utilizador passou pelo authMiddleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Utilizador não autenticado ou token em falta'
        });
      }

      // 2. Superuser: um `owner` tem acesso total
      if (req.user.role === 'owner') {
        return next();
      }

      // 3. Validação: Verifica se a role do utilizador atual está no array de permissões
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Acesso negado: Não tem permissões para realizar esta operação'
        });
      }

      // 3. Se tiver permissão, avança para o controlador
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno ao validar permissões de acesso'
      });
    }
  };
};

module.exports = roleMiddleware;
