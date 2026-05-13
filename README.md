# TTCordes

API RESTful para gerir uma loja de instrumentos musicais, com catálogo, vendas, clientes, histórico por vendedor e estatísticas de produtividade.

## Objetivo

O projeto está orientado para a marca **TTCordes** e pretende suportar:
- autenticação de vendedores e gestores;
- catálogo de instrumentos musicais;
- registo de vendas;
- consulta de histórico por vendedor;
- estatísticas de vendas e desempenho;
- gestão de clientes como funcionalidade extra.

## Stack tecnológica

- **Backend:** Node.js + Express.js
- **Base de dados:** MongoDB + Mongoose
- **Autenticação:** JWT + bcryptjs
- **Documentação:** OpenAPI / Swagger

## Como correr

```bash
npm install
cp .env.example .env
npm start
```

Servidor por defeito em `http://localhost:3000`.

## Endpoints previstos

### Autenticação
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

### Instrumentos
- `GET /instruments`
- `GET /instruments/:id`
- `POST /instruments`
- `PATCH /instruments/:id`
- `DELETE /instruments/:id`

### Vendas
- `GET /sales`
- `GET /sales/:id`
- `POST /sales`
- `PATCH /sales/:id`
- `DELETE /sales/:id`

### Histórico e estatísticas
- `GET /sellers/:id/history`
- `GET /sellers/:id/stats`
- `GET /statistics/total-sales`
- `GET /statistics/top-instruments`
- `GET /statistics/revenue-per-instrument`
- `GET /statistics/seller-streaks`

### Clientes
- `GET /customers`
- `GET /customers/:id`
- `POST /customers`
- `PATCH /customers/:id`
- `DELETE /customers/:id`

## Modelos principais

- `User` — utilizadores da plataforma, com roles `seller` e `manager`
- `Instrument` — catálogo de instrumentos musicais
- `Sale` — registo de vendas e associação a vendedor, cliente e instrumento
- `Customer` — clientes da loja

## Estrutura do projeto

```
Projeto de Gestao de Oficina automovel/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── ignorar/
├── index.js
├── package.json
├── README.md
└── RELATORIO_MOODLE.md
```

## Estado atual

O projeto já tem a base de planeamento e a estrutura inicial pronta. O próximo passo é implementar os controladores e ligar as rotas ao novo tema da loja TTCordes.

# TTCordes---Faculdade
