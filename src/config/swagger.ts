
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Item: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the item',
              readOnly: true,
            },
            name: {
              type: 'string',
              description: 'The name of the item',
            },
            description: {
              type: 'string',
              description: 'The description of the item',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the item was created',
              readOnly: true,
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the item was last updated',
              readOnly: true,
            },
          },
          example: {
            id: 1,
            name: 'Sample Item',
            description: 'This is a sample item description.',
            createdAt: '2023-01-01T12:00:00.000Z',
            updatedAt: '2023-01-01T12:30:00.000Z',
          },
        },
        CreateItemDTO: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the item',
            },
            description: {
              type: 'string',
              description: 'The description of the item',
              nullable: true,
            },
          },
          example: {
            name: 'New Item',
            description: 'Description for the new item.',
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;