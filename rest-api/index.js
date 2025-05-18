const express = require('express');
const app = express();
const port = 3000;
const { livros, autores, emprestimos } = require('./data');

app.use(express.json());

// 1. Obter detalhes de um livro com autor
app.get('/livros/:id', (req, res) => {
  const livro = livros.find(l => l.id == req.params.id);
  if (!livro) return res.status(404).send('Livro não encontrado');
  const autor = autores.find(a => a.id === livro.autorId);
  res.json({ ...livro, autor });
});

// 2. Listar empréstimos ativos de um usuário
app.get('/usuarios/:id/emprestimos', (req, res) => {
  const { status } = req.query;
  const userEmprestimos = emprestimos.filter(e => e.usuarioId == req.params.id && (!status || e.status === status));
  const resultado = userEmprestimos.map(e => ({
    ...e,
    livro: livros.find(l => l.id === e.livroId),
  }));
  res.json(resultado);
});

// 3. Buscar livros por gênero, ordenados por popularidade
app.get('/livros', (req, res) => {
  const { genero, ordenar } = req.query;
  let resultado = [...livros];
  if (genero) resultado = resultado.filter(l => l.genero === genero);
  if (ordenar === 'popularidade') resultado.sort((a, b) => b.popularidade - a.popularidade);
  res.json(resultado);
});

app.listen(port, () => {
  console.log(`REST API rodando em http://localhost:${port}`);
});
