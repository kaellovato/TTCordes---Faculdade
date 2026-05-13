// ==================== MODEL: USER ====================
// Schema e model para autenticação de utilizadores da TTCordes
// Roles previstas: seller e manager

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['seller', 'manager'],
      required: true,
      default: 'seller'
    }
  },
  { timestamps: true }
);

// TODO: Adicionar pre-save hook para hash de password no Sprint 2

const User = mongoose.model('User', userSchema);

module.exports = User;

