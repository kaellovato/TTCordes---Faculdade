// ==================== CONTROLLER: HISTORY ====================
// Histórico e estatísticas individuais por vendedor/técnico

const Sale = require('../models/Sale');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');
const validators = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/response');

const historyController = {

  // ============ GET SELLER HISTORY ============
  // Histórico de vendas de um vendedor específico
  getSellerHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const seller = await User.findById(id);
      if (!seller) {
        return res.status(404).json(errorResponse('Vendedor não encontrado', `Não existe utilizador com ID ${id}`, 404));
      }

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const total = await Sale.countDocuments({ seller_id: id });

      const sales = await Sale.find({ seller_id: id })
        .populate('instrument_id', 'name category price')
        .populate('customer_id', 'name email')
        .skip(skip)
        .limit(limitNum)
        .sort({ saleDate: -1 });

      return res.status(200).json(successResponse('Histórico de vendas do vendedor', {
        seller: { _id: seller._id, username: seller.username, email: seller.email, role: seller.role },
        sales,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter histórico do vendedor', error.message, 500));
    }
  },

  // ============ GET SELLER STATS ============
  // Indicadores de desempenho de um vendedor
  getSellerStats: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const seller = await User.findById(id);
      if (!seller) {
        return res.status(404).json(errorResponse('Vendedor não encontrado', `Não existe utilizador com ID ${id}`, 404));
      }

      // Executar queries em paralelo
      const [salesStats, topInstruments, monthlySales] = await Promise.all([
        // Stats gerais de vendas
        Sale.aggregate([
          { $match: { seller_id: seller._id } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              revenue: { $sum: '$totalAmount' }
            }
          }
        ]),
        // Top instrumentos vendidos por este vendedor
        Sale.aggregate([
          { $match: { seller_id: seller._id, status: 'completed' } },
          { $group: { _id: '$instrument_id', totalSold: { $sum: '$quantity' } } },
          { $sort: { totalSold: -1 } },
          { $limit: 3 },
          { $lookup: { from: 'instruments', localField: '_id', foreignField: '_id', as: 'instrument' } },
          { $unwind: '$instrument' },
          { $project: { _id: 0, name: '$instrument.name', totalSold: 1 } }
        ]),
        // Vendas por mês (últimos 6 meses)
        Sale.aggregate([
          {
            $match: {
              seller_id: seller._id,
              status: 'completed',
              saleDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$saleDate' } },
              count: { $sum: 1 },
              revenue: { $sum: '$totalAmount' }
            }
          },
          { $sort: { _id: 1 } }
        ])
      ]);

      // Agregar stats por status
      const statsMap = { completed: { count: 0, revenue: 0 }, pending: { count: 0, revenue: 0 }, cancelled: { count: 0, revenue: 0 } };
      salesStats.forEach(s => {
        if (statsMap[s._id]) statsMap[s._id] = { count: s.count, revenue: s.revenue };
      });

      return res.status(200).json(successResponse('Estatísticas do vendedor', {
        seller: { _id: seller._id, username: seller.username, email: seller.email, role: seller.role },
        totalSales: salesStats.reduce((sum, s) => sum + s.count, 0),
        totalRevenue: statsMap.completed.revenue,
        byStatus: statsMap,
        topInstruments,
        monthlySales
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter estatísticas do vendedor', error.message, 500));
    }
  },

  // ============ GET TECHNICIAN HISTORY ============
  // Histórico de manutenções de um técnico específico
  getTechnicianHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const technician = await User.findById(id);
      if (!technician) {
        return res.status(404).json(errorResponse('Técnico não encontrado', `Não existe utilizador com ID ${id}`, 404));
      }

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const total = await Maintenance.countDocuments({ technician_id: id });

      const maintenances = await Maintenance.find({ technician_id: id })
        .populate('instrument_id', 'name category price')
        .populate('customer_id', 'name email phone')
        .skip(skip)
        .limit(limitNum)
        .sort({ interventionDate: -1 });

      return res.status(200).json(successResponse('Histórico de manutenções do técnico', {
        technician: { _id: technician._id, username: technician.username, email: technician.email, role: technician.role },
        maintenances,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter histórico do técnico', error.message, 500));
    }
  },

  // ============ GET TECHNICIAN STATS ============
  // Indicadores de desempenho de um técnico
  getTechnicianStats: async (req, res) => {
    try {
      const { id } = req.params;

      if (!validators.isValidObjectId(id)) {
        return res.status(400).json(errorResponse('ID inválido', 'ID deve ser um MongoDB ObjectId válido', 400));
      }

      const technician = await User.findById(id);
      if (!technician) {
        return res.status(404).json(errorResponse('Técnico não encontrado', `Não existe utilizador com ID ${id}`, 404));
      }

      const [maintenanceStats, topServices, monthlyWork] = await Promise.all([
        // Stats gerais de manutenções
        Maintenance.aggregate([
          { $match: { technician_id: technician._id } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              revenue: { $sum: '$cost' },
              totalMinutes: { $sum: '$durationMinutes' }
            }
          }
        ]),
        // Top serviços realizados por este técnico
        Maintenance.aggregate([
          { $match: { technician_id: technician._id, status: 'concluida' } },
          { $group: { _id: '$serviceType', count: { $sum: 1 }, totalMinutes: { $sum: '$durationMinutes' } } },
          { $sort: { count: -1 } },
          { $limit: 3 }
        ]),
        // Intervenções por mês (últimos 6 meses)
        Maintenance.aggregate([
          {
            $match: {
              technician_id: technician._id,
              status: 'concluida',
              interventionDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$interventionDate' } },
              count: { $sum: 1 },
              totalMinutes: { $sum: '$durationMinutes' },
              revenue: { $sum: '$cost' }
            }
          },
          { $sort: { _id: 1 } }
        ])
      ]);

      const completedStats = maintenanceStats.find(s => s._id === 'concluida') || { count: 0, revenue: 0, totalMinutes: 0 };

      return res.status(200).json(successResponse('Estatísticas do técnico', {
        technician: { _id: technician._id, username: technician.username, email: technician.email, role: technician.role },
        totalInterventions: maintenanceStats.reduce((sum, s) => sum + s.count, 0),
        totalRevenue: completedStats.revenue,
        totalHoursWorked: parseFloat((completedStats.totalMinutes / 60).toFixed(2)),
        byStatus: maintenanceStats,
        topServices: topServices.map(s => ({ serviceType: s._id, count: s.count, totalMinutes: s.totalMinutes })),
        monthlyWork
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter estatísticas do técnico', error.message, 500));
    }
  }
};

module.exports = historyController;
