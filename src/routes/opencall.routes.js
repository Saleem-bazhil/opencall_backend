// src/routes/dailyCallPlan.routes.js
import express from "express";
import {
  createDailyCallPlan,
  getAllDailyCallPlans,
} from "../controllers/dailyCallPlan.controller.js";

const router = express.Router();

router.post("/", createDailyCallPlan);
router.get("/", getAllDailyCallPlans);

export default router;