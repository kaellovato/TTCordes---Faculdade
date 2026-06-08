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
    const errors = [];
    if (!instrument || typeof instrument !== 'object') {
      return { valid: false, errors: ['Instrument data missing'] };
    }

    const { name, category, price, stock, description, active } = instrument;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Nome inválido (mínimo 2 caracteres)');
    }

    if (!category || typeof category !== 'string' || category.trim().length < 2) {
      errors.push('Categoria inválida');
    }

    if (price === undefined || typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      errors.push('Preço inválido');
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      errors.push('Stock inválido');
    }

    if (description !== undefined && typeof description !== 'string') {
      errors.push('Descrição inválida');
    }

    if (active !== undefined && typeof active !== 'boolean') {
      errors.push('Campo active deve ser booleano');
    }

    return { valid: errors.length === 0, errors };
  },

  validateSale: (sale) => {
    const errors = [];
    if (!sale || typeof sale !== 'object') return { valid: false, errors: ['Sale data missing'] };

    const { seller_id, instrument_id, customer_id, quantity, unitPrice, status } = sale;

    const isValidId = validators.isValidObjectId;
    if (!seller_id || !isValidId(seller_id)) errors.push('seller_id inválido');
    if (!instrument_id || !isValidId(instrument_id)) errors.push('instrument_id inválido');
    if (!customer_id || !isValidId(customer_id)) errors.push('customer_id inválido');

    if (quantity === undefined || typeof quantity !== 'number' || quantity <= 0) errors.push('quantity inválida');
    if (unitPrice === undefined || typeof unitPrice !== 'number' || unitPrice < 0) errors.push('unitPrice inválido');

    const allowedStatus = ['pending', 'completed', 'cancelled'];
    if (status !== undefined && !allowedStatus.includes(status)) errors.push('status inválido');

    return { valid: errors.length === 0, errors };
  },

  validateCustomer: (customer) => {
    const errors = [];
    if (!customer || typeof customer !== 'object') return { valid: false, errors: ['Customer data missing'] };

    const { name, email, phone, address } = customer;

    if (!name || typeof name !== 'string' || name.trim().length < 2) errors.push('Nome inválido');

    if (!email || typeof email !== 'string') {
      errors.push('Email inválido');
    } else {
      const normalized = email.trim().toLowerCase();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(normalized)) errors.push('Email com formato inválido');
    }

    if (phone !== undefined && phone !== '' && typeof phone !== 'string') errors.push('Telefone inválido');
    if (address !== undefined && address !== '' && typeof address !== 'string') errors.push('Endereço inválido');

    return { valid: errors.length === 0, errors };
  },

  validateMaintenance: (maintenance) => {
    const errors = [];
    if (!maintenance || typeof maintenance !== 'object') return { valid: false, errors: ['Maintenance data missing'] };

    const { technician_id, instrument_id, customer_id, serviceType, durationMinutes, cost } = maintenance;

    const SERVICE_TYPES = [
      'afinacao', 'reparacao', 'limpeza', 'substituicao_cordas',
      'regulacao_traste', 'revisao_geral', 'setup_eletrico', 'restauro'
    ];

    const isValidId = (id) => id && /^[a-fA-F0-9]{24}$/.test(String(id));

    if (!technician_id || !isValidId(technician_id)) errors.push('technician_id inválido');
    if (!instrument_id || !isValidId(instrument_id)) errors.push('instrument_id inválido');
    if (!customer_id || !isValidId(customer_id)) errors.push('customer_id inválido');

    if (!serviceType || !SERVICE_TYPES.includes(serviceType)) {
      errors.push(`serviceType inválido. Valores aceites: ${SERVICE_TYPES.join(', ')}`);
    }

    if (durationMinutes === undefined || typeof durationMinutes !== 'number' || durationMinutes < 1) {
      errors.push('durationMinutes inválido (mínimo 1 minuto)');
    }

    if (cost === undefined || typeof cost !== 'number' || cost < 0) {
      errors.push('cost inválido (deve ser >= 0)');
    }

    return { valid: errors.length === 0, errors };
  }
};

// Helpers usados pelos controllers
validators.isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
};

validators.sanitizeInput = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.trim();
};

module.exports = validators;

