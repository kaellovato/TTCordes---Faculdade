// ==================== CONTROLLER: AUTH ====================
// Lógica para autenticação de vendedores e gestores da TTCordes

// TODO
// - Implementar register(req, res)
// - Implementar login(req, res)
// - Implementar refresh(req, res)

const notImplemented = (res, endpoint) => {
  return res.status(501).json({
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: `Endpoint ${endpoint} planeado no Sprint 1 e implementado nos próximos sprints`
  });
};

const authController = {
  register: async (req, res) => {
    return notImplemented(res, 'POST /auth/register');
  },

  login: async (req, res) => {
    return notImplemented(res, 'POST /auth/login');
  },

  refresh: async (req, res) => {
    return notImplemented(res, 'POST /auth/refresh');
  }
};

module.exports = authController;

