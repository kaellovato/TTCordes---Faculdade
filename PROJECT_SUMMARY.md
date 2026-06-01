# PROJECT SUMMARY — TTCordes (Sprint 1)

## Resumo breve

- Projeto: API REST para a loja de instrumentos musicais TTCordes.
- Objetivo deste documento: explicar de forma curta o que o código atual já faz e o que será desenvolvido nos próximos sprints.

## Estado atual

- O servidor Express arranca a partir de `index.js` e expõe a rota raiz `/`.
- O Swagger UI está disponível em `/docs`, usando a especificação definida em `docs/openapi.js`.
- As rotas já estão ligadas ao servidor, mas os controladores devolvem `501 Not Implemented`, porque a lógica completa ainda não foi desenvolvida.
- Os modelos Mongoose já existem em `models/User.js`, `models/Instrument.js`, `models/Sale.js` e `models/Customer.js`.
- Os middlewares principais estão preparados em `middlewares/authMiddleware.js`, `middlewares/roleMiddleware.js` e `middlewares/errorHandler.js`.
- A configuração de base de dados e JWT está centralizada em `config/database.js` e `config/jwt.js`.
- O projeto foi organizado com tema musical e os nomes de ficheiros e rotas foram ajustados para esse contexto.
- O ficheiro `.env` não é obrigatório neste sprint; o repositório usa valores por omissão e o `.env.example` foi removido por pedido.

## O que o código fará nos próximos sprints

### Sprint 2

- Setup do projeto.
- Autenticação de instrumentos com JWT.
- Preparação da base de segurança para acesso autenticado.

### Sprint 3

- Catálogo de serviços protegido com JWT.
- CRUD completo para serviços.
- Validações e regras de acesso.

### Sprint 4

- Intervenções / fichas de trabalho.
- Estatísticas e endpoints agregados.
- Testes finais, revisão de segurança e preparação da entrega.

## Swagger / OpenAPI

- O arquivo `docs/openapi.js` contém o rascunho OpenAPI usado pelo Swagger UI.
- O objetivo é documentar os endpoints planeados antes da implementação completa.

## Arquitetura técnica

- `index.js`: arranque do servidor e ligação das rotas.
- `config/`: configuração de base de dados e JWT.
- `controllers/`: lógica de cada recurso, atualmente como placeholder.
- `routes/`: definição dos endpoints HTTP.
- `models/`: schemas Mongoose.
- `middlewares/`: autenticação, autorização e tratamento de erros.
- `docs/`: documentação OpenAPI.

## Conclusão

- O projeto está na fase inicial do Sprint 1.
- A base estrutural e documental já existe.
- A implementação completa será feita de forma gradual nos sprints seguintes.