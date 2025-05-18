const { ApolloServer, gql } = require('apollo-server');


const autores = [{ id: 1, nome: 'Machado de Assis' }];
const livros = [
  { id: 1, titulo: 'Dom Casmurro', genero: 'Romance', popularidade: 8.7, autorId: 1 },
];
const emprestimos = [
  { id: 1, livroId: 1, usuarioId: 1, status: 'ativo' }
];

const typeDefs = gql`
  type Autor {
    id: ID!
    nome: String!
  }

  type Livro {
    id: ID!
    titulo: String!
    genero: String!
    popularidade: Float!
    autor: Autor!
  }

  type Emprestimo {
    id: ID!
    livro: Livro!
    usuarioId: Int!
    status: String!
  }

  type Query {
    livro(id: ID!): Livro
    livros(genero: String, ordenar: String): [Livro]
    emprestimosAtivos(usuarioId: Int!): [Emprestimo]
  }

  type Mutation {
    adicionarLivro(titulo: String!, genero: String!, autorId: Int!): Livro
  }
`;

// Resolver funções
const resolvers = {
  Query: {
    livro: (parent, { id }) => {
      const livro = livros.find(l => l.id == id);
      return livro ? { ...livro, autor: autores.find(a => a.id == livro.autorId) } : null;
    },
    livros: (parent, { genero, ordenar }) => {
      let resultado = livros;
      if (genero) {
        resultado = resultado.filter(l => l.genero === genero);
      }
      if (ordenar === 'popularidade') {
        resultado = resultado.sort((a, b) => b.popularidade - a.popularidade);
      }
      return resultado.map(l => ({ ...l, autor: autores.find(a => a.id == l.autorId) }));
    },
    emprestimosAtivos: (parent, { usuarioId }) => {
      return emprestimos
        .filter(e => e.usuarioId === usuarioId && e.status === 'ativo')
        .map(e => ({ ...e, livro: livros.find(l => l.id == e.livroId) }));
    }
  },
  Mutation: {
    adicionarLivro: (parent, { titulo, genero, autorId }) => {
      const novoLivro = { id: livros.length + 1, titulo, genero, autorId, popularidade: 0 };
      livros.push(novoLivro);
      return { ...novoLivro, autor: autores.find(a => a.id === autorId) };
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers
});


server.listen(4000).then(({ url }) => {
  console.log(`Servidor GraphQL rodando em ${url}`);
});
