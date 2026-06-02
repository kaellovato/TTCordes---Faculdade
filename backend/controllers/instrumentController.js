// ==================== CONTROLLER: INSTRUMENTS ====================
// Lógica para CRUD do catálogo de instrumentos musicais da TTCordes

const Instrument = require('../models/Instrument');
const validators = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/response');

const instrumentController = {
  // ============ GET ALL INSTRUMENTS ============
  getAllInstruments: async (req, res) => {
    try {
      const { page = 1, limit = 10, active } = req.query;
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const filter = {};
      if (active !== undefined) {
        filter.active = active === 'true';
      }

      const total = await Instrument.countDocuments(filter);
      const instruments = await Instrument.find(filter)
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      return res.status(200).json(
        successResponse(
          'Instrumentos listados com sucesso',
          {
            instruments,
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
      return res.status(500).json(errorResponse('Erro ao listar instrumentos', error.message, 500));
    }
  },

  // ============ GET INSTRUMENT BY ID ============
  getInstrumentById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de instrumento inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const instrument = await Instrument.findById(id);

      if (!instrument) {
        return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Instrumento encontrado', instrument, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao buscar instrumento', error.message, 500));
    }
  },

  // ============ CREATE INSTRUMENT ============
  createInstrument: async (req, res) => {
    try {
      const { name, description, category, price, stock, active } = req.body;

      // Validar dados
      const validation = validators.validateInstrument({
        name,
        description,
        category,
        price,
        stock,
        active
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se nome já existe
      const existingInstrument = await Instrument.findOne({ name: name.trim() });
      if (existingInstrument) {
        return res.status(409).json(errorResponse('Instrumento duplicado', 'Já existe um instrumento com este nome', 409));
      }

      // Criar novo instrumento
      const newInstrument = new Instrument({
        name: validators.sanitizeInput(name),
        description: description ? validators.sanitizeInput(description) : '',
        category: validators.sanitizeInput(category),
        price,
        stock: stock || 0,
        active: active !== undefined ? active : true
      });

      await newInstrument.save();

      return res.status(201).json(successResponse('Instrumento criado com sucesso', newInstrument, 201));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao criar instrumento', error.message, 500));
    }
  },

  // ============ UPDATE INSTRUMENT (PUT - Substituição completa) ============
  replaceInstrument: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category, price, stock, active } = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de instrumento inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Validar dados
      const validation = validators.validateInstrument({
        name,
        description,
        category,
        price,
        stock,
        active
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se instrumento existe
      const instrument = await Instrument.findById(id);
      if (!instrument) {
        return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${id}`, 404));
      }

      // Verificar se novo nome já existe (se mudou)
      if (name.trim() !== instrument.name) {
        const existingInstrument = await Instrument.findOne({ name: name.trim() });
        if (existingInstrument) {
          return res.status(409).json(errorResponse('Instrumento duplicado', 'Já existe outro instrumento com este nome', 409));
        }
      }

      // Substituir todos os campos
      instrument.name = validators.sanitizeInput(name);
      instrument.description = description ? validators.sanitizeInput(description) : '';
      instrument.category = validators.sanitizeInput(category);
      instrument.price = price;
      instrument.stock = stock || 0;
      instrument.active = active !== undefined ? active : true;

      await instrument.save();

      return res.status(200).json(successResponse('Instrumento substituído com sucesso', instrument, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao substituir instrumento', error.message, 500));
    }
  },

  // ============ UPDATE INSTRUMENT (PATCH - Atualização parcial) ============
  updateInstrument: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de instrumento inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Verificar se instrumento existe
      const instrument = await Instrument.findById(id);
      if (!instrument) {
        return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${id}`, 404));
      }

      // Campos permitidos para atualização
      const allowedFields = ['name', 'description', 'category', 'price', 'stock', 'active'];
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
      const validation = validators.validateInstrument({
        ...instrument.toObject(),
        ...updateData
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se novo nome já existe (se está a mudar)
      if ('name' in updateData && updateData.name.trim() !== instrument.name) {
        const existingInstrument = await Instrument.findOne({ name: updateData.name.trim() });
        if (existingInstrument) {
          return res.status(409).json(errorResponse('Instrumento duplicado', 'Já existe outro instrumento com este nome', 409));
        }
        updateData.name = validators.sanitizeInput(updateData.name);
      }

      if ('description' in updateData) {
        updateData.description = updateData.description ? validators.sanitizeInput(updateData.description) : '';
      }

      if ('category' in updateData) {
        updateData.category = validators.sanitizeInput(updateData.category);
      }

      // Aplicar atualizações
      Object.assign(instrument, updateData);
      await instrument.save();

      return res.status(200).json(successResponse('Instrumento atualizado com sucesso', instrument, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao atualizar instrumento', error.message, 500));
    }
  },

  // ============ DELETE INSTRUMENT ============
  deleteInstrument: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de instrumento inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const instrument = await Instrument.findByIdAndDelete(id);

      if (!instrument) {
        return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Instrumento eliminado com sucesso', instrument, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao eliminar instrumento', error.message, 500));
    }
  }
};

module.exports = instrumentController;

