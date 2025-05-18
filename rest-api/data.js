// data.js
const autores = [
  { id: 1, nome: 'Machado de Assis' },
];

const livros = [
  { id: 1, titulo: 'Dom Casmurro', genero: 'Romance', popularidade: 8.7, autorId: 1 },
];

const emprestimos = [
  { id: 100, usuarioId: 5, livroId: 1, status: 'ativo', dataEmprestimo: '2025-05-01', dataDevolucao: '2025-05-15' },
];

module.exports = { autores, livros, emprestimos };