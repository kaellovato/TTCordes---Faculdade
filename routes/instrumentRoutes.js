// ==================== ROTAS: INSTRUMENTS ====================
// Rotas CRUD para o catálogo de instrumentos musicais da TTCordes

const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrumentController');

router.get('/', instrumentController.getAllInstruments);
router.get('/:id', instrumentController.getInstrumentById);
router.post('/', instrumentController.createInstrument);
router.patch('/:id', instrumentController.updateInstrument);
router.delete('/:id', instrumentController.deleteInstrument);

module.exports = router;

