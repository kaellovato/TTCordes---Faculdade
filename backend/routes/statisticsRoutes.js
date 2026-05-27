// ==================== ROTAS: STATISTICS ====================
// Rotas para análise de vendas e desempenho da TTCordes

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Módulos analíticos reservados a gestão interna
router.get('/total-sales', authMiddleware, statisticsController.getTotalSales);
router.get('/top-instruments', authMiddleware, statisticsController.getTopInstruments);
router.get('/revenue-per-instrument', authMiddleware, statisticsController.getRevenuePerInstrument);
router.get('/seller-streaks', authMiddleware, statisticsController.getSellerStreaks);

module.exports = router;