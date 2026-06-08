// ==================== UTILS: RESPONSE ====================
// Helpers para formatar respostas JSON

const successResponse = (message = '', data = {}, statusCode = 200) => ({
  success: true,
  message,
  data
});

const errorResponse = (message = '', errors = [], statusCode = 400) => ({
  success: false,
  message,
  errors: Array.isArray(errors) ? errors : [errors]
});

module.exports = {
  successResponse,
  errorResponse
};
