const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'TTCordes API',
    version: '1.0.0-sprint1',
    description:
      'Rascunho OpenAPI do Sprint 1 para a API de venda de instrumentos musicais. Endpoints definidos e prontos para implementacao gradual.',
    contact: {
      name: 'Grupo Projeto DWLS'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Autenticacao de utilizadores' },
    { name: 'Instruments', description: 'Catalogo de instrumentos' },
    { name: 'Sales', description: 'Registo de vendas' },
    { name: 'Customers', description: 'Gestao de clientes' },
    { name: 'Seller History', description: 'Historico e stats por vendedor' },
    { name: 'Statistics', description: 'Estatisticas de vendas' }
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registar utilizador',
        responses: {
          201: { description: 'Utilizador registado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autenticar utilizador',
        responses: {
          200: { description: 'Login efetuado com sucesso' },
          401: { description: 'Credenciais invalidas' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Renovar token JWT',
        responses: {
          200: { description: 'Token renovado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },

    '/instruments': {
      get: {
        tags: ['Instruments'],
        summary: 'Listar instrumentos',
        responses: {
          200: {
            description: 'Lista de instrumentos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Instrument' }
                }
              }
            }
          },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      post: {
        tags: ['Instruments'],
        summary: 'Criar instrumento (manager/owner)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InstrumentInput' }
            }
          }
        },
        responses: {
          201: { description: 'Instrumento criado' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - role insuficiente' },
          400: { description: 'Bad Request' }
        }
      }
    },
    '/instruments/{id}': {
      get: {
        tags: ['Instruments'],
        summary: 'Obter instrumento por ID',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: {
            description: 'Instrumento encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Instrument' }
              }
            }
          },
          404: { description: 'Instrumento nao encontrado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      patch: {
        tags: ['Instruments'],
        summary: 'Atualizar instrumento (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InstrumentInput' }
            }
          }
        },
        responses: {
          200: { description: 'Instrumento atualizado' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - role insuficiente' },
          400: { description: 'Bad Request' }
        }
      },
      delete: {
        tags: ['Instruments'],
        summary: 'Remover instrumento (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          204: { description: 'Instrumento removido' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - role insuficiente' }
        }
      }
    },

    '/sales': {
      get: {
        tags: ['Sales'],
        summary: 'Listar vendas',
        responses: {
          200: {
            description: 'Lista de vendas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Sale' }
                }
              }
            }
          },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      post: {
        tags: ['Sales'],
        summary: 'Criar venda (autenticado)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SaleInput' }
            }
          }
        },
        responses: {
          201: { description: 'Venda criada' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/sales/{id}': {
      get: {
        tags: ['Sales'],
        summary: 'Obter venda por ID',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: {
            description: 'Venda encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Sale' }
              }
            }
          },
          404: { description: 'Venda nao encontrada' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      patch: {
        tags: ['Sales'],
        summary: 'Atualizar venda (autenticado)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SaleInput' }
            }
          }
        },
        responses: {
          200: { description: 'Venda atualizada' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Sales'],
        summary: 'Remover venda (autenticado)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          204: { description: 'Venda removida' },
          401: { description: 'Unauthorized' }
        }
      }
    },

    '/customers': {
      get: {
        tags: ['Customers'],
        summary: 'Listar clientes',
        responses: {
          200: {
            description: 'Lista de clientes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Customer' }
                }
              }
            }
          },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      post: {
        tags: ['Customers'],
        summary: 'Criar cliente (autenticado)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CustomerInput' }
            }
          }
        },
        responses: {
          201: { description: 'Cliente criado' },
          400: { description: 'Bad Request' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/customers/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'Obter cliente por ID',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: {
            description: 'Cliente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Customer' }
              }
            }
          },
          404: { description: 'Cliente nao encontrado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      patch: {
        tags: ['Customers'],
        summary: 'Atualizar cliente',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Cliente atualizado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      },
      delete: {
        tags: ['Customers'],
        summary: 'Remover cliente',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          204: { description: 'Cliente removido' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },

    '/sellers/{id}/history': {
      get: {
        tags: ['Seller History'],
        summary: 'Historico de vendas por vendedor',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Historico retornado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },
    '/sellers/{id}/stats': {
      get: {
        tags: ['Seller History'],
        summary: 'Indicadores de desempenho de vendedor',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Estatisticas do vendedor' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },

    '/statistics/total-sales': {
      get: {
        tags: ['Statistics'],
        summary: 'Total de vendas',
        responses: {
          200: { description: 'Total de vendas retornado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },
    '/statistics/top-instruments': {
      get: {
        tags: ['Statistics'],
        summary: 'Top instrumentos mais vendidos',
        responses: {
          200: { description: 'Ranking retornado' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },
    '/statistics/revenue-per-instrument': {
      get: {
        tags: ['Statistics'],
        summary: 'Receita por instrumento',
        responses: {
          200: { description: 'Receita por instrumento retornada' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    },
    '/statistics/seller-streaks': {
      get: {
        tags: ['Statistics'],
        summary: 'Sequencia de dias com vendas por vendedor',
        responses: {
          200: { description: 'Streaks retornados' },
          501: { $ref: '#/components/responses/NotImplemented' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    parameters: {
      id: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'ID do recurso'
      }
    },
    responses: {
      NotImplemented: {
        description: 'Endpoint planeado no Sprint 1, ainda nao implementado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' }
          }
        }
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['seller', 'manager'] }
        }
      },
      Instrument: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          active: { type: 'boolean' }
        }
      },
      InstrumentInput: {
        type: 'object',
        required: ['name','category','price'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          active: { type: 'boolean' }
        }
      },
      Sale: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          seller_id: { type: 'string' },
          instrument_id: { type: 'string' },
          customer_id: { type: 'string' },
          saleDate: { type: 'string', format: 'date-time' },
          quantity: { type: 'number' },
          unitPrice: { type: 'number' },
          totalAmount: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] }
        }
      },
      SaleInput: {
        type: 'object',
        required: ['seller_id','instrument_id','customer_id','quantity','unitPrice'],
        properties: {
          seller_id: { type: 'string' },
          instrument_id: { type: 'string' },
          customer_id: { type: 'string' },
          quantity: { type: 'number' },
          unitPrice: { type: 'number' },
          status: { type: 'string', enum: ['pending','completed','cancelled'] },
          notes: { type: 'string' }
        }
      },
      Customer: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      CustomerInput: {
        type: 'object',
        required: ['name','email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'NOT_IMPLEMENTED' },
          message: { type: 'string' }
        }
      }
    }
  }
};

module.exports = openApiSpec;
