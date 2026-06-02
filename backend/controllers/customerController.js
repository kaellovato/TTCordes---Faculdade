// ==================== CONTROLLER: CUSTOMERS ====================
// Lógica para CRUD de clientes da TTCordes

const Customer = require('../models/Customer');
const validators = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/response');

const customerController = {
  // ============ GET ALL CUSTOMERS ============
  getAllCustomers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const total = await Customer.countDocuments();
      const customers = await Customer.find()
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      return res.status(200).json(
        successResponse(
          'Clientes listados com sucesso',
          {
            customers,
            pagination: {
              total,
              page: pageNum,
              limit: limitNum,
              pages: Math.ceil(total / limitNum)
            }
          },
          200
        )
      );
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao listar clientes', error.message, 500));
    }
  },

  // ============ GET CUSTOMER BY ID ============
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de cliente inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const customer = await Customer.findById(id);

      if (!customer) {
        return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Cliente encontrado', customer, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao buscar cliente', error.message, 500));
    }
  },

  // ============ CREATE CUSTOMER ============
  createCustomer: async (req, res) => {
    try {
      const { name, email, phone, address } = req.body;

      // Validar dados
      const validation = validators.validateCustomer({
        name,
        email,
        phone,
        address
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se email já existe
      const existingCustomer = await Customer.findOne({ email: email.trim().toLowerCase() });
      if (existingCustomer) {
        return res.status(409).json(errorResponse('Cliente duplicado', 'Já existe um cliente com este email', 409));
      }

      // Criar novo cliente
      const newCustomer = new Customer({
        name: validators.sanitizeInput(name),
        email: validators.sanitizeInput(email).toLowerCase(),
        phone: phone ? validators.sanitizeInput(phone) : '',
        address: address ? validators.sanitizeInput(address) : ''
      });

      await newCustomer.save();

      return res.status(201).json(successResponse('Cliente criado com sucesso', newCustomer, 201));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao criar cliente', error.message, 500));
    }
  },

  // ============ UPDATE CUSTOMER (PUT - Substituição completa) ============
  replaceCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de cliente inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Validar dados
      const validation = validators.validateCustomer({
        name,
        email,
        phone,
        address
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se cliente existe
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${id}`, 404));
      }

      // Verificar se novo email já existe (se mudou)
      if (email.trim().toLowerCase() !== customer.email) {
        const existingCustomer = await Customer.findOne({ email: email.trim().toLowerCase() });
        if (existingCustomer) {
          return res.status(409).json(errorResponse('Cliente duplicado', 'Já existe outro cliente com este email', 409));
        }
      }

      // Substituir todos os campos
      customer.name = validators.sanitizeInput(name);
      customer.email = validators.sanitizeInput(email).toLowerCase();
      customer.phone = phone ? validators.sanitizeInput(phone) : '';
      customer.address = address ? validators.sanitizeInput(address) : '';

      await customer.save();

      return res.status(200).json(successResponse('Cliente substituído com sucesso', customer, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao substituir cliente', error.message, 500));
    }
  },

  // ============ UPDATE CUSTOMER (PATCH - Atualização parcial) ============
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de cliente inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Verificar se cliente existe
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${id}`, 404));
      }

      // Campos permitidos para atualização
      const allowedFields = ['name', 'email', 'phone', 'address'];
      const updateData = {};

      for (const field of allowedFields) {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      }

      // Se está vazio, retornar erro
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json(errorResponse('Sem atualizações', 'Nenhum campo válido para atualizar', 400));
      }

      // Validar os dados atualizados
      const validation = validators.validateCustomer({
        ...customer.toObject(),
        ...updateData
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se novo email já existe (se está a mudar)
      if ('email' in updateData && updateData.email.trim().toLowerCase() !== customer.email) {
        const existingCustomer = await Customer.findOne({ email: updateData.email.trim().toLowerCase() });
        if (existingCustomer) {
          return res.status(409).json(errorResponse('Cliente duplicado', 'Já existe outro cliente com este email', 409));
        }
        updateData.email = validators.sanitizeInput(updateData.email).toLowerCase();
      }

      if ('name' in updateData) {
        updateData.name = validators.sanitizeInput(updateData.name);
      }

      if ('phone' in updateData) {
        updateData.phone = updateData.phone ? validators.sanitizeInput(updateData.phone) : '';
      }

      if ('address' in updateData) {
        updateData.address = updateData.address ? validators.sanitizeInput(updateData.address) : '';
      }

      // Aplicar atualizações
      Object.assign(customer, updateData);
      await customer.save();

      return res.status(200).json(successResponse('Cliente atualizado com sucesso', customer, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao atualizar cliente', error.message, 500));
    }
  },

  // ============ DELETE CUSTOMER ============
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de cliente inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const customer = await Customer.findByIdAndDelete(id);

      if (!customer) {
        return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Cliente eliminado com sucesso', customer, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao eliminar cliente', error.message, 500));
    }
  }
};

module.exports = customerController;

