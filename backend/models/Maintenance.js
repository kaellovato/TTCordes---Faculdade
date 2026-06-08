// ==================== MODEL: MAINTENANCE ====================
// Schema e model para fichas de manutenção/reparação de instrumentos da TTCordes
// Cada ficha de manutenção regista o trabalho de um técnico num instrumento

const mongoose = require('mongoose');

// Tipos de serviço prestados na oficina de instrumentos da TTCordes
const SERVICE_TYPES = [
  'afinacao',           // Afinação e regulação
  'reparacao',          // Reparação de danos físicos
  'limpeza',            // Limpeza e manutenção geral
  'substituicao_cordas',// Troca de cordas
  'regulacao_traste',   // Regulação de trastes e ação
  'revisao_geral',      // Revisão completa do instrumento
  'setup_eletrico',     // Setup de pickups, eletrónica
  'restauro'            // Restauro e acabamento
];

const maintenanceSchema = new mongoose.Schema(
  {
    // Técnico responsável pela intervenção (User com role 'seller' ou 'manager')
    technician_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O técnico responsável é obrigatório']
    },

    // Instrumento sobre o qual recai a intervenção
    instrument_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instrument',
      required: [true, 'O instrumento é obrigatório']
    },

    // Cliente que entregou o instrumento para manutenção
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'O cliente é obrigatório']
    },

    // Tipo de serviço prestado
    serviceType: {
      type: String,
      enum: {
        values: SERVICE_TYPES,
        message: 'Tipo de serviço inválido: {VALUE}'
      },
      required: [true, 'O tipo de serviço é obrigatório']
    },

    // Data em que a intervenção foi realizada
    interventionDate: {
      type: Date,
      required: [true, 'A data da intervenção é obrigatória'],
      default: Date.now
    },

    // Duração da intervenção em minutos
    durationMinutes: {
      type: Number,
      required: [true, 'A duração da intervenção é obrigatória'],
      min: [1, 'A duração mínima é 1 minuto']
    },

    // Descrição detalhada do trabalho realizado
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'A descrição não pode exceder 1000 caracteres']
    },

    // Custo da manutenção em euros
    cost: {
      type: Number,
      required: [true, 'O custo da intervenção é obrigatório'],
      min: [0, 'O custo não pode ser negativo']
    },

    // Estado da ficha de manutenção
    status: {
      type: String,
      enum: {
        values: ['agendada', 'em_progresso', 'concluida', 'cancelada'],
        message: 'Estado inválido: {VALUE}'
      },
      default: 'concluida'
    }
  },
  {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
  }
);

// Índices para otimizar as queries mais frequentes
maintenanceSchema.index({ technician_id: 1, interventionDate: -1 });
maintenanceSchema.index({ serviceType: 1 });
maintenanceSchema.index({ interventionDate: -1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
module.exports.SERVICE_TYPES = SERVICE_TYPES;
