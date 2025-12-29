import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./config/database";
import reservationRoutes from "./routes/reservation.routes";
import reservationStatusRoutes from "./routes/reservation-status.routes";
import {
  ReservationStatus,
  ReservationStatusName,
} from "./models/ReservationStatus";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = process.env.PORT || 7009;

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
      title: "ReservationsMicroService",
      version: "1.0.0",
      description: "API for managing reservations and reservation statuses",
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
app.use("/api/reservations", reservationRoutes);
app.use("/api/reservation-statuses", reservationStatusRoutes);

// Database initialization and Seeding
const seedStatuses = async () => {
  const statusRepo = AppDataSource.getRepository(ReservationStatus);
  const statuses = [
    { id: 1, name: ReservationStatusName.PENDING },
    { id: 2, name: ReservationStatusName.CONFIRMED },
    { id: 3, name: ReservationStatusName.CHECKED_IN },
    { id: 4, name: ReservationStatusName.CHECKED_OUT },
    { id: 5, name: ReservationStatusName.CANCELLED },
    { id: 6, name: ReservationStatusName.PAID },
  ];

  for (const s of statuses) {
    const existing = await statusRepo.findOne({ where: { id: s.id } });
    if (!existing) {
      await statusRepo.save(statusRepo.create(s));
      logger.info(`Seeded status: ${s.name}`);
    }
  }
};

AppDataSource.initialize()
  .then(async () => {
    logger.info("Database connected successfully");
    await seedStatuses();
    app.listen(Number(PORT), "0.0.0.0", () => {
      logger.info(`ReservationsMicroService running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
  });
