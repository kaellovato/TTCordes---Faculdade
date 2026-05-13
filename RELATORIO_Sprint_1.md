# TTCordes

## Relatório curto para entrega no Moodle

### 1. Objetivo do projeto
Desenvolver uma API RESTful para a loja **TTCordes**, com foco em:
- autenticação de vendedores e gestores;
- catálogo de instrumentos musicais;
- registo de vendas;
- histórico por vendedor;
- estatísticas de vendas e desempenho;
- gestão de clientes como funcionalidade extra.

### 2. O que já foi definido
#### Análise de requisitos
Foi feita a análise dos requisitos principais do sistema e dos módulos necessários para a aplicação.

#### Endpoints previstos
Os endpoints planeados já estão identificados para:
- autenticação;
- instrumentos;
- vendas;
- histórico;
- estatísticas;
- clientes.

#### Modelos de dados
Os modelos principais definidos são:
- `User` — utilizadores com roles `seller` e `manager`;
- `Instrument` — catálogo de instrumentos musicais;
- `Sale` — registo de vendas;
- `Customer` — clientes da loja.

#### Documentação OpenAPI
Existe um rascunho da documentação Swagger/OpenAPI com os endpoints planeados.

#### Arquitetura técnica
A estrutura do projeto está organizada por pastas:
- `config/`
- `controllers/`
- `routes/`
- `middlewares/`
- `models/`
- `utils/`

### 3. Estado atual do projeto
O projeto está numa fase de planeamento e base estrutural.

Já existe:
- documentação de requisitos;
- documentação de arquitetura;
- rascunho OpenAPI;
- esqueleto dos modelos e rotas;
- organização inicial das pastas.

Ainda falta:
- implementar os controladores;
- ligar as rotas ao servidor;
- concluir autenticação JWT;
- testar os endpoints;
- preencher a distribuição final de tarefas do grupo com nomes reais.

### 4. Conclusão
O projeto já cumpre a parte principal de análise e desenho da solução para a loja TTCordes. Neste momento, a base documental está pronta para ser apresentada no Moodle, mesmo que a implementação completa ainda esteja em desenvolvimento.

