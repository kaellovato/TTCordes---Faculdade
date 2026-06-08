// ==================== CONTROLLER: STATISTICS ====================
// Dashboard analítico para a TTCordes
// Combina estatísticas de Vendas e Manutenções

const Sale = require('../models/Sale');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

const statisticsController = {

  // ============ GET TOTAL SALES ============
  // Número total de vendas realizadas (com filtros opcionais)
  getTotalSales: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = {};
      if (status) filter.status = status;

      const total = await Sale.countDocuments(filter);

      // Contar por estado
      const breakdown = await Sale.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { count: -1 } }
      ]);

      const totalRevenue = await Sale.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      return res.status(200).json(successResponse('Estatísticas de vendas', {
        totalSales: total,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        breakdown
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter total de vendas', error.message, 500));
    }
  },

  // ============ GET TOP INSTRUMENTS ============
  // Instrumentos mais vendidos (ranking)
  getTopInstruments: async (req, res) => {
    try {
      const { limit = 5 } = req.query;
      const limitNum = Math.max(1, Math.min(50, parseInt(limit)));

      const topInstruments = await Sale.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$instrument_id',
            totalSold: { $sum: '$quantity' },
            totalRevenue: { $sum: '$totalAmount' },
            salesCount: { $sum: 1 }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: limitNum },
        {
          $lookup: {
            from: 'instruments',
            localField: '_id',
            foreignField: '_id',
            as: 'instrument'
          }
        },
        { $unwind: '$instrument' },
        {
          $project: {
            _id: 0,
            instrument_id: '$_id',
            name: '$instrument.name',
            category: '$instrument.category',
            currentPrice: '$instrument.price',
            totalSold: 1,
            totalRevenue: 1,
            salesCount: 1
          }
        }
      ]);

      return res.status(200).json(successResponse('Top instrumentos mais vendidos', {
        limit: limitNum,
        instruments: topInstruments
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter top instrumentos', error.message, 500));
    }
  },

  // ============ GET REVENUE PER INSTRUMENT ============
  // Receita total gerada por cada instrumento (vendas)
  getRevenuePerInstrument: async (req, res) => {
    try {
      const revenueData = await Sale.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$instrument_id',
            totalRevenue: { $sum: '$totalAmount' },
            totalQuantity: { $sum: '$quantity' },
            salesCount: { $sum: 1 }
          }
        },
        { $sort: { totalRevenue: -1 } },
        {
          $lookup: {
            from: 'instruments',
            localField: '_id',
            foreignField: '_id',
            as: 'instrument'
          }
        },
        { $unwind: '$instrument' },
        {
          $project: {
            _id: 0,
            instrument_id: '$_id',
            name: '$instrument.name',
            category: '$instrument.category',
            totalRevenue: 1,
            totalQuantity: 1,
            salesCount: 1
          }
        }
      ]);

      const grandTotal = revenueData.reduce((sum, i) => sum + i.totalRevenue, 0);

      return res.status(200).json(successResponse('Receita por instrumento', {
        grandTotal,
        instruments: revenueData
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter receita por instrumento', error.message, 500));
    }
  },

  // ============ GET SELLER STREAKS ============
  // Dias consecutivos com vendas por vendedor
  getSellerStreaks: async (req, res) => {
    try {
      // Buscar todas as vendas concluídas, agrupadas por vendedor e data
      const salesBySellerAndDate = await Sale.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: {
              seller: '$seller_id',
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$saleDate' }
              }
            }
          }
        },
        { $sort: { '_id.seller': 1, '_id.date': 1 } }
      ]);

      // Calcular streaks por vendedor
      const sellerMap = {};
      for (const entry of salesBySellerAndDate) {
        const sellerId = entry._id.seller.toString();
        const dateStr = entry._id.date;

        if (!sellerMap[sellerId]) {
          sellerMap[sellerId] = [];
        }
        sellerMap[sellerId].push(dateStr);
      }

      const streakResults = [];

      for (const [sellerId, dates] of Object.entries(sellerMap)) {
        let currentStreak = 1;
        let maxStreak = 1;
        let currentStreakStart = dates[0];
        let maxStreakStart = dates[0];
        let maxStreakEnd = dates[0];

        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1]);
          const curr = new Date(dates[i]);
          const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
              maxStreakStart = currentStreakStart;
              maxStreakEnd = dates[i];
            }
          } else {
            currentStreak = 1;
            currentStreakStart = dates[i];
          }
        }

        // Verificar se o streak atual continua até hoje
        const today = new Date().toISOString().split('T')[0];
        const lastSaleDate = dates[dates.length - 1];
        const daysSinceLastSale = Math.round(
          (new Date(today) - new Date(lastSaleDate)) / (1000 * 60 * 60 * 24)
        );

        streakResults.push({
          seller_id: sellerId,
          totalDaysWithSales: dates.length,
          currentStreak: daysSinceLastSale <= 1 ? currentStreak : 0,
          maxStreak,
          maxStreakPeriod: { start: maxStreakStart, end: maxStreakEnd },
          lastSaleDate,
          isActiveToday: lastSaleDate === today
        });
      }

      // Popular dados dos vendedores
      const sellerIds = streakResults.map(s => s.seller_id);
      const sellers = await User.find({ _id: { $in: sellerIds } }, 'username email role');
      const sellerLookup = {};
      sellers.forEach(s => { sellerLookup[s._id.toString()] = s; });

      const enrichedResults = streakResults.map(s => ({
        ...s,
        seller: sellerLookup[s.seller_id] || null
      })).sort((a, b) => b.currentStreak - a.currentStreak || b.maxStreak - a.maxStreak);

      return res.status(200).json(successResponse('Streaks de vendas por vendedor', {
        streaks: enrichedResults
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao calcular streaks', error.message, 500));
    }
  },

  // ============ GET TOTAL MAINTENANCES ============
  // Número total de intervenções/manutenções realizadas
  getTotalMaintenances: async (req, res) => {
    try {
      const { status } = req.query;
      const filter = {};
      if (status) filter.status = status;

      const total = await Maintenance.countDocuments(filter);

      const breakdown = await Maintenance.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$cost' } } },
        { $sort: { count: -1 } }
      ]);

      const totalRevenue = await Maintenance.aggregate([
        { $match: { status: 'concluida' } },
        { $group: { _id: null, total: { $sum: '$cost' } } }
      ]);

      return res.status(200).json(successResponse('Estatísticas de manutenções', {
        totalMaintenances: total,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        breakdown
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter total de manutenções', error.message, 500));
    }
  },

  // ============ GET TIME PER SERVICE TYPE ============
  // Tempo total investido por tipo de serviço de manutenção
  getTimePerServiceType: async (req, res) => {
    try {
      const timeData = await Maintenance.aggregate([
        { $match: { status: 'concluida' } },
        {
          $group: {
            _id: '$serviceType',
            totalMinutes: { $sum: '$durationMinutes' },
            totalInterventions: { $sum: 1 },
            avgMinutes: { $avg: '$durationMinutes' },
            totalRevenue: { $sum: '$cost' }
          }
        },
        { $sort: { totalMinutes: -1 } },
        {
          $project: {
            _id: 0,
            serviceType: '$_id',
            totalMinutes: 1,
            totalHours: { $divide: ['$totalMinutes', 60] },
            totalInterventions: 1,
            avgMinutes: { $round: ['$avgMinutes', 1] },
            totalRevenue: 1
          }
        }
      ]);

      const totalMinutesAll = timeData.reduce((sum, s) => sum + s.totalMinutes, 0);

      return res.status(200).json(successResponse('Tempo investido por tipo de serviço', {
        totalMinutesAll,
        totalHoursAll: parseFloat((totalMinutesAll / 60).toFixed(2)),
        services: timeData
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter tempo por serviço', error.message, 500));
    }
  },

  // ============ GET TOP SERVICES ============
  // Serviços de manutenção mais requisitados
  getTopServices: async (req, res) => {
    try {
      const { limit = 5 } = req.query;
      const limitNum = Math.max(1, Math.min(20, parseInt(limit)));

      const topServices = await Maintenance.aggregate([
        {
          $group: {
            _id: '$serviceType',
            count: { $sum: 1 },
            totalMinutes: { $sum: '$durationMinutes' },
            totalRevenue: { $sum: '$cost' },
            avgCost: { $avg: '$cost' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limitNum },
        {
          $project: {
            _id: 0,
            serviceType: '$_id',
            count: 1,
            totalMinutes: 1,
            totalRevenue: 1,
            avgCost: { $round: ['$avgCost', 2] }
          }
        }
      ]);

      return res.status(200).json(successResponse('Serviços de manutenção mais requisitados', {
        limit: limitNum,
        services: topServices
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao obter top serviços', error.message, 500));
    }
  },

  // ============ GET TECHNICIAN STREAKS ============
  // Dias consecutivos com intervenções registadas por técnico
  getTechnicianStreaks: async (req, res) => {
    try {
      // Buscar todas as manutenções concluídas, agrupadas por técnico e data
      const interventionsByTechAndDate = await Maintenance.aggregate([
        { $match: { status: 'concluida' } },
        {
          $group: {
            _id: {
              technician: '$technician_id',
              date: {
                $dateToString: { format: '%Y-%m-%d', date: '$interventionDate' }
              }
            }
          }
        },
        { $sort: { '_id.technician': 1, '_id.date': 1 } }
      ]);

      // Calcular streaks por técnico
      const techMap = {};
      for (const entry of interventionsByTechAndDate) {
        const techId = entry._id.technician.toString();
        const dateStr = entry._id.date;

        if (!techMap[techId]) {
          techMap[techId] = [];
        }
        techMap[techId].push(dateStr);
      }

      const streakResults = [];

      for (const [techId, dates] of Object.entries(techMap)) {
        let currentStreak = 1;
        let maxStreak = 1;
        let currentStreakStart = dates[0];
        let maxStreakStart = dates[0];
        let maxStreakEnd = dates[0];

        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1]);
          const curr = new Date(dates[i]);
          const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
              maxStreakStart = currentStreakStart;
              maxStreakEnd = dates[i];
            }
          } else {
            currentStreak = 1;
            currentStreakStart = dates[i];
          }
        }

        const today = new Date().toISOString().split('T')[0];
        const lastDate = dates[dates.length - 1];
        const daysSinceLast = Math.round(
          (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24)
        );

        streakResults.push({
          technician_id: techId,
          totalDaysWithInterventions: dates.length,
          currentStreak: daysSinceLast <= 1 ? currentStreak : 0,
          maxStreak,
          maxStreakPeriod: { start: maxStreakStart, end: maxStreakEnd },
          lastInterventionDate: lastDate,
          isActiveToday: lastDate === today
        });
      }

      // Popular dados dos técnicos
      const techIds = streakResults.map(s => s.technician_id);
      const technicians = await User.find({ _id: { $in: techIds } }, 'username email role');
      const techLookup = {};
      technicians.forEach(t => { techLookup[t._id.toString()] = t; });

      const enrichedResults = streakResults.map(s => ({
        ...s,
        technician: techLookup[s.technician_id] || null
      })).sort((a, b) => b.currentStreak - a.currentStreak || b.maxStreak - a.maxStreak);

      return res.status(200).json(successResponse('Streaks de trabalho por técnico', {
        streaks: enrichedResults
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao calcular streaks de técnicos', error.message, 500));
    }
  },

  // ============ GET DASHBOARD SUMMARY ============
  // Resumo geral para o dashboard (uma chamada, todos os indicadores principais)
  getDashboardSummary: async (req, res) => {
    try {
      // Executar múltiplas queries em paralelo para máxima eficiência
      const [
        totalSales,
        totalMaintenances,
        salesRevenue,
        maintenanceRevenue,
        topInstruments,
        topServices
      ] = await Promise.all([
        Sale.countDocuments({ status: 'completed' }),
        Maintenance.countDocuments({ status: 'concluida' }),
        Sale.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]),
        Maintenance.aggregate([
          { $match: { status: 'concluida' } },
          { $group: { _id: null, total: { $sum: '$cost' }, totalMinutes: { $sum: '$durationMinutes' } } }
        ]),
        Sale.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: '$instrument_id', count: { $sum: '$quantity' } } },
          { $sort: { count: -1 } },
          { $limit: 3 },
          { $lookup: { from: 'instruments', localField: '_id', foreignField: '_id', as: 'instrument' } },
          { $unwind: '$instrument' },
          { $project: { _id: 0, name: '$instrument.name', count: 1 } }
        ]),
        Maintenance.aggregate([
          { $group: { _id: '$serviceType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 3 }
        ])
      ]);

      return res.status(200).json(successResponse('Resumo do dashboard TTCordes', {
        sales: {
          total: totalSales,
          totalRevenue: salesRevenue.length > 0 ? salesRevenue[0].total : 0
        },
        maintenances: {
          total: totalMaintenances,
          totalRevenue: maintenanceRevenue.length > 0 ? maintenanceRevenue[0].total : 0,
          totalMinutes: maintenanceRevenue.length > 0 ? maintenanceRevenue[0].totalMinutes : 0
        },
        topInstruments,
        topServices: topServices.map(s => ({ serviceType: s._id, count: s.count }))
      }, 200));
    } catch (error) {
      return res.status(500).json(errorResponse('Erro ao gerar dashboard', error.message, 500));
    }
  }
};

module.exports = statisticsController;
