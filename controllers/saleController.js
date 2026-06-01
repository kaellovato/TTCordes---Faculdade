// ==================== CONTROLLER: SALES ====================
// Lógica para CRUD de vendas da TTCordes

const Sale = require('../models/Sale');
const Instrument = require('../models/Instrument');
const Customer = require('../models/Customer');
const User = require('../models/User');
const validators = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/response');

const saleController = {
  // ============ GET ALL SALES ============
  getAllSales: async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const total = await Sale.countDocuments(filter);
      const sales = await Sale.find(filter)
        .populate('seller_id', 'name email')
        .populate('instrument_id', 'name price')
        .populate('customer_id', 'name email')
        .skip(skip)
        .limit(limitNum)
        .sort({ saleDate: -1 });

      return res.status(200).json(
        successResponse(
          'Vendas listadas com sucesso',
          {
            sales,
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
      return res.status(500).json(errorResponse('Erro ao listar vendas', error.message, 500));
    }
  },

  // ============ GET SALE BY ID ============
  getSaleById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de venda inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const sale = await Sale.findById(id)
        .populate('seller_id', 'name email')
        .populate('instrument_id', 'name price stock')
        .populate('customer_id', 'name email phone');

      if (!sale) {
        return res.status(404).json(errorResponse('Venda não encontrada', `Não existe venda com ID ${id}`, 404));
      }

      return res.status(200).json(successResponse('Venda encontrada', sale, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao buscar venda', error.message, 500));
    }
  },

  // ============ CREATE SALE ============
  createSale: async (req, res) => {
    try {
      const { seller_id, instrument_id, customer_id, quantity, unitPrice, notes, status } = req.body;

      // Validar dados
      const validation = validators.validateSale({
        seller_id,
        instrument_id,
        customer_id,
        quantity,
        unitPrice,
        notes,
        status
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se seller existe e é seller
      const seller = await User.findById(seller_id);
      if (!seller) {
        return res.status(404).json(errorResponse('Vendedor não encontrado', `Não existe utilizador com ID ${seller_id}`, 404));
      }

      // Verificar se instrumento existe
      const instrument = await Instrument.findById(instrument_id);
      if (!instrument) {
        return res.status(404).json(errorResponse('Instrumento não encontrado', `Não existe instrumento com ID ${instrument_id}`, 404));
      }

      // Verificar se há stock suficiente
      if (instrument.stock < quantity) {
        return res.status(400).json(errorResponse('Stock insuficiente', `Stock disponível: ${instrument.stock}, quantidade solicitada: ${quantity}`, 400));
      }

      // Verificar se cliente existe
      const customer = await Customer.findById(customer_id);
      if (!customer) {
        return res.status(404).json(errorResponse('Cliente não encontrado', `Não existe cliente com ID ${customer_id}`, 404));
      }

      // Criar nova venda
      const totalAmount = quantity * unitPrice;
      const newSale = new Sale({
        seller_id,
        instrument_id,
        customer_id,
        quantity,
        unitPrice,
        totalAmount,
        notes: notes ? validators.sanitizeInput(notes) : '',
        status: status || 'completed',
        saleDate: new Date()
      });

      // Se a venda é completed, decrementar stock
      if (newSale.status === 'completed') {
        instrument.stock -= quantity;
        await instrument.save();
      }

      await newSale.save();

      // Populate antes de responder
      await newSale.populate('seller_id', 'name email');
      await newSale.populate('instrument_id', 'name price');
      await newSale.populate('customer_id', 'name email');

      return res.status(201).json(successResponse('Venda criada com sucesso', newSale, 201));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao criar venda', error.message, 500));
    }
  },

  // ============ UPDATE SALE (PUT - Substituição completa) ============
  replaceSale: async (req, res) => {
    try {
      const { id } = req.params;
      const { seller_id, instrument_id, customer_id, quantity, unitPrice, notes, status } = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de venda inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Validar dados
      const validation = validators.validateSale({
        seller_id,
        instrument_id,
        customer_id,
        quantity,
        unitPrice,
        notes,
        status
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Verificar se venda existe
      const sale = await Sale.findById(id);
      if (!sale) {
        return res.status(404).json(errorResponse('Venda não encontrada', `Não existe venda com ID ${id}`, 404));
      }

      // Verificar se seller existe
      const seller = await User.findById(seller_id);
      if (!seller) {
        return res.status(404).json(errorResponse('Vendedor não encontrado', `Não existe utilizador com ID ${seller_id}`, 404));
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

      // Lógica de stock: se há mudança na quantidade ou instrumento
      const previousInstrument = await Instrument.findById(sale.instrument_id);
      const quantityDifference = quantity - sale.quantity;

      if (sale.instrument_id.toString() === instrument_id && quantityDifference !== 0) {
        // Mesmo instrumento, mas quantidade diferente
        if (instrument.stock < quantityDifference) {
          return res.status(400).json(errorResponse('Stock insuficiente', `Stock disponível: ${instrument.stock}, quantidade adicional necessária: ${quantityDifference}`, 400));
        }
        instrument.stock -= quantityDifference;
        await instrument.save();
      } else if (sale.instrument_id.toString() !== instrument_id) {
        // Instrumento diferente, reverter stock do antigo e decrementar do novo
        if (sale.status === 'completed') {
          previousInstrument.stock += sale.quantity;
          await previousInstrument.save();
        }
        if (instrument.stock < quantity) {
          return res.status(400).json(errorResponse('Stock insuficiente', `Stock disponível: ${instrument.stock}, quantidade solicitada: ${quantity}`, 400));
        }
        if (status === 'completed') {
          instrument.stock -= quantity;
          await instrument.save();
        }
      }

      // Substituir todos os campos
      // Não permitir que uma venda já completada seja convertida para cancelled
      if (status === 'cancelled' && sale.status === 'completed') {
        return res.status(400).json(errorResponse('Operação inválida', 'Não é possível cancelar uma venda já completada', 400));
      }

      sale.seller_id = seller_id;
      sale.instrument_id = instrument_id;
      sale.customer_id = customer_id;
      sale.quantity = quantity;
      sale.unitPrice = unitPrice;
      sale.totalAmount = quantity * unitPrice;
      sale.notes = notes ? validators.sanitizeInput(notes) : '';
      sale.status = status || 'completed';

      await sale.save();

      await sale.populate('seller_id', 'name email');
      await sale.populate('instrument_id', 'name price');
      await sale.populate('customer_id', 'name email');

      return res.status(200).json(successResponse('Venda substituída com sucesso', sale, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao substituir venda', error.message, 500));
    }
  },

  // ============ UPDATE SALE (PATCH - Atualização parcial) ============
  updateSale: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de venda inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      // Verificar se venda existe
      const sale = await Sale.findById(id);
      if (!sale) {
        return res.status(404).json(errorResponse('Venda não encontrada', `Não existe venda com ID ${id}`, 404));
      }

      // Campos permitidos para atualização
      const allowedFields = ['quantity', 'unitPrice', 'notes', 'status'];
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

      // Validar os dados atualizados (combinar com dados existentes)
      const validation = validators.validateSale({
        seller_id: sale.seller_id,
        instrument_id: sale.instrument_id,
        customer_id: sale.customer_id,
        quantity: updateData.quantity !== undefined ? updateData.quantity : sale.quantity,
        unitPrice: updateData.unitPrice !== undefined ? updateData.unitPrice : sale.unitPrice,
        notes: updateData.notes !== undefined ? updateData.notes : sale.notes,
        status: updateData.status !== undefined ? updateData.status : sale.status
      });

      if (!validation.valid) {
        return res.status(400).json(errorResponse('Dados inválidos', validation.errors, 400));
      }

      // Lógica de stock para alterações de quantity ou status
      const instrument = await Instrument.findById(sale.instrument_id);

      if ('quantity' in updateData && updateData.quantity !== sale.quantity) {
        const quantityDifference = updateData.quantity - sale.quantity;
        if (sale.status === 'completed') {
          if (instrument.stock < quantityDifference) {
            return res.status(400).json(errorResponse('Stock insuficiente', `Stock disponível: ${instrument.stock}`, 400));
          }
          instrument.stock -= quantityDifference;
          await instrument.save();
        }
      }

      if ('status' in updateData && updateData.status !== sale.status) {
        const oldStatus = sale.status;
        const newStatus = updateData.status;

        // Bloquear cancelamento de vendas já completadas
        if (newStatus === 'cancelled' && oldStatus === 'completed') {
          return res.status(400).json(errorResponse('Operação inválida', 'Não é possível cancelar uma venda já completada', 400));
        }

        // Se muda de pending para completed, decrementar stock
        if (oldStatus === 'pending' && newStatus === 'completed') {
          if (instrument.stock < sale.quantity) {
            return res.status(400).json(errorResponse('Stock insuficiente', `Stock disponível: ${instrument.stock}`, 400));
          }
          instrument.stock -= sale.quantity;
          await instrument.save();
        }
        // Se muda de completed para cancelled, repor stock
        else if (oldStatus === 'cancelled' && newStatus === 'completed') {
          if (instrument.stock < sale.quantity) {
            return res.status(400).json(errorResponse('Stock insuficiente', `Stock disponível: ${instrument.stock}`, 400));
          }
          instrument.stock -= sale.quantity;
          await instrument.save();
        }
      }

      if ('notes' in updateData) {
        updateData.notes = updateData.notes ? validators.sanitizeInput(updateData.notes) : '';
      }

      // Se quantity ou unitPrice mudaram, recalcular totalAmount
      if ('quantity' in updateData || 'unitPrice' in updateData) {
        const finalQuantity = 'quantity' in updateData ? updateData.quantity : sale.quantity;
        const finalUnitPrice = 'unitPrice' in updateData ? updateData.unitPrice : sale.unitPrice;
        updateData.totalAmount = finalQuantity * finalUnitPrice;
      }

      // Aplicar atualizações
      Object.assign(sale, updateData);
      await sale.save();

      await sale.populate('seller_id', 'name email');
      await sale.populate('instrument_id', 'name price');
      await sale.populate('customer_id', 'name email');

      return res.status(200).json(successResponse('Venda atualizada com sucesso', sale, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao atualizar venda', error.message, 500));
    }
  },

  // ============ DELETE SALE ============
  deleteSale: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID de venda inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const sale = await Sale.findByIdAndDelete(id);

      if (!sale) {
        return res.status(404).json(errorResponse('Venda não encontrada', `Não existe venda com ID ${id}`, 404));
      }

      // Se a venda foi completada, repor stock
      if (sale.status === 'completed') {
        const instrument = await Instrument.findById(sale.instrument_id);
        if (instrument) {
          instrument.stock += sale.quantity;
          await instrument.save();
        }
      }

      return res.status(200).json(successResponse('Venda eliminada com sucesso', sale, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao eliminar venda', error.message, 500));
    }
  }
};

module.exports = saleController;

