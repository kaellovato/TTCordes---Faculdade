// ==================== CONTROLLER: HISTORY ====================
// Lógica para consulta de histórico de vendas por vendedor

// TODO
// - Implementar getSellerHistory(req, res)
// - Implementar getSellerStats(req, res)

const historyController = {
  getSellerHistory: async (req, res) => {
    // TODO: GET /sellers/:id/history com filtros (date, instrument, status)
  },

  getSellerStats: async (req, res) => {
    // TODO: GET /sellers/:id/stats com dados agregados
  }
};

module.exports = historyController;

