// ==================== ROTAS: INSTRUMENTS ====================
// Rotas CRUD para o catálogo de instrumentos musicais da TTCordes

const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrumentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Operações de leitura expostas ao público (Catálogo da Loja)
router.get('/', instrumentController.getAllInstruments);
router.get('/:id', instrumentController.getInstrumentById);

// Operações de escrita e modificação restritas a pessoal autenticado
router.post('/', authMiddleware, instrumentController.createInstrument);
router.patch('/:id', authMiddleware, instrumentController.updateInstrument);
router.delete('/:id', authMiddleware, instrumentController.deleteInstrument);

module.exports = router;