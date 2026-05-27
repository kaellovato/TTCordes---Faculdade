// ==================== MIDDLEWARE: LOGGER ====================
// Logging de requisições HTTP da TTCordes

// TODO
// - Log de método HTTP
// - Log de URL/caminho
// - Log de timestamp
// - Log de status code da resposta

const logger = (req, res, next) => {
  const timestamp = new Date().toLocaleString('pt-PT');
  const method = req.method;
  const url = req.url;

  // Log da requisição
  console.log(`[${timestamp}] ${method} ${url}`);

  // Hook para logar status code na resposta
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] ${method} ${url} → ${res.statusCode}`);
    originalSend.call(this, data);
  };

  next();
};

module.exports = logger;

