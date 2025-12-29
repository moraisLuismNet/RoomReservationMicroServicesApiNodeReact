import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./config/database";
import roomRoutes from "./routes/room.routes";
import roomTypeRoutes from "./routes/room-type.routes";
import { Room } from "./models/Room";
import { RoomType } from "./models/RoomType";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const PORT = process.env.PORT || 7008;

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
      title: "RoomMicroService",
      version: "1.0.0",
      description: "API for managing rooms and room types",
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
app.use("/api/rooms", roomRoutes);
app.use("/api/room-types", roomTypeRoutes);

// Database initialization
AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected successfully");
    app.listen(Number(PORT), "0.0.0.0", async () => {
      logger.info(`RoomMicroService running on port ${PORT}`);

      // Seeding room types and rooms
      try {
        const roomTypeRepository = AppDataSource.getRepository(RoomType);
        const roomRepository = AppDataSource.getRepository(Room);

        // Seed Room Types
        const roomTypesData = [
          {
            name: "Single",
            pricePerNight: 50,
            capacity: 1,
            description: "A comfortable single room",
          },
          {
            name: "Double",
            pricePerNight: 80,
            capacity: 2,
            description: "A spacious double room",
          },
          {
            name: "Suite",
            pricePerNight: 150,
            capacity: 4,
            description: "A luxurious suite",
          },
        ];

        for (const rt of roomTypesData) {
          const exists = await roomTypeRepository.findOneBy({ name: rt.name });
          if (!exists) {
            logger.info(`Seeding room type: ${rt.name}...`);
            await roomTypeRepository.save(roomTypeRepository.create(rt));
          }
        }

        // Seed Rooms
        const roomsData = [
          {
            roomNumber: "101",
            roomTypeName: "Single",
            isActive: true,
            imageRoom: "https://i.imgur.com/5fNR0ZC.png",
          },
          {
            roomNumber: "102",
            roomTypeName: "Single",
            isActive: true,
            imageRoom: "https://imgur.com/VOdqZx6.png",
          },
          {
            roomNumber: "103",
            roomTypeName: "Double",
            isActive: true,
            imageRoom: "https://i.imgur.com/ndxB3cM.png",
          },
        ];

        for (const r of roomsData) {
          const exists = await roomRepository.findOneBy({
            roomNumber: r.roomNumber,
          });
          if (!exists) {
            const roomType = await roomTypeRepository.findOneBy({
              name: r.roomTypeName,
            });
            if (roomType) {
              logger.info(`Seeding room: ${r.roomNumber}...`);
              await roomRepository.save(
                roomRepository.create({
                  roomNumber: r.roomNumber,
                  roomTypeId: roomType.id,
                  isActive: r.isActive,
                  imageRoom: r.imageRoom,
                })
              );
            }
          }
        }
      } catch (error) {
        logger.error("Error seeding rooms:", error);
      }
    });
  })
  .catch((error) => {
    logger.error("Database connection error:", error);
  });
