// ==================== MIDDLEWARE: ERROR HANDLER ====================
// Tratamento global de erros da TTCordes

// TODO
// - Receber erro
// - Log do erro
// - Retornar resposta formatada
// - Status code apropriado

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Erro de validação Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Validação falhou',
      details: err.errors
    });
  }

  // Erro de chave única (duplicate key)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_KEY',
      message: `${field} já existe`,
      details: { field }
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;

