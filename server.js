const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Banco de dados em memória (temporário)
const localizacoes = [];

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint POST para receber localização
app.post('/api/localizacao', (req, res) => {
  const { latitude, longitude, timestamp } = req.body;
  if (latitude && longitude) {
    localizacoes.push({ latitude, longitude, timestamp: timestamp || Date.now() });
    console.log(`Recebido: ${latitude}, ${longitude}, ${timestamp}`);
    return res.status(200).json({ message: 'Localização recebida com sucesso!' });
  }
  res.status(400).json({ message: 'Dados inválidos.' });
});

// Endpoint GET simples para testar servidor
app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});