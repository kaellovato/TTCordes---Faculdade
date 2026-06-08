// ==================== ROTAS: HISTORY ====================
// Rotas para histórico de vendas e manutenções por utilizador

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Histórico e stats de vendedores
router.get('/:id/history', authMiddleware, historyController.getSellerHistory);
router.get('/:id/stats', authMiddleware, historyController.getSellerStats);

// Histórico e stats de técnicos de manutenção
router.get('/:id/maintenance-history', authMiddleware, historyController.getTechnicianHistory);
router.get('/:id/maintenance-stats', authMiddleware, historyController.getTechnicianStats);

module.exports = router;
