// ==================== UTILS: RESPONSE ====================
// Este arquivo será implementado no Sprint 2
// Helpers para formatar respostas

const successResponse = (res, data, message = 'Operação bem-sucedida', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const errorResponse = (res, error, message, statusCode = 400, details = {}) => {
  res.status(statusCode).json({
    success: false,
    error,
    message,
    details
  });
};

module.exports = {
  successResponse,
  errorResponse
};

