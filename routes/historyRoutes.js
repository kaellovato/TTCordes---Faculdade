// ==================== ROTAS: HISTORY ====================
// Rotas para histórico de vendas por vendedor

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/:id/history', historyController.getSellerHistory);
router.get('/:id/stats', historyController.getSellerStats);

module.exports = router;

