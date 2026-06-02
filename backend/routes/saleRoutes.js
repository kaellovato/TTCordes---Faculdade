// ==================== ROTAS: SALES ====================
// Rotas CRUD para vendas da TTCordes

const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todos os endpoints do fluxo de vendas exigem token ativo
router.get('/', authMiddleware, saleController.getAllSales);
router.get('/:id', authMiddleware, saleController.getSaleById);
router.post('/', authMiddleware, saleController.createSale);
router.put('/:id', authMiddleware, saleController.replaceSale);
router.patch('/:id', authMiddleware, saleController.updateSale);
router.delete('/:id', authMiddleware, saleController.deleteSale);

module.exports = router;