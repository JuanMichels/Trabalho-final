require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const db = require('./configs');
const PORT = process.env.PORT;

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || 'http://localhost:9000,http://127.0.0.1:9000')
    .split(',')
    .map(origin => origin.trim())
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

require('./routers')(app);

app.get('/', async (req, res) => {
  try {
    const sql = 'select version()';
    const result = await db.query(sql).then(response => response.rows);
    return res.status(200).json({
      status: 'ok',
      message: 'Conexão com o banco de dados realizada com sucesso',
      data: result
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Erro ao conectar ao banco de dados',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`API Rodando na porta ${PORT}`)
});