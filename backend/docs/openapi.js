// ==================== DOCUMENTAÇÃO OPENAPI ====================
// Especificação completa da API TTCordes - Sprint 4
// Inclui: Auth, Instruments, Sales, Customers, Maintenances, Statistics, History

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'TTCordes API',
    version: '4.0.0',
    description:
      'API completa de gestão de loja de instrumentos musicais TTCordes. ' +
      'Inclui autenticação JWT, catálogo de instrumentos, vendas, clientes, ' +
      'fichas de manutenção/reparação e dashboard analítico.',
    contact: {
      name: 'Grupo Projeto DWLS'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desenvolvimento'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Autenticação e gestão de tokens JWT' },
    { name: 'Instruments', description: 'Catálogo de instrumentos musicais' },
    { name: 'Sales', description: 'Registo e gestão de vendas' },
    { name: 'Customers', description: 'Gestão de clientes' },
    { name: 'Maintenances', description: 'Fichas de manutenção e reparação de instrumentos' },
    { name: 'History', description: 'Histórico e estatísticas por vendedor/técnico' },
    { name: 'Statistics', description: 'Dashboard analítico e estatísticas globais' }
  ],
  paths: {

    // ==================== AUTH ====================
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registar novo utilizador',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
              example: {
                username: 'joao_silva',
                email: 'joao@ttcordes.pt',
                password: 'segredo123',
                role: 'seller'
              }
            }
          }
        },
        responses: {
          201: { description: 'Utilizador registado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          409: { description: 'Username ou email já existe' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Autenticar utilizador e obter tokens JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
              example: { email: 'joao@ttcordes.pt', password: 'segredo123' }
            }
          }
        },
        responses: {
          200: { description: 'Login efetuado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          401: { description: 'Credenciais inválidas' },
          400: { $ref: '#/components/responses/BadRequest' }
        }
      }
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Renovar token de acesso com refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } }
            }
          }
        },
        responses: {
          200: { description: 'Token renovado com sucesso' },
          401: { description: 'Refresh token inválido ou expirado' }
        }
      }
    },

    // ==================== INSTRUMENTS ====================
    '/instruments': {
      get: {
        tags: ['Instruments'],
        summary: 'Listar todos os instrumentos',
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filtrar por categoria' },
          { name: 'active', in: 'query', schema: { type: 'boolean' }, description: 'Filtrar por estado ativo' }
        ],
        responses: {
          200: { description: 'Lista de instrumentos retornada com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/InstrumentListResponse' } } } }
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
              schema: { $ref: '#/components/schemas/InstrumentInput' },
              example: { name: 'Fender Stratocaster', category: 'Guitarra Elétrica', price: 899.99, stock: 3, description: 'Guitarra elétrica clássica americana' }
            }
          }
        },
        responses: {
          201: { description: 'Instrumento criado com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/instruments/{id}': {
      get: {
        tags: ['Instruments'],
        summary: 'Obter instrumento por ID',
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Instrumento encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Instrument' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Instruments'],
        summary: 'Substituir instrumento por completo (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InstrumentInput' } } } },
        responses: {
          200: { description: 'Instrumento substituído com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      patch: {
        tags: ['Instruments'],
        summary: 'Atualizar campos de instrumento (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InstrumentInput' } } } },
        responses: {
          200: { description: 'Instrumento atualizado com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Instruments'],
        summary: 'Remover instrumento (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Instrumento removido com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ==================== SALES ====================
    '/sales': {
      get: {
        tags: ['Sales'],
        summary: 'Listar todas as vendas',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'completed', 'cancelled'] }, description: 'Filtrar por estado' }
        ],
        responses: {
          200: { description: 'Lista de vendas retornada com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      },
      post: {
        tags: ['Sales'],
        summary: 'Registar nova venda',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SaleInput' },
              example: { seller_id: '64a1...', instrument_id: '64a2...', customer_id: '64a3...', quantity: 1, unitPrice: 899.99, status: 'completed' }
            }
          }
        },
        responses: {
          201: { description: 'Venda criada com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Vendedor, instrumento ou cliente não encontrado' }
        }
      }
    },
    '/sales/{id}': {
      get: {
        tags: ['Sales'],
        summary: 'Obter venda por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Venda encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Sale' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Sales'],
        summary: 'Substituir venda por completo',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SaleInput' } } } },
        responses: {
          200: { description: 'Venda substituída com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      patch: {
        tags: ['Sales'],
        summary: 'Atualizar campos de venda',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  quantity: { type: 'number' },
                  unitPrice: { type: 'number' },
                  notes: { type: 'string' },
                  status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Venda atualizada com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Sales'],
        summary: 'Eliminar venda',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Venda eliminada com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ==================== CUSTOMERS ====================
    '/customers': {
      get: {
        tags: ['Customers'],
        summary: 'Listar todos os clientes',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/page' }, { $ref: '#/components/parameters/limit' }],
        responses: {
          200: { description: 'Lista de clientes retornada com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      },
      post: {
        tags: ['Customers'],
        summary: 'Registar novo cliente',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CustomerInput' },
              example: { name: 'Ana Costa', email: 'ana@email.pt', phone: '912345678', address: 'Rua da Música, 42, Covilhã' }
            }
          }
        },
        responses: {
          201: { description: 'Cliente criado com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          409: { description: 'Email de cliente já existe' }
        }
      }
    },
    '/customers/{id}': {
      get: {
        tags: ['Customers'],
        summary: 'Obter cliente por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Cliente encontrado' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      patch: {
        tags: ['Customers'],
        summary: 'Atualizar dados de cliente',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerInput' } } } },
        responses: {
          200: { description: 'Cliente atualizado com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Customers'],
        summary: 'Eliminar cliente (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Cliente eliminado com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ==================== MAINTENANCES ====================
    '/maintenances': {
      get: {
        tags: ['Maintenances'],
        summary: 'Listar todas as fichas de manutenção',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/page' },
          { $ref: '#/components/parameters/limit' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['agendada', 'em_progresso', 'concluida', 'cancelada'] }, description: 'Filtrar por estado' },
          { name: 'serviceType', in: 'query', schema: { type: 'string' }, description: 'Filtrar por tipo de serviço' },
          { name: 'technician_id', in: 'query', schema: { type: 'string' }, description: 'Filtrar por técnico (ObjectId)' }
        ],
        responses: {
          200: { description: 'Lista de fichas retornada com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/MaintenanceListResponse' } } } },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      },
      post: {
        tags: ['Maintenances'],
        summary: 'Criar nova ficha de manutenção',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MaintenanceInput' },
              example: {
                technician_id: '64a1...',
                instrument_id: '64a2...',
                customer_id: '64a3...',
                serviceType: 'substituicao_cordas',
                interventionDate: '2026-06-05T10:00:00.000Z',
                durationMinutes: 30,
                description: 'Troca de cordas D\'Addario EXL110 no Strat do cliente',
                cost: 25.00,
                status: 'concluida'
              }
            }
          }
        },
        responses: {
          201: { description: 'Ficha de manutenção criada com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/Maintenance' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { description: 'Técnico, instrumento ou cliente não encontrado' }
        }
      }
    },
    '/maintenances/service-types': {
      get: {
        tags: ['Maintenances'],
        summary: 'Listar tipos de serviço disponíveis',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de tipos de serviço', content: { 'application/json': { example: { success: true, data: { serviceTypes: ['afinacao', 'reparacao', 'limpeza', 'substituicao_cordas', 'regulacao_traste', 'revisao_geral', 'setup_eletrico', 'restauro'] } } } } },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/maintenances/{id}': {
      get: {
        tags: ['Maintenances'],
        summary: 'Obter ficha de manutenção por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Ficha encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Maintenance' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Maintenances'],
        summary: 'Substituir ficha de manutenção por completo',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MaintenanceInput' } } } },
        responses: {
          200: { description: 'Ficha substituída com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      patch: {
        tags: ['Maintenances'],
        summary: 'Atualizar campos de ficha de manutenção',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  serviceType: { type: 'string', enum: ['afinacao', 'reparacao', 'limpeza', 'substituicao_cordas', 'regulacao_traste', 'revisao_geral', 'setup_eletrico', 'restauro'] },
                  interventionDate: { type: 'string', format: 'date-time' },
                  durationMinutes: { type: 'number', minimum: 1 },
                  description: { type: 'string' },
                  cost: { type: 'number', minimum: 0 },
                  status: { type: 'string', enum: ['agendada', 'em_progresso', 'concluida', 'cancelada'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Ficha atualizada com sucesso' },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Maintenances'],
        summary: 'Eliminar ficha de manutenção (manager/owner)',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Ficha eliminada com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ==================== HISTORY ====================
    '/sellers/{id}/history': {
      get: {
        tags: ['History'],
        summary: 'Histórico de vendas de um vendedor',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }, { $ref: '#/components/parameters/page' }, { $ref: '#/components/parameters/limit' }],
        responses: {
          200: { description: 'Histórico retornado com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/sellers/{id}/stats': {
      get: {
        tags: ['History'],
        summary: 'Indicadores de desempenho de um vendedor',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Estatísticas do vendedor retornadas' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/sellers/{id}/maintenance-history': {
      get: {
        tags: ['History'],
        summary: 'Histórico de manutenções de um técnico',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }, { $ref: '#/components/parameters/page' }, { $ref: '#/components/parameters/limit' }],
        responses: {
          200: { description: 'Histórico de manutenções retornado com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/sellers/{id}/maintenance-stats': {
      get: {
        tags: ['History'],
        summary: 'Indicadores de desempenho de um técnico',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/id' }],
        responses: {
          200: { description: 'Estatísticas do técnico retornadas' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ==================== STATISTICS ====================
    '/statistics/dashboard': {
      get: {
        tags: ['Statistics'],
        summary: 'Resumo geral do dashboard TTCordes',
        description: 'Retorna todos os indicadores principais numa única chamada: totais de vendas e manutenções, receita, top instrumentos e serviços.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard retornado com sucesso', content: { 'application/json': { schema: { $ref: '#/components/schemas/DashboardResponse' } } } },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/total-sales': {
      get: {
        tags: ['Statistics'],
        summary: 'Total de vendas realizadas',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'completed', 'cancelled'] } }],
        responses: {
          200: { description: 'Totais de vendas retornados com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/top-instruments': {
      get: {
        tags: ['Statistics'],
        summary: 'Ranking dos instrumentos mais vendidos',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 5 }, description: 'Número máximo de resultados' }],
        responses: {
          200: { description: 'Ranking de instrumentos retornado com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/revenue-per-instrument': {
      get: {
        tags: ['Statistics'],
        summary: 'Receita gerada por cada instrumento',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Receita por instrumento retornada com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/seller-streaks': {
      get: {
        tags: ['Statistics'],
        summary: 'Dias consecutivos com vendas por vendedor (streak)',
        description: 'Calcula o streak atual e máximo de dias seguidos com pelo menos uma venda completada para cada vendedor.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Streaks de vendedores retornados com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/total-maintenances': {
      get: {
        tags: ['Statistics'],
        summary: 'Total de intervenções de manutenção realizadas',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'status', in: 'query', schema: { type: 'string', enum: ['agendada', 'em_progresso', 'concluida', 'cancelada'] } }],
        responses: {
          200: { description: 'Totais de manutenções retornados com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/time-per-service': {
      get: {
        tags: ['Statistics'],
        summary: 'Tempo total investido por tipo de serviço de manutenção',
        description: 'Agrega o tempo total (em minutos e horas) de todas as intervenções concluídas, agrupado por tipo de serviço.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Tempo por tipo de serviço retornado com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/top-services': {
      get: {
        tags: ['Statistics'],
        summary: 'Serviços de manutenção mais requisitados',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 5 }, description: 'Número máximo de resultados' }],
        responses: {
          200: { description: 'Top serviços retornados com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/statistics/technician-streaks': {
      get: {
        tags: ['Statistics'],
        summary: 'Dias consecutivos com intervenções por técnico (streak)',
        description: 'Calcula o streak atual e máximo de dias seguidos com pelo menos uma manutenção concluída para cada técnico.',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Streaks de técnicos retornados com sucesso' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    }
  },

  // ==================== COMPONENTS ====================
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido em POST /auth/login. Formato: Bearer <token>'
      }
    },
    parameters: {
      id: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
        description: 'MongoDB ObjectId do recurso'
      },
      page: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 1 },
        description: 'Número da página (paginação)'
      },
      limit: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        description: 'Número de itens por página'
      }
    },
    responses: {
      BadRequest: {
        description: 'Dados inválidos ou em falta',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
      },
      Unauthorized: {
        description: 'Token de autenticação inválido ou em falta',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
      },
      Forbidden: {
        description: 'Sem permissões para realizar esta operação',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
      },
      NotFound: {
        description: 'Recurso não encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
      }
    },
    schemas: {
      // ---- AUTH ----
      RegisterInput: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['seller', 'manager', 'owner', 'technician'], default: 'seller' }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              refreshToken: { type: 'string' },
              user: { $ref: '#/components/schemas/User' }
            }
          }
        }
      },

      // ---- USER ----
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['seller', 'manager', 'owner', 'technician'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },

      // ---- INSTRUMENT ----
      Instrument: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          active: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      InstrumentInput: {
        type: 'object',
        required: ['name', 'category', 'price'],
        properties: {
          name: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          category: { type: 'string', minLength: 2 },
          price: { type: 'number', minimum: 0 },
          stock: { type: 'number', minimum: 0, default: 0 },
          active: { type: 'boolean', default: true }
        }
      },
      InstrumentListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              instruments: { type: 'array', items: { $ref: '#/components/schemas/Instrument' } },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        }
      },

      // ---- SALE ----
      Sale: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          seller_id: { $ref: '#/components/schemas/User' },
          instrument_id: { $ref: '#/components/schemas/Instrument' },
          customer_id: { $ref: '#/components/schemas/Customer' },
          saleDate: { type: 'string', format: 'date-time' },
          quantity: { type: 'number' },
          unitPrice: { type: 'number' },
          totalAmount: { type: 'number' },
          notes: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'completed', 'cancelled'] }
        }
      },
      SaleInput: {
        type: 'object',
        required: ['seller_id', 'instrument_id', 'customer_id', 'quantity', 'unitPrice'],
        properties: {
          seller_id: { type: 'string', description: 'ObjectId do vendedor (User)' },
          instrument_id: { type: 'string', description: 'ObjectId do instrumento' },
          customer_id: { type: 'string', description: 'ObjectId do cliente' },
          quantity: { type: 'number', minimum: 1 },
          unitPrice: { type: 'number', minimum: 0 },
          notes: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'completed', 'cancelled'], default: 'completed' }
        }
      },

      // ---- CUSTOMER ----
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
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },

      // ---- MAINTENANCE ----
      Maintenance: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          technician_id: { $ref: '#/components/schemas/User' },
          instrument_id: { $ref: '#/components/schemas/Instrument' },
          customer_id: { $ref: '#/components/schemas/Customer' },
          serviceType: {
            type: 'string',
            enum: ['afinacao', 'reparacao', 'limpeza', 'substituicao_cordas', 'regulacao_traste', 'revisao_geral', 'setup_eletrico', 'restauro']
          },
          interventionDate: { type: 'string', format: 'date-time' },
          durationMinutes: { type: 'number', minimum: 1, description: 'Duração em minutos' },
          description: { type: 'string' },
          cost: { type: 'number', minimum: 0, description: 'Custo em euros' },
          status: { type: 'string', enum: ['agendada', 'em_progresso', 'concluida', 'cancelada'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      MaintenanceInput: {
        type: 'object',
        required: ['technician_id', 'instrument_id', 'customer_id', 'serviceType', 'durationMinutes', 'cost'],
        properties: {
          technician_id: { type: 'string', description: 'ObjectId do técnico (User)' },
          instrument_id: { type: 'string', description: 'ObjectId do instrumento' },
          customer_id: { type: 'string', description: 'ObjectId do cliente' },
          serviceType: {
            type: 'string',
            enum: ['afinacao', 'reparacao', 'limpeza', 'substituicao_cordas', 'regulacao_traste', 'revisao_geral', 'setup_eletrico', 'restauro']
          },
          interventionDate: { type: 'string', format: 'date-time', description: 'Data e hora da intervenção (default: agora)' },
          durationMinutes: { type: 'number', minimum: 1, description: 'Duração em minutos' },
          description: { type: 'string', maxLength: 1000 },
          cost: { type: 'number', minimum: 0, description: 'Custo em euros' },
          status: { type: 'string', enum: ['agendada', 'em_progresso', 'concluida', 'cancelada'], default: 'concluida' }
        }
      },
      MaintenanceListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              maintenances: { type: 'array', items: { $ref: '#/components/schemas/Maintenance' } },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        }
      },

      // ---- STATISTICS ----
      DashboardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              sales: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  totalRevenue: { type: 'number' }
                }
              },
              maintenances: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  totalRevenue: { type: 'number' },
                  totalMinutes: { type: 'number' }
                }
              },
              topInstruments: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, count: { type: 'number' } } } },
              topServices: { type: 'array', items: { type: 'object', properties: { serviceType: { type: 'string' }, count: { type: 'number' } } } }
            }
          }
        }
      },

      // ---- SHARED ----
      Pagination: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
          pages: { type: 'number' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  }
};

module.exports = openApiSpec;
