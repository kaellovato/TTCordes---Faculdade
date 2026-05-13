// ==================== CONTROLLER: SALES ====================
// Lógica para CRUD de vendas da TTCordes

// TODO
// - Implementar getAllSales(req, res)
// - Implementar getSaleById(req, res)
// - Implementar createSale(req, res)
// - Implementar updateSale(req, res)
// - Implementar deleteSale(req, res)

const saleController = {
  getAllSales: async (req, res) => {
    // TODO: GET /sales com filtros (seller, status, date range)
  },

  getSaleById: async (req, res) => {
    // TODO: GET /sales/:id com populate
  },

  createSale: async (req, res) => {
    // TODO: POST /sales com validação de FKs
  },

  updateSale: async (req, res) => {
    // TODO: PATCH /sales/:id (ajustes de venda, cálculo de total)
  },

  deleteSale: async (req, res) => {
    // TODO: DELETE /sales/:id (manager only)
  }
};

module.exports = saleController;

