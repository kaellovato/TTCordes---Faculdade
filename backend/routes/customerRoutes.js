// ==================== ROTAS: CUSTOMERS ====================
// Rotas CRUD para clientes da TTCordes

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteção integral sobre dados pessoais de clientes da loja
router.get('/', authMiddleware, customerController.getAllCustomers);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.post('/', authMiddleware, customerController.createCustomer);
router.patch('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

module.exports = router;