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
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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

