// ==================== CONTROLLER: HISTORY ====================
// Lógica para consulta de histórico de vendas por vendedor

// TODO
// - Implementar getSellerHistory(req, res)
// - Implementar getSellerStats(req, res)

const notImplemented = (res, endpoint) => {
  return res.status(501).json({
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: `Endpoint ${endpoint} planeado no Sprint 1 e implementado nos próximos sprints`
  });
};

const historyController = {
  getSellerHistory: async (req, res) => {
    return notImplemented(res, 'GET /sellers/:id/history');
  },

  getSellerStats: async (req, res) => {
    return notImplemented(res, 'GET /sellers/:id/stats');
  }
};

module.exports = historyController;

