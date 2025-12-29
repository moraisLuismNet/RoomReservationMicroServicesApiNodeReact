import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from "dotenv";
import { Reservation } from "../models/Reservation";
import { ReservationStatus } from "../models/ReservationStatus";

// Load environment variables
dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "reservations-db",
  synchronize: true,
  logging: true,
  entities: [Reservation, ReservationStatus],
  migrations: [path.join(__dirname, "..", "migrations", "*.{ts,js}")],
});

export { AppDataSource };
