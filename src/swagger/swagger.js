const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Parking System',
      version: '1.0.0',
      description: 'API de reserva de espacios de estacionamiento',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsDoc(options);
