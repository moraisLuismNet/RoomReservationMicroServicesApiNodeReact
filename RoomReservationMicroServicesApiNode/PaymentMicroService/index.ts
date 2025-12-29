import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import paymentRoutes from "./routes/payment.routes";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Force restart trigger
const PORT = process.env.PORT || 7010;

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

// Regular middleware for all routes except webhook which uses raw body
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PaymentMicroService",
      version: "1.0.0",
      description: "API for handling Stripe payments",
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
app.use("/api/payments", paymentRoutes);

app.listen(Number(PORT), "0.0.0.0", () => {
  logger.info(`PaymentMicroService running on port ${PORT}`);
});
