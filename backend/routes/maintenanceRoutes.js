// ==================== ROTAS: MAINTENANCE ====================
// Rotas CRUD para fichas de manutenção da TTCordes

const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todos os endpoints de manutenção requerem autenticação
router.get('/', authMiddleware, maintenanceController.getAllMaintenances);
router.get('/service-types', authMiddleware, maintenanceController.getServiceTypes);
router.get('/:id', authMiddleware, maintenanceController.getMaintenanceById);
router.post('/', authMiddleware, roleMiddleware(['technician', 'manager']), maintenanceController.createMaintenance);
router.put('/:id', authMiddleware, roleMiddleware(['technician', 'manager']), maintenanceController.replaceMaintenance);
router.patch('/:id', authMiddleware, roleMiddleware(['technician', 'manager']), maintenanceController.updateMaintenance);
router.delete('/:id', authMiddleware, roleMiddleware(['manager']), maintenanceController.deleteMaintenance);

module.exports = router;
