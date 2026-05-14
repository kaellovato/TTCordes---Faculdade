// ==================== ROTAS: SALES ====================
// Rotas CRUD para vendas da TTCordes

const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.createSale);
router.patch('/:id', saleController.updateSale);
router.delete('/:id', saleController.deleteSale);

module.exports = router;

