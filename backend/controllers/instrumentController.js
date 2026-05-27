// ==================== CONTROLLER: INSTRUMENTS ====================
// Lógica para CRUD do catálogo de instrumentos musicais da TTCordes

// TODO
// - Implementar getAllInstruments(req, res)
// - Implementar getInstrumentById(req, res)
// - Implementar createInstrument(req, res)
// - Implementar updateInstrument(req, res)
// - Implementar deleteInstrument(req, res)

const notImplemented = (res, endpoint) => {
  return res.status(501).json({
    success: false,
    error: 'NOT_IMPLEMENTED',
    message: `Endpoint ${endpoint} planeado no Sprint 1 e implementado nos próximos sprints`
  });
};

const instrumentController = {
  getAllInstruments: async (req, res) => {
    return notImplemented(res, 'GET /instruments');
  },

  getInstrumentById: async (req, res) => {
    return notImplemented(res, 'GET /instruments/:id');
  },

  createInstrument: async (req, res) => {
    return notImplemented(res, 'POST /instruments');
  },

  updateInstrument: async (req, res) => {
    return notImplemented(res, 'PATCH /instruments/:id');
  },

  deleteInstrument: async (req, res) => {
    return notImplemented(res, 'DELETE /instruments/:id');
  }
};

module.exports = instrumentController;

