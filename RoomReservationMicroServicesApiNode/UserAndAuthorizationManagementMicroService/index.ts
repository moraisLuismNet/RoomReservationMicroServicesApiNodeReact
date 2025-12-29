import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { User, UserRole } from "./models/User";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = process.env.PORT || 7007;

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev server
      "http://localhost:3001", // Alternative React port
      "http://localhost:8080", // Vue.js dev server
      "http://localhost:4200", // Angular dev server
      "http://localhost:4201", // Alternative Angular/Vite port
      "http://localhost:5173", // Vite dev server
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:4200",
      "http://127.0.0.1:4201",
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
      title: "UserAndAuthorizationManagementMicroService",
      version: "1.0.0",
      description: "API for managing users and authentication",
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
  apis: ["./routes/*.ts", "./dtos/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Database initialization
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(Number(PORT), "0.0.0.0", async () => {
      logger.info(
        `UserAndAuthorizationManagementMicroService running on port ${PORT}`
      );

      // Seeding admin user
      try {
        logger.info("Starting admin seeding process...");
        const userRepository = AppDataSource.getRepository(User);
        logger.info("Checking if admin exists...");
        const existingAdmin = await userRepository.findOne({
          where: { email: "luis@mail.com" },
        });

        if (!existingAdmin) {
          logger.info("Seeding admin user...");
          const admin = new User();
          admin.email = "luis@mail.com";
          admin.name = "Luis Admin";
          logger.info("Hashing password for new admin...");
          admin.passwordHash = bcrypt.hashSync("123456", 10);
          admin.role = UserRole.ADMIN;
          logger.info("Saving new admin...");
          await userRepository.save(admin);
          logger.info("Admin user created.");
        } else {
          logger.info("Admin user already exists. Updating password hash...");
          logger.info("Hashing password for update...");
          existingAdmin.passwordHash = bcrypt.hashSync("123456", 10);
          logger.info("Saving updated admin...");
          await userRepository.save(existingAdmin);
          logger.info("Admin user password updated.");
        }
        logger.info("Admin seeding process completed successfully.");
      } catch (error) {
        logger.error("Error seeding admin user:", error);
      }
    });
  })
  .catch((error) => {
    logger.error("Database connection error in UserAuth:", error);
    process.exit(1);
  });
