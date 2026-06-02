# TTCordes - Relatório Sprint 3

## 1. Planeamento geral

O projeto foi dividido em 4 sprints:

1. Sprint 1: análise de requisitos, definição de endpoints e modelos, rascunho Swagger/OpenAPI, arquitetura técnica.
2. Sprint 2: autenticação completa (register/login/refresh), hash de password e validações.
3. Sprint 3: implementação completa de catálogo, clientes e vendas com CRUD + PATCH/PUT.
4. Sprint 4: histórico, estatísticas, testes finais, revisão de segurança e entrega.

Este repositório encontra-se no **Sprint 3**.

## 2. Objetivos da Sprint 3

Implementação completa do catálogo de instrumentos, gestão de clientes e sistema de vendas com validações robustas e regras de acesso:

- Implementar CRUD completo para Instrumentos (Catálogo);
- Implementar CRUD completo para Clientes;
- Implementar CRUD completo para Vendas com lógica de stock;
- Expandir validadores para todos os modelos;
- Adicionar suporte a PUT (substituição completa) e PATCH (atualização parcial);
- Aplicar proteção JWT em todos os endpoints apropriados;
- Implementar lógica de regras de negócio (stock, totais de vendas, etc).

## 3. Trabalho realizado

### 3.1 Validadores Expandidos (utils/validators.js)

Criados validadores robustos para:

#### validateInstrument(data)
- Nome: obrigatório, string não-vazia, único
- Categoria: obrigatório, string não-vazia
- Preço: obrigatório, número >= 0
- Stock: número >= 0
- Descrição: opcional, string
- Ativo: opcional, booleano
- Retorna: `{ valid: boolean, errors: array }`

#### validateCustomer(data)
- Nome: obrigatório, string não-vazia
- Email: obrigatório, formato válido, único
- Telefone: opcional, string
- Endereço: opcional, string
- Retorna: `{ valid: boolean, errors: array }`

#### validateSale(data)
- Vendedor ID: obrigatório, ObjectId válido
- Instrumento ID: obrigatório, ObjectId válido
- Cliente ID: obrigatório, ObjectId válido
- Quantidade: obrigatório, número > 0
- Preço Unitário: obrigatório, número >= 0
- Status: opcional, enum ['pending', 'completed', 'cancelled']
- Notas: opcional, string
- Retorna: `{ valid: boolean, errors: array }`

### 3.2 Controlador de Instrumentos (controllers/instrumentController.js)

Implementados os seguintes métodos:

#### GET /instruments
- Lista todos os instrumentos com paginação
- Filtro por status (ativo/inativo)
- Ordenação por data de criação decrescente
- Query params: `page`, `limit`, `active`

#### GET /instruments/:id
- Busca instrumento por ID
- Validação de ObjectId
- Tratamento de instrumento não encontrado

#### POST /instruments
- Criar novo instrumento
- Validação de dados obrigatórios e opcionais
- Verificação de nome único
- Hash de dados (sanitização)

#### PUT /instruments/:id
- Substituição completa do instrumento
- Validação de todos os campos
- Verificação de nome único (se mudado)
- Resposta com instrumento atualizado

#### PATCH /instruments/:id
- Atualização parcial do instrumento
- Apenas campos fornecidos são atualizados
- Validação apenas dos campos atualizados
- Retorno de erro se nenhum campo válido

#### DELETE /instruments/:id
- Eliminação de instrumento
- Validação de existência prévia
- Retorno de instrumento eliminado

### 3.3 Controlador de Clientes (controllers/customerController.js)

Implementados os seguintes métodos:

#### GET /customers
- Lista todos os clientes com paginação
- Ordenação por data de criação decrescente
- Query params: `page`, `limit`

#### GET /customers/:id
- Busca cliente por ID
- Validação de ObjectId
- Resposta com dados completos do cliente

#### POST /customers
- Criar novo cliente
- Validação de email (formato e unicidade)
- Normalização de email (lowercase)
- Sanitização de inputs

#### PUT /customers/:id
- Substituição completa do cliente
- Validação de email único (se mudado)
- Atualização de todos os campos

#### PATCH /customers/:id
- Atualização parcial do cliente
- Apenas campos fornecidos são atualizados
- Normalização de email se modificado

#### DELETE /customers/:id
- Eliminação de cliente
- Remoção completa da base de dados

### 3.4 Controlador de Vendas (controllers/saleController.js)

Implementados os seguintes métodos com lógica complexa de negócio:

#### GET /sales
- Lista todas as vendas com paginação
- Populate de referências (seller, instrument, customer)
- Filtro por status
- Ordenação por data de venda decrescente

#### GET /sales/:id
- Busca venda por ID
- Populate de todas as relações
- Retorna dados completos com nomes e preços

#### POST /sales
- Criar nova venda
- Validação de todos os IDs (seller, instrument, customer)
- Verificação de existência de seller, instrumento e cliente
- Verificação de stock suficiente
- Decremento automático de stock se venda é 'completed'
- Cálculo automático de totalAmount (quantity * unitPrice)

#### PUT /sales/:id
- Substituição completa da venda
- Lógica complexa de stock:
  - Se muda instrumento: reverter stock do antigo, decrementar do novo
  - Se apenas quantidade muda: ajustar diferença de stock
- Recálculo de totalAmount

#### PATCH /sales/:id
- Atualização parcial da venda
- Apenas campos permitidos: quantity, unitPrice, notes, status
- Lógica inteligente de stock baseada em mudanças de status:
  - pending → completed: decrementar stock
  - completed → cancelled: repor stock
  - cancelled → completed: decrementar stock
- Recálculo automático de totalAmount se quantity ou unitPrice mudam

#### DELETE /sales/:id
- Eliminação de venda
- Se venda foi 'completed', repor stock do instrumento
- Manutenção consistente de dados

### 3.5 Rotas Atualizadas

Todas as rotas foram atualizadas para suportar:

**Instrumentos (routes/instrumentRoutes.js)**
- `GET /instruments` - Público
- `GET /instruments/:id` - Público
- `POST /instruments` - Protegido (autenticado)
- `PUT /instruments/:id` - Protegido (autenticado)
- `PATCH /instruments/:id` - Protegido (autenticado)
- `DELETE /instruments/:id` - Protegido (autenticado)

Observação: durante esta sprint reforçámos as permissões sobre operações de escrita do catálogo — `POST`, `PUT`, `PATCH` e `DELETE` agora exigem role `manager` (ou `owner`). Ou seja, apenas gestores e superiores podem gerir o catálogo.

**Clientes (routes/customerRoutes.js)**
- `GET /customers` - Protegido (autenticado)
- `GET /customers/:id` - Protegido (autenticado)
- `POST /customers` - Protegido (autenticado)
- `PUT /customers/:id` - Protegido (autenticado)
- `PATCH /customers/:id` - Protegido (autenticado)
- `DELETE /customers/:id` - Protegido (autenticado)

**Vendas (routes/saleRoutes.js)**
- `GET /sales` - Protegido (autenticado)
- `GET /sales/:id` - Protegido (autenticado)
- `POST /sales` - Protegido (autenticado)
- `PUT /sales/:id` - Protegido (autenticado)
- `PATCH /sales/:id` - Protegido (autenticado)
- `DELETE /sales/:id` - Protegido (autenticado)

## 4. Endpoints Implementados

### 4.1 Instruments (Catálogo)
- ✅ GET /instruments - Listar todos (público)
- ✅ GET /instruments/:id - Obter um (público)
- ✅ POST /instruments - Criar (autenticado)
- ✅ PUT /instruments/:id - Substituir completo (autenticado)
- ✅ PATCH /instruments/:id - Atualizar parcial (autenticado)
- ✅ DELETE /instruments/:id - Eliminar (autenticado)

### 4.2 Customers (Clientes)
- ✅ GET /customers - Listar todos (autenticado)
- ✅ GET /customers/:id - Obter um (autenticado)
- ✅ POST /customers - Criar (autenticado)
- ✅ PUT /customers/:id - Substituir completo (autenticado)
- ✅ PATCH /customers/:id - Atualizar parcial (autenticado)
- ✅ DELETE /customers/:id - Eliminar (autenticado)

### 4.3 Sales (Vendas)
- ✅ GET /sales - Listar todos (autenticado)
- ✅ GET /sales/:id - Obter uma (autenticado)
- ✅ POST /sales - Criar (autenticado, com validação de stock)
- ✅ PUT /sales/:id - Substituir completo (autenticado, com gestão de stock)
- ✅ PATCH /sales/:id - Atualizar parcial (autenticado, com lógica de status)
- ✅ DELETE /sales/:id - Eliminar (autenticado, com repor stock se necessário)

## 5. Estrutura de Dados

### Instrument Model
```javascript
{
  name: String (obrigatório, único),
  description: String (opcional),
  category: String (obrigatório),
  price: Number (obrigatório, >= 0),
  stock: Number (obrigatório, >= 0),
  active: Boolean (padrão: true),
  timestamps: { createdAt, updatedAt }
}
```

### Customer Model
```javascript
{
  name: String (obrigatório),
  email: String (obrigatório, único),
  phone: String (opcional),
  address: String (opcional),
  timestamps: { createdAt, updatedAt }
}
```

### Sale Model
```javascript
{
  seller_id: ObjectId (ref: User, obrigatório),
  instrument_id: ObjectId (ref: Instrument, obrigatório),
  customer_id: ObjectId (ref: Customer, obrigatório),
  saleDate: Date (padrão: Date.now),
  quantity: Number (obrigatório, > 0),
  unitPrice: Number (obrigatório, >= 0),
  totalAmount: Number (calculado: quantity * unitPrice),
  notes: String (opcional),
  status: Enum ['pending', 'completed', 'cancelled'] (padrão: 'completed'),
  timestamps: { createdAt, updatedAt }
}
```

## 6. Lógica de Negócio Implementada

### Gestão de Stock
- Incremento de stock nas operações de venda cancelada
- Decremento de stock nas operações de venda completada
- Validação de stock suficiente antes de criar/atualizar vendas
- Lógica inteligente de transição de status com ajustes de stock

### Cálculos Automáticos
- `totalAmount = quantity * unitPrice`
- Atualização automática em PATCH se quantity ou unitPrice mudarem

### Validações de Referência
- Verificação de existência de seller (user)
- Verificação de existência de instrumento
- Verificação de existência de cliente
- Validação de roles do seller (deve ser 'seller' ou 'manager')
- Regras atualizadas durante a sprint:
  - Criação de vendas: **qualquer** utilizador autenticado pode registar uma venda (a restrição anterior que limitava a apenas `seller`/`manager` foi removida).
  - Cancelamento: uma venda que esteja com status `completed` **não** pode ser cancelada; cancelamentos apenas enquanto a venda estiver `pending`.

### Proteção de Dados
- Sanitização de inputs de texto
- Normalização de emails (lowercase)
- Validação rigorosa de ObjectIds MongoDB
- Tratamento centralizado de erros com mensagens descritivas

## 7. Segurança

### Proteção JWT
- Todos os endpoints de escrita exigem autenticação
- Endpoints GET de clientes exigem autenticação (dados sensíveis)
- Endpoints de leitura de instrumentos públicos (catálogo)
- Todos os endpoints de vendas protegidos

### Validações
- Validação de formato e tipos de dados
- Validação de limites (preços, quantidades)
- Validação de enums (status de venda)
- Verificação de duplicatas (nome de instrumento, email de cliente)

## 8. Conclusão

O Sprint 3 implementou com sucesso:
- ✅ CRUD completo (GET, POST, PUT, PATCH, DELETE) para 3 recursos principais
- ✅ Validações robustas e reutilizáveis
- ✅ Lógica de negócio complexa (gestão de stock, cálculos)
- ✅ Proteção JWT apropriada
- ✅ Tratamento de erros consistente
- ✅ Paginação e filtros

### Integração Frontend

- O frontend foi ligado ao backend através de `frontend/js/api.js` (utilitário central para requisições com `Authorization` a partir do `localStorage`) e `frontend/js/app.js` (renderização das páginas e chamadas às rotas principais).  
- Implementámos renderização básica e operações de listagem/criação para `Instrumentos`, `Clientes` e `Vendas` no frontend. As ações de escrita respeitam as permissões definidas (ex.: criação de instrumentos apenas para `manager`/`owner`).
- Fluxo de autenticação: `POST /auth/login` armazena `ttcordes_token` e `ttcordes_user` no `localStorage`; o `apiRequest` usa automaticamente o token nas chamadas.

O sistema está pronto para o **Sprint 4** que implementará:
- Histórico de operações
- Endpoints de estatísticas
- Testes finais
- Revisão de segurança
- Preparação para entrega
