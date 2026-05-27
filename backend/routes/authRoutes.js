// ==================== ROTAS: AUTH ====================
// Rotas para autenticação de vendedores e gestores da TTCordes

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// POST /auth/register — Criação de perfil para vendedores ou gestores
router.post('/register', authController.register);

// POST /auth/login — Ponto de autenticação; emissão de JWT
router.post('/login', authController.login);

// POST /auth/refresh — Mecanismo de renovação preventiva de tokens
router.post('/refresh', authController.refresh);

// DELETE /auth/users/:id — Exclusão de perfil de usuário
router.delete('/users/:id', authMiddleware, roleMiddleware(['manager']), authController.deleteUser);

// PATCH /auth/users/:id/role — Atualiza a role de um utilizador (manager ou owner)
router.patch('/users/:id/role', authMiddleware, roleMiddleware(['manager']), authController.setUserRole);

// GET /auth/users — Lista todos os utilizadores (manager/owner)
router.get('/users', authMiddleware, roleMiddleware(['manager']), authController.getAllUsers);

// POST /auth/users — Cria um utilizador via painel (manager/owner)
router.post('/users', authMiddleware, roleMiddleware(['manager']), authController.createUser);

module.exports = router;