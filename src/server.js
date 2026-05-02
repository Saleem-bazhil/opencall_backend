import express from "express";
import cors from "cors";
import { AppDataSource } from "./db/db.js";
import {
  uploadFiles,
  processUpload,
  getCallPlanData,
} from "./controller/opencall.controller.js";

const app = express();
const port = 3001;

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
const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`✓ Database connected successfully`);
    console.log(`Server running at http://localhost:${port}`);
  });
  
  // Keep process alive if something is unref-ing it
  setInterval(() => {
    if (!server.listening) console.log("Server stopped listening");
  }, 1000 * 60 * 60); // 1 hour
};

if (AppDataSource.isInitialized) {
  startServer();
} else {
  AppDataSource.initialize()
    .then(() => {
      startServer();
    })
    .catch((error) => {
      console.error("Database connection failed:", error);
      process.exit(1);
    });
}
