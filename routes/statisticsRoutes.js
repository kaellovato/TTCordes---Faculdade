// ==================== ROTAS: STATISTICS ====================
// Rotas para análise de vendas e desempenho da TTCordes

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/total-sales', statisticsController.getTotalSales);
router.get('/top-instruments', statisticsController.getTopInstruments);
router.get('/revenue-per-instrument', statisticsController.getRevenuePerInstrument);
router.get('/seller-streaks', statisticsController.getSellerStreaks);

module.exports = router;

