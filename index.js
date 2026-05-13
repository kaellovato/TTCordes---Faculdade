// ==================== SERVIDOR PRINCIPAL ====================
// Ponto de entrada da API TTCordes
// Carrega as configurações e inicia o servidor Express

// Importar módulos necessários
require('dotenv').config();  // Carregar variáveis de ambiente
const express = require('express');
const mongoose = require('mongoose');

// Criar aplicação Express
const app = express();

// ==================== MIDDLEWARE GLOBAL ====================

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded
app.use(express.urlencoded({ extended: true }));

// ==================== CONFIGURAÇÕES ====================

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ttcordes';

// ==================== CONEXÃO COM MONGODB ====================

// Conectar ao MongoDB usando Mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('[DATABASE] MongoDB conectado com sucesso!'))
.catch(err => {
  console.error('[DATABASE] Falha ao conectar com MongoDB:', err.message);
  process.exit(1);
});

// ==================== ROTAS ====================

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API TTCordes - Setup Inicial',
    status: 'online',
    endpoints: {
      docs: 'GET /docs (Swagger - após Sprint 7)',
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        refresh: 'POST /auth/refresh'
      },
      instruments: 'GET /instruments',
      sales: 'GET /sales',
      customers: 'GET /customers (extra)',
      statistics: 'GET /statistics/*',
      history: 'GET /sellers/:id/*'
    }
  });
});

// Importar rotas (será adicionado nos próximos sprints)
// const authRoutes = require('./routes/authRoutes');
// const instrumentRoutes = require('./routes/instrumentRoutes');
// const saleRoutes = require('./routes/saleRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const statisticsRoutes = require('./routes/statisticsRoutes');
// const historyRoutes = require('./routes/historyRoutes');

// Aplicar rotas (será ativado quando os ficheiros estiverem prontos)
// app.use('/auth', authRoutes);
// app.use('/instruments', instrumentRoutes);
// app.use('/sales', saleRoutes);
// app.use('/customers', customerRoutes);
// app.use('/statistics', statisticsRoutes);
// app.use('/sellers', historyRoutes);

// ==================== TRATAMENTO DE ERROS ====================

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Rota '${req.method} ${req.path}' não encontrada`,
    details: {
      method: req.method,
      path: req.path
    }
  });
});

// Middleware de tratamento de erros global (deve ser último)
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║  TTCordes API                              ║
║  Status: ONLINE                            ║
╚════════════════════════════════════════════╝

Servidor em: http://localhost:${PORT}
Database: ${MONGODB_URI}
Ambiente: ${process.env.NODE_ENV || 'development'}

Próximo passo: autenticação, catálogo e vendas
   `);
});

// ==================== EXPORT (para testes) ====================
module.exports = app;