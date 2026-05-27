// ==================== ROTAS: HISTORY ====================
// Rotas para histórico de vendas por vendedor

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Auditoria e histórico individual de performance dos vendedores
router.get('/:id/history', authMiddleware, historyController.getSellerHistory);
router.get('/:id/stats', authMiddleware, historyController.getSellerStats);

module.exports = router;