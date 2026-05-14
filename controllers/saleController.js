// ==================== CONTROLLER: SALES ====================
// Lógica para CRUD de vendas da TTCordes

// TODO
// - Implementar getAllSales(req, res)
// - Implementar getSaleById(req, res)
// - Implementar createSale(req, res)
// - Implementar updateSale(req, res)
// - Implementar deleteSale(req, res)

const notImplemented = (res, endpoint) => {
  return res.status(501).json({
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: `Endpoint ${endpoint} planeado no Sprint 1 e implementado nos próximos sprints`
  });
};

const saleController = {
  getAllSales: async (req, res) => {
    return notImplemented(res, 'GET /sales');
  },

  getSaleById: async (req, res) => {
    return notImplemented(res, 'GET /sales/:id');
  },

  createSale: async (req, res) => {
    return notImplemented(res, 'POST /sales');
  },

  updateSale: async (req, res) => {
    return notImplemented(res, 'PATCH /sales/:id');
  },

  deleteSale: async (req, res) => {
    return notImplemented(res, 'DELETE /sales/:id');
  }
};

module.exports = saleController;

