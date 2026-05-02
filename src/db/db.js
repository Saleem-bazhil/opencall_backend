import "reflect-metadata";
import { DataSource } from "typeorm";
import { DailyCallPlan } from "../models/opencall.models.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "open",
  synchronize: true,
  logging: false,
  entities: [DailyCallPlan],
});