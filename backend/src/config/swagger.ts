import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PharmaStock API',
      version: '1.0.0',
      description: 'Pharmaceutical Warehouse Management System API',
      contact: {
        name: 'PharmaStock Team',
        email: 'support@pharmastock.local',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
      {
        url: '/api/v1',
        description: 'Relative API URL',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for integration endpoints',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'WAREHOUSE_STAFF', 'VIEWER'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Drug: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            drugName: { type: 'string' },
            manufacturer: { type: 'string' },
            composition: { type: 'string' },
            category: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Batch: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            batchNumber: { type: 'string' },
            quantity: { type: 'integer' },
            expiryDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['ACTIVE', 'EXPIRED', 'DISPATCHED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Warehouse: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            location: { type: 'string' },
            capacity: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const specs = swaggerJsdoc(options);
