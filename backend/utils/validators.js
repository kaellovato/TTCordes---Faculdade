// ==================== UTILS: VALIDATORS ====================
// Funções de validação reutilizáveis para a TTCordes

// TODO
// - Validar email
// - Validar password
// - Validar instrument
// - Validar sale
// - Validar customer

const validators = {
  validateEmail: (email) => {
    if (!email || typeof email !== 'string') return false;

    const normalizedEmail = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(normalizedEmail)) return false;

    return normalizedEmail.endsWith('.pt');
  },

  validatePassword: (password) => {
    // Mínimo 6 caracteres
    return password && password.length >= 6;
  },

  validateInstrument: (instrument) => {
    // TODO: Validar campos de instrument
    return true;
  },

  validateSale: (sale) => {
    // TODO: Validar campos de sale
    return true;
  },

  validateCustomer: (customer) => {
    // TODO: Validar campos de customer
    return true;
  }
};

module.exports = validators;

