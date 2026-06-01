# TTCordes - Relatorio Sprint 1

## 1. Planeamento geral

O projeto foi dividido em 4 sprints:

1. Sprint 1: analise de requisitos, definicao de endpoints e modelos, rascunho Swagger/OpenAPI, arquitetura tecnica.
2. Sprint 2: autenticacao completa (register/login/refresh), hash de password e validacoes.
3. Sprint 3: implementacao completa de catalogo, vendas e historico.
4. Sprint 4: estatisticas, testes finais, revisao de seguranca e entrega.

Este repositorio encontra-se no Sprint 1.

## 2. Analise detalhada de requisitos

Tema: venda de instrumentos musicais.

Requisitos funcionais principais:

- gerir autenticacao de vendedores e gestores;
- gerir catalogo de instrumentos;
- registar e consultar vendas;
- consultar historico por vendedor;
- gerar estatisticas de vendas;
- gerir clientes (modulo extra).

## 3. Endpoints definidos (planeados)

### 3.1 Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh

### 3.2 Catalogo de instrumentos
- GET /instruments
- GET /instruments/:id
- POST /instruments
- PATCH /instruments/:id
- DELETE /instruments/:id

### 3.3 Vendas
- GET /sales
- GET /sales/:id
- POST /sales
- PATCH /sales/:id
- DELETE /sales/:id

### 3.4 Historico por vendedor
- GET /sellers/:id/history
- GET /sellers/:id/stats

### 3.5 Estatisticas
- GET /statistics/total-sales
- GET /statistics/top-instruments
- GET /statistics/revenue-per-instrument
- GET /statistics/seller-streaks

### 3.6 Clientes (extra)
- GET /customers
- GET /customers/:id
- POST /customers
- PATCH /customers/:id
- DELETE /customers/:id

## 4. Modelos de dados principais

- User: vendedor/gestor, autenticacao e permissoes.
- Instrument: item do catalogo (nome, categoria, preco, stock).
- Sale: venda associada a vendedor, instrumento e cliente.
- Customer: dados de cliente para historico e relacionamento.

## 5. Rascunho OpenAPI (Swagger)

- Documento OpenAPI criado em `docs/openapi.js`.
- Swagger UI disponivel em `GET /docs`.
- Endpoints do Sprint 1 estao documentados e ligados no servidor.

## 6. Arquitetura tecnica

Organizacao de pastas e ficheiros:

- config/: configuracao de base de dados e JWT.
- controllers/: regras por modulo (auth, instruments, sales, customers, history, statistics).
- models/: schemas Mongoose.
- routes/: definicao de rotas HTTP.
- middlewares/: autenticacao, autorizacao, erros e logs.
- utils/: validadores e helpers.
- docs/: especificacao OpenAPI.

## 7. Estado da entrega do Sprint 1

- Sprint 1 concluido ao nivel de analise e documentacao.
- API preparada para os proximos sprints com rotas definidas.
- Endpoints atuais respondem com 501 Not Implemented para indicar implementacao futura.

