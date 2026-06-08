// ==================== CONTROLLER: STATISTICS ====================
// Lógica para análise de vendas e desempenho da TTCordes

// TODO
// - Implementar getTotalSales(req, res)
// - Implementar getTopInstruments(req, res)
// - Implementar getRevenuePerInstrument(req, res)
// - Implementar getSellerStreaks(req, res)

const notImplemented = (res, endpoint) => {
  return res.status(501).json({
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: `Endpoint ${endpoint} planeado no Sprint 1 e implementado nos próximos sprints`
  });
};

const statisticsController = {
  getTotalSales: async (req, res) => {
    return notImplemented(res, 'GET /statistics/total-sales');
  },

  getTopInstruments: async (req, res) => {
    return notImplemented(res, 'GET /statistics/top-instruments');
  },

  getRevenuePerInstrument: async (req, res) => {
    return notImplemented(res, 'GET /statistics/revenue-per-instrument');
  },

  getSellerStreaks: async (req, res) => {
    return notImplemented(res, 'GET /statistics/seller-streaks');
  }
};

module.exports = statisticsController;

