import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'reskilled backend',
      version: '1.0.0',
      description: 'API documentation for the reskilled backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // security: [{ bearerAuth: [] }],
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
  },
  apis: ['dist/src/modules/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
