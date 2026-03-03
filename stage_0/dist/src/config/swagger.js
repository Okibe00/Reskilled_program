import swaggerJsdoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'reskilled backend',
            version: '1.0.0',
            description: 'API documentation for the reskilled backend',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['dist/src/modules/**/*.js'], // path to route files
};
const swaggerSpec = swaggerJsdoc(options);
// console.log('Swagger scanning path...');
// console.log(options.apis);
// console.log(JSON.stringify(swaggerSpec.paths, null, 2));
export default swaggerSpec;
