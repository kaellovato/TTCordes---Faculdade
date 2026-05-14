// ==================== CONFIGURAÇÃO DE DATABASE ====================
// Conexão do projeto TTCordes ao MongoDB

const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ttcordes';

const connectDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('[DATABASE] Mongoose conectado com sucesso à base TTCordes');
  } catch (error) {
    console.error('[DATABASE] Falha ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDatabase };

