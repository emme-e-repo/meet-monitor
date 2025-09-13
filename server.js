const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DATA_FILE = './logs.json';

app.use(cors());
app.use(express.json());

// Salva log
app.post('/api/log', (req, res) => {
  console.log('[SERVER] Ricevuto log:', req.body);  
  const log = req.body;
  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  data.push(log);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(200).json({ message: 'Log salvato' });
});

// Recupera log
app.get('/api/logs', (req, res) => {
  const data = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});

