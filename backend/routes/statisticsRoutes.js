// ==================== ROTAS: STATISTICS ====================
// Rotas para análise e dashboard da TTCordes

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Dashboard geral (resumo de todos os indicadores)
router.get('/dashboard', authMiddleware, statisticsController.getDashboardSummary);

// Estatísticas de Vendas
router.get('/total-sales', authMiddleware, statisticsController.getTotalSales);
router.get('/top-instruments', authMiddleware, statisticsController.getTopInstruments);
router.get('/revenue-per-instrument', authMiddleware, statisticsController.getRevenuePerInstrument);
router.get('/seller-streaks', authMiddleware, statisticsController.getSellerStreaks);

// Estatísticas de Manutenções
router.get('/total-maintenances', authMiddleware, statisticsController.getTotalMaintenances);
router.get('/time-per-service', authMiddleware, statisticsController.getTimePerServiceType);
router.get('/top-services', authMiddleware, statisticsController.getTopServices);
router.get('/technician-streaks', authMiddleware, statisticsController.getTechnicianStreaks);

module.exports = router;
