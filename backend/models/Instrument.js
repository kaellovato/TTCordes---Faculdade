// ==================== MODEL: INSTRUMENT ====================
// Schema e model para catálogo de instrumentos musicais da TTCordes

const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Instrument = mongoose.model('Instrument', instrumentSchema);

module.exports = Instrument;

