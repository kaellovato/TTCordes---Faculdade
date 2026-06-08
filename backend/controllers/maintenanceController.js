// ==================== CONTROLLER: MAINTENANCE ====================
// Lógica para CRUD de fichas de manutenção de instrumentos da TTCordes
// Cada ficha regista a intervenção de um técnico num instrumento de um cliente

const Maintenance = require('../models/Maintenance');
const { SERVICE_TYPES } = require('../models/Maintenance');
const Instrument = require('../models/Instrument');
const Customer = require('../models/Customer');
const User = require('../models/User');
const validators = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/response');

const maintenanceController = {

  // ============ GET ALL MAINTENANCES ============
  getAllMaintenances: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        serviceType,
        technician_id
      } = req.query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      // Construir filtro dinâmico
      const filter = {};
      if (status) filter.status = status;
      if (serviceType) filter.serviceType = serviceType;
      if (technician_id) {
        if (!validators.isValidObjectId(technician_id)) {
          return res.status(400).json(errorResponse('ID de técnico inválido', 'technician_id deve ser um MongoDB ObjectId válido', 400));
        }
        filter.technician_id = technician_id;
      }

      const total = await Maintenance.countDocuments(filter);

      const maintenances = await Maintenance.find(filter)
        .populate('technician_id', 'username email role')
        .populate('instrument_id', 'name category price')
        .populate('customer_id', 'name email phone')
        .skip(skip)
        .limit(limitNum)
        .sort({ interventionDate: -1 });

      return res.status(200).json(
        successResponse(
          'Fichas de manutenção listadas com sucesso',
          {
            maintenances,
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
      return res.status(500).json(errorResponse('Erro ao listar manutenções', error.message, 500));
    }
  },

  // ============ GET MAINTENANCE BY ID ============
  getMaintenanceById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de manutenção inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const maintenance = await Maintenance.findById(id)
        .populate('technician_id', 'username email role')
        .populate('instrument_id', 'name category price description')
        .populate('customer_id', 'name email phone address');

      if (!maintenance) {
        return res.status(404).json(errorResponse('Ficha de manutenção não encontrada', `Não existe manutenção com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Ficha de manutenção encontrada', maintenance, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao buscar manutenção', error.message, 500));
    }
  },

  // ============ CREATE MAINTENANCE ============
  createMaintenance: async (req, res) => {
    try {
      const {
        technician_id,
        instrument_id,
        customer_id,
        serviceType,
        interventionDate,
        durationMinutes,
        description,
        cost,
        status
      } = req.body;

      // Validar dados obrigatórios
      const validation = validators.validateMaintenance({
        technician_id,
        instrument_id,
        customer_id,
        serviceType,
        durationMinutes,
        cost
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se técnico existe
      const technician = await User.findById(technician_id);
      if (!technician) {
        return res.status(404).json(errorResponse('Técnico não encontrado', `Não existe utilizador com ID ${technician_id}`, 404));
      }

      // Verificar se instrumento existe
      const instrument = await Instrument.findById(instrument_id);
      if (!instrument) {
        return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${instrument_id}`, 404));
      }

      // Verificar se cliente existe
      const customer = await Customer.findById(customer_id);
      if (!customer) {
        return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${customer_id}`, 404));
      }

      // Criar nova ficha de manutenção
      const newMaintenance = new Maintenance({
        technician_id,
        instrument_id,
        customer_id,
        serviceType,
        interventionDate: interventionDate ? new Date(interventionDate) : new Date(),
        durationMinutes,
        description: description ? validators.sanitizeInput(description) : '',
        cost,
        status: status || 'concluida'
      });

      await newMaintenance.save();

      // Popular antes de responder
      await newMaintenance.populate('technician_id', 'username email role');
      await newMaintenance.populate('instrument_id', 'name category price');
      await newMaintenance.populate('customer_id', 'name email phone');

      return res.status(201).json(successResponse('Ficha de manutenção criada com sucesso', newMaintenance, 201));
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json(errorResponse('Dados inválidos', errors, 400));
      }
      return res.status(500).json(errorResponse('Erro ao criar manutenção', error.message, 500));
    }
  },

  // ============ UPDATE MAINTENANCE (PUT - Substituição completa) ============
  replaceMaintenance: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        technician_id,
        instrument_id,
        customer_id,
        serviceType,
        interventionDate,
        durationMinutes,
        description,
        cost,
        status
      } = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de manutenção inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Validar todos os dados
      const validation = validators.validateMaintenance({
        technician_id,
        instrument_id,
        customer_id,
        serviceType,
        durationMinutes,
        cost
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se a ficha existe
      const maintenance = await Maintenance.findById(id);
      if (!maintenance) {
        return res.status(404).json(errorResponse('Ficha de manutenção não encontrada', `Não existe manutenção com ID ${id}`, 404));
      }

      // Verificar referências
      const [technician, instrument, customer] = await Promise.all([
        User.findById(technician_id),
        Instrument.findById(instrument_id),
        Customer.findById(customer_id)
      ]);

      if (!technician) return res.status(404).json(errorResponse('Técnico não encontrado', `Não existe utilizador com ID ${technician_id}`, 404));
      if (!instrument) return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${instrument_id}`, 404));
      if (!customer) return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${customer_id}`, 404));

      // Substituir todos os campos
      maintenance.technician_id = technician_id;
      maintenance.instrument_id = instrument_id;
      maintenance.customer_id = customer_id;
      maintenance.serviceType = serviceType;
      maintenance.interventionDate = interventionDate ? new Date(interventionDate) : maintenance.interventionDate;
      maintenance.durationMinutes = durationMinutes;
      maintenance.description = description ? validators.sanitizeInput(description) : '';
      maintenance.cost = cost;
      maintenance.status = status || 'concluida';

      await maintenance.save();

      await maintenance.populate('technician_id', 'username email role');
      await maintenance.populate('instrument_id', 'name category price');
      await maintenance.populate('customer_id', 'name email phone');

      return res.status(200).json(successResponse('Ficha de manutenção substituída com sucesso', maintenance, 200));
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json(errorResponse('Dados inválidos', errors, 400));
      }
      return res.status(500).json(errorResponse('Erro ao substituir manutenção', error.message, 500));
    }
  },

  // ============ UPDATE MAINTENANCE (PATCH - Atualização parcial) ============
  updateMaintenance: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de manutenção inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const maintenance = await Maintenance.findById(id);
      if (!maintenance) {
        return res.status(404).json(errorResponse('Ficha de manutenção não encontrada', `Não existe manutenção com ID ${id}`, 404));
      }

      // Campos permitidos para atualização parcial
      const allowedFields = ['serviceType', 'interventionDate', 'durationMinutes', 'description', 'cost', 'status'];
      const updateData = {};

      for (const field of allowedFields) {
        if (field in updates) {
          updateData[field] = updates[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json(errorResponse('Sem atualizações', 'Nenhum campo válido para atualizar. Campos permitidos: ' + allowedFields.join(', '), 400));
      }

      // Validar serviceType se presente
      if (updateData.serviceType && !SERVICE_TYPES.includes(updateData.serviceType)) {
        return res.status(400).json(errorResponse('Tipo de serviço inválido', `Valores aceites: ${SERVICE_TYPES.join(', ')}`, 400));
      }

      // Validar durationMinutes se presente
      if ('durationMinutes' in updateData && (typeof updateData.durationMinutes !== 'number' || updateData.durationMinutes < 1)) {
        return res.status(400).json(errorResponse('Duração inválida', 'A duração deve ser um número positivo em minutos', 400));
      }

      // Validar cost se presente
      if ('cost' in updateData && (typeof updateData.cost !== 'number' || updateData.cost < 0)) {
        return res.status(400).json(errorResponse('Custo inválido', 'O custo deve ser um número não negativo', 400));
      }

      // Sanitizar description se presente
      if ('description' in updateData) {
        updateData.description = updateData.description ? validators.sanitizeInput(updateData.description) : '';
      }

      // Converter interventionDate se presente
      if ('interventionDate' in updateData) {
        updateData.interventionDate = new Date(updateData.interventionDate);
        if (isNaN(updateData.interventionDate)) {
          return res.status(400).json(errorResponse('Data inválida', 'interventionDate deve ser uma data válida', 400));
        }
      }

      Object.assign(maintenance, updateData);
      await maintenance.save();

      await maintenance.populate('technician_id', 'username email role');
      await maintenance.populate('instrument_id', 'name category price');
      await maintenance.populate('customer_id', 'name email phone');

      return res.status(200).json(successResponse('Ficha de manutenção atualizada com sucesso', maintenance, 200));
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json(errorResponse('Dados inválidos', errors, 400));
      }
      return res.status(500).json(errorResponse('Erro ao atualizar manutenção', error.message, 500));
    }
  },

  // ============ DELETE MAINTENANCE ============
  deleteMaintenance: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de manutenção inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const maintenance = await Maintenance.findByIdAndDelete(id);

      if (!maintenance) {
        return res.status(404).json(errorResponse('Ficha de manutenção não encontrada', `Não existe manutenção com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Ficha de manutenção eliminada com sucesso', maintenance, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao eliminar manutenção', error.message, 500));
    }
  },

  // ============ GET SERVICE TYPES (helper) ============
  getServiceTypes: async (req, res) => {
    return res.status(200).json(successResponse('Tipos de serviço disponíveis', { serviceTypes: SERVICE_TYPES }, 200));
  }
};

module.exports = maintenanceController;
