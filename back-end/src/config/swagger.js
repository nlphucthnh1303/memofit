const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Memofit API Documentation",
      version: "1.0.0",
      description: "Tài liệu API cho dự án Memofit",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  // Đường dẫn đến các file chứa chú thích API (routes)
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
