const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

// Cria a tabela automaticamente ao iniciar
db.run(`
  CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cidade TEXT NOT NULL,
    anotacao TEXT
  )
`);

app.get('/contatos', (req, res) => {
  db.all('SELECT * FROM contatos', [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post('/contatos', (req, res) => {
  const { nome, telefone, cidade, anotacao } = req.body;
  db.run('INSERT INTO contatos (nome, telefone, cidade, anotacao) VALUES (?, ?, ?, ?)', 
    [nome, telefone, cidade, anotacao], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ id: this.lastID, nome, telefone, cidade, anotacao });
  });
});

app.put('/contatos/:id', (req, res) => {
  const { nome, telefone, cidade, anotacao } = req.body;
  db.run('UPDATE contatos SET nome = ?, telefone = ?, cidade = ?, anotacao = ? WHERE id = ?', 
    [nome, telefone, cidade, anotacao, req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Atualizado com sucesso' });
  });
});

app.delete('/contatos/:id', (req, res) => {
  db.run('DELETE FROM contatos WHERE id = ?', req.params.id, function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(204).send();
  });
});

app.listen(3000, () => console.log('API rodando na porta 3000'));