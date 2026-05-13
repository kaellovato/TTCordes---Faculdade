// ==================== CONTROLLER: AUTH ====================
// Lógica para autenticação de vendedores e gestores da TTCordes

// TODO
// - Implementar register(req, res)
// - Implementar login(req, res)
// - Implementar refresh(req, res)

const authController = {
  register: async (req, res) => {
    // TODO: Validação, hash password, criar utilizador, retornar token
  },

  login: async (req, res) => {
    // TODO: Validação email/password, comparar hash, retornar token
  },

  refresh: async (req, res) => {
    // TODO: Validar token anterior, gerar novo, retornar
  }
};

module.exports = authController;

