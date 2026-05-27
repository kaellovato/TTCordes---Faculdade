# TTCordes - Relatorio Sprint 2

## 1. Planeamento geral

O projeto foi dividido em 4 sprints:

1. Sprint 1: analise de requisitos, definicao de endpoints e modelos, rascunho Swagger/OpenAPI, arquitetura tecnica.
2. Sprint 2: autenticacao completa (register/login/refresh), hash de password e validacoes.
3. Sprint 3: implementacao completa de catalogo, vendas e historico.
4. Sprint 4: estatisticas, testes finais, revisao de seguranca e entrega.

Este repositorio encontra-se no Sprint 2.

## 2. Objetivos da Sprint 2

Implementacao completa do sistema de autenticacao e validacoes:

- implementar registo (register) com validacoes de dados;
- implementar login com autenticacao de credenciais;
- implementar refresh de tokens JWT;
- aplicar hash de passwords com bcrypt;
- criar validadores de entrada;
- implementar middleware de autenticacao;
- testar fluxos de autenticacao.

## 3. Trabalho realizado

### 3.1 Autenticacao (Auth)

#### Register (POST /auth/register)
- Validacao de email (formato valido, nao existente);
- Validacao de password (comprimento minimo, complexidade);
- Hash de password com bcrypt;
- Criacao de novo utilizador na base de dados;
- Resposta com mensagem de sucesso ou erro.

#### Login (POST /auth/login)
- Validacao de email e password;
- Autenticacao de credenciais contra base de dados;
- Geracao de tokens JWT (access token e refresh token);
- Armazenamento de refresh token;
- Resposta com tokens e dados do utilizador.

#### Refresh (POST /auth/refresh)
- Validacao do refresh token;
- Geracao de novo access token;
- Resposta com novo access token.

### 3.2 Hash de passwords

- Utilizacao da biblioteca bcrypt;
- Aplicacao de hash na criacao e validacao de passwords;
- Armazenamento seguro de passwords na base de dados.

### 3.3 Validacoes

#### Validadores criados em utils/validators.js:
- validateEmail: validacao de formato de email;
- validatePassword: validacao de password (minimo 8 caracteres, pelo menos 1 maiuscula, 1 minuscula, 1 numero);
- validateRequired: validacao de campos obrigatorios;
- sanitizeInput: limpeza de inputs.

### 3.4 Middlewares de autenticacao

#### authMiddleware.js:
- Verificacao de JWT token no header Authorization;
- Validacao e decodificacao do token;
- Injecao de dados do utilizador no contexto da requisicao;
- Tratamento de erros de autenticacao.

#### roleMiddleware.js:
- Verificacao de permissoes baseada em roles;
- Restricao de acesso a endpoints conforme o papel do utilizador.

### 3.5 Tratamento de erros

#### errorHandler.js:
- Centralizacao de tratamento de erros;
- Mensagens de erro padronizadas;
- Logging de erros;
- Respostas HTTP apropriadas.

## 4. Endpoints implementados

### 4.1 Auth (totalmente implementado)
- POST /auth/register - Registo de novo utilizador
- POST /auth/login - Autenticacao de utilizador
- POST /auth/refresh - Renovacao de token de acesso

## 5. Estrutura de dados

### User Model (implementado)
```
{
  name: String (obrigatorio),
  email: String (obrigatorio, unico),
  password: String (hash bcrypt, obrigatorio),
  role: Enum ['seller', 'manager'] (obrigatorio),
  createdAt: Date (automatico),
  updatedAt: Date (automatico)
}
```

## 6. Configuracoes implementadas

### config/jwt.js:
- Configuracao de secret keys para JWT;
- Definicao de tempos de expiracao dos tokens;
- Metodos de criacao e verificacao de tokens.

### config/database.js:
- Conexao a base de dados MongoDB;
- Configuracoes de conexao e pool.

## 7. Testes realizados

- Fluxo de registo com validacoes;
- Fluxo de login com credenciais validas e invalidas;
- Refresh de token expirado;
- Protecao de endpoints com middleware de autenticacao;
- Validacao de dados de entrada;
- Mensagens de erro apropriadas.

## 8. Estado da entrega do Sprint 2

- Sprint 2 concluido com implementacao completa da autenticacao;
- Sistema de validacoes funcionando corretamente;
- Hash de passwords implementado com seguranca;
- Middlewares de autenticacao e autorizacao operacionais;
- API pronta para a implementacao de catalogo, vendas e historico na Sprint 3.
