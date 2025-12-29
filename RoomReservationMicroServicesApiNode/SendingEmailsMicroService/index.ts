import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./config/database";
import emailRoutes from "./routes/email.routes";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = process.env.PORT || 7011;

app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev server
      "http://localhost:3001", // Alternative React port
      "http://localhost:8080", // Vue.js dev server
      "http://localhost:4200", // Angular dev server
      "http://localhost:5173", // Vite dev server
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:4200",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "X-Access-Token",
    ],
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(helmet());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SendingEmailsMicroService",
      version: "1.0.0",
      description: "API for sending reservation emails",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
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
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/emails", emailRoutes);

// Database initialization
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(Number(PORT), "0.0.0.0", () => {
      logger.info(`SendingEmailsMicroService running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
  });
