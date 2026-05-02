// src/config/data-source.js
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "open",
  synchronize: true,
  logging: false,
  entities: ["src/models/*.js"],
});

// Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log("✓ Database connected successfully");
  })
  .catch((error) => {
    console.error("✗ Database connection failed:", error);
  });