import express from "express";
import cors from "cors";
import "./db/db.js";
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

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
