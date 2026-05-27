// ==================== CONTROLLER: CUSTOMERS ====================
// Lógica para CRUD de clientes da TTCordes

// TODO
// - Implementar getAllCustomers(req, res)
// - Implementar getCustomerById(req, res)
// - Implementar createCustomer(req, res)
// - Implementar updateCustomer(req, res)
// - Implementar deleteCustomer(req, res)

const notImplemented = (res, endpoint) => {
  return res.status(501).json({
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: `Endpoint ${endpoint} planeado no Sprint 1 e implementado nos próximos sprints`
  });
};

const customerController = {
  getAllCustomers: async (req, res) => {
    return notImplemented(res, 'GET /customers');
  },

  getCustomerById: async (req, res) => {
    return notImplemented(res, 'GET /customers/:id');
  },

  createCustomer: async (req, res) => {
    return notImplemented(res, 'POST /customers');
  },

  updateCustomer: async (req, res) => {
    return notImplemented(res, 'PATCH /customers/:id');
  },

  deleteCustomer: async (req, res) => {
    return notImplemented(res, 'DELETE /customers/:id');
  }
};

module.exports = customerController;

