const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
dotenv.config();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PDF Annotation API",
      version: "1.0.0",
      description: "API documentation for PDF Annotation application",
    },
    servers: [
      {
        url: `${process.env.RESOURCE_URL}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
