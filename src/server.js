import express from "express";
import cors from "cors";
import { AppDataSource } from "./db/db.js";
import {
  uploadFiles,
  processUpload,
  getCallPlanData,
} from "./controller/opencall.controller.js";

const app = express();
const port = 3000;

// Explicit CORS — allow all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ── OpenCall Routes ──
app.post("/api/opencall/upload", uploadFiles, processUpload);
app.get("/api/opencall/data", getCallPlanData);

// Start server when database is ready
if (AppDataSource.isInitialized) {
  app.listen(port, () => {
    console.log(`✓ Database connected successfully`);
    console.log(`Server running at http://localhost:${port}`);
  });
} else {
  AppDataSource.initialize()
    .then(() => {
      app.listen(port, () => {
        console.log(`✓ Database connected successfully`);
        console.log(`Server running at http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
      process.exit(1);
    });
}
