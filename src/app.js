require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const createTables = require('./models/tables');
const pool = require('./config/db');

// routes
const spacesRoutes = require('./routes/spaces');
const paymentRoutes = require('./routes/payment');

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quadra',
      description: 'API para reserva de estacionamientos',
      version: '1.0.0',
      contact: {
        name: 'Soporte Quadra',
        email: 'soporte@quadra.com'
      },
      servers: [{ url: `http://localhost:${process.env.PORT}`, description: 'Servidor local' }]
    },
    components: {
      schemas: {
        Spaces: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            address: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' }
          }
        },
        Reservation: {
          type: 'object',
          properties: {
            space_id: { type: 'integer' },
            user_id: { type: 'integer' },
            vehicle_id: { type: 'integer' },
            start_time: { type: 'string', format: 'date-time' },
            end_time: { type: 'string', format: 'date-time' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            method: { type: 'string' },
            reservation_id: { type: 'integer' }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());

// middlewares
// app.use(cors({
//     origin: 'http://localhost:8080', // pal front
//     credentials: true
//   }));
//   app.use(express.json());

// routes to endpoints 
app.use('/spaces', spacesRoutes);
app.use('/payments', paymentRoutes);

// server
const startServer = async () => {
  await createTables();  // tables
  
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
};

// connection 
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    startServer();
  })
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:', err);
    process.exit(1);
  });
