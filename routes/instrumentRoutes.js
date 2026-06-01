// ==================== ROTAS: INSTRUMENTS ====================
// Rotas CRUD para o catálogo de instrumentos musicais da TTCordes

const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrumentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Operações de leitura expostas ao público (Catálogo da Loja)
router.get('/', instrumentController.getAllInstruments);
router.get('/:id', instrumentController.getInstrumentById);

// Operações de escrita e modificação restritas a pessoal autenticado
router.post('/', authMiddleware, roleMiddleware(['manager']), instrumentController.createInstrument);
router.put('/:id', authMiddleware, roleMiddleware(['manager']), instrumentController.replaceInstrument);
router.patch('/:id', authMiddleware, roleMiddleware(['manager']), instrumentController.updateInstrument);
router.delete('/:id', authMiddleware, roleMiddleware(['manager']), instrumentController.deleteInstrument);

module.exports = router;