const User = require('../models/User');
const { generateToken, JWT_SECRET } = require('../config/jwt');
const jwt = require('jsonwebtoken');
const validators = require('../utils/validators');

const authController = {

  // POST /auth/register
  // Regista um novo utilizador na plataforma (vendedor ou gestor)
  register: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_FIELDS',
          message: 'username, email e password são obrigatórios'
        });
      }

      if (!validators.validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_EMAIL',
          message: 'O email deve ser válido'
        });
      }

      // Evita duplicados verificando a existência de email ou username idênticos
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'USER_EXISTS',
          message: 'Email ou username já em uso'
        });
      }

      // Cria a instância do utilizador — o gancho pre('save') cifra a password
      const user = new User({ username, email, password, role });
      await user.save();

      const token = generateToken({
        id: user._id,
        username: user.username,
        role: user.role   // 'seller' ou 'manager'
      });

      return res.status(201).json({
        success: true,
        message: 'Utilizador registado com sucesso',
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }
  },

  // POST /auth/login
  // Autentica os operadores da loja e devolve o token de acesso
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_FIELDS',
          message: 'email e password são obrigatórios'
        });
      }

      const user = await User.findOne({ email });

      // Resposta unificada para email inexistente ou password incorreta
      // Evita a enumeração de utilizadores válidos por agentes externos
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas'
        });
      }

      const token = generateToken({
        id: user._id,
        username: user.username,
        role: user.role
      });

      return res.status(200).json({
        success: true,
        message: 'Login efetuado com sucesso',
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }
  },

  // POST /auth/refresh
  // Estende a validade de uma sessão através de um token ainda válido
  refresh: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'MISSING_TOKEN',
          message: 'Token é obrigatório no corpo da requisição'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const newToken = generateToken({
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      });

      return res.status(200).json({
        success: true,
        message: 'Token renovado com sucesso',
        data: { token: newToken }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Token inválido ou expirado'
      });
    }
  },

  // DELETE /auth/users/:id
  // Remove um utilizador da base de dados através do ID
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Utilizador não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Utilizador eliminado com sucesso',
        data: {
          id: deletedUser._id,
          username: deletedUser.username
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }
  }
,

  // PATCH /auth/users/:id/role
  // Atualiza a role de um utilizador (ex: promover a owner)
  setUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const allowed = ['seller', 'manager', 'owner'];
      if (!role || !allowed.includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_ROLE',
          message: `Role inválida — valores permitidos: ${allowed.join(', ')}`
        });
      }

      // Proteção: apenas um `owner` pode promover outro utilizador a `owner`
      if (role === 'owner' && req.user.role !== 'owner') {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas um owner pode promover outro utilizador a owner'
        });
      }

      const updated = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select('-password');

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Utilizador não encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Role atualizada com sucesso',
        data: { user: updated }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }
  }
};

// GET /auth/users
authController.getAllUsers = async (req, res) => {
  try {
    // Managers e owners conseguem ver todos os utilizadores
    const users = await User.find().select('-password');
    return res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: error.message
    });
  }
};

// POST /auth/users
// Cria um utilizador a partir do painel (apenas manager/owner)
authController.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_FIELDS',
        message: 'username, email e password são obrigatórios'
      });
    }

    if (!validators.validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_EMAIL',
        message: 'O email deve ser válido'
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'USER_EXISTS',
        message: 'Email ou username já em uso'
      });
    }

    const allowed = ['seller', 'manager'];
    // Só um owner pode criar outro owner através deste endpoint
    if (role === 'owner' && req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Apenas um owner pode criar outro owner'
      });
    }

    const finalRole = allowed.includes(role) || role === 'owner' ? role : 'seller';

    const user = new User({ username, email, password, role: finalRole });
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Utilizador criado com sucesso',
      data: { user: { id: user._id, username: user.username, email: user.email, role: user.role } }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: error.message
    });
  }
};

module.exports = authController;