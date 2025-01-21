const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cors = require('cors');
const {mongooseConnect} = require('./config/mongoConfig');
const urlRoutes = require('./routes/urlRoutes');
const {redisClient} = require('./config/redisConfig');
const dotenv = require('dotenv');

dotenv.config();
mongooseConnect();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Use `serviceAccountConfig` in y

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests. Please try again.',
});
app.use(limiter);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'Custom URL Shortener API',
          version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3010' }],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));




(async () => {
    const { nanoid } = await import('nanoid');



  app.use("/api",require("./routes/urlRoutes"))

  app.listen(3010,()=> console.log("server is running on 3010"))
})();