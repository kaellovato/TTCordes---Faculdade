// ==================== MODEL: SALE ====================
// Schema e model para registo de vendas da TTCordes

const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    instrument_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    saleDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      default: null
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed'
    }
  },
  { timestamps: true }
);

// TODO: Adicionar hook para calcular totalAmount a partir de quantity e unitPrice

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;

