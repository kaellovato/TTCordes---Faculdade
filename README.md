# TTCordes

API RESTful para gestao da loja de instrumentos musicais TTCordes.

## Sprint atual

Projeto organizado em 4 sprints. Este repositorio esta no Sprint 1:

- analise detalhada dos requisitos;
- definicao dos endpoints;
- definicao dos modelos principais;
- rascunho OpenAPI/Swagger;
- definicao da arquitetura tecnica.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Swagger UI (OpenAPI)

## Executar localmente

```bash
npm install
npm start
```

Servidor: http://localhost:3000  
Swagger: http://localhost:3000/docs

## Endpoints planeados

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- Instruments: `GET /instruments`, `GET /instruments/:id`, `POST /instruments`, `PATCH /instruments/:id`, `DELETE /instruments/:id`
- Sales: `GET /sales`, `GET /sales/:id`, `POST /sales`, `PATCH /sales/:id`, `DELETE /sales/:id`
- Customers: `GET /customers`, `GET /customers/:id`, `POST /customers`, `PATCH /customers/:id`, `DELETE /customers/:id`
- Seller history: `GET /sellers/:id/history`, `GET /sellers/:id/stats`
- Statistics: `GET /statistics/total-sales`, `GET /statistics/top-instruments`, `GET /statistics/revenue-per-instrument`, `GET /statistics/seller-streaks`

## Modelos principais

- `User`
- `Instrument`
- `Sale`
- `Customer`

## Estado do backend

Os endpoints estao ligados e respondem com `501 Not Implemented`, indicando que ja foram definidos no Sprint 1 e serao implementados nos proximos sprints.
