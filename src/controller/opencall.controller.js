// src/controllers/dailyCallPlan.controller.js
import { AppDataSource } from "../config/data-source.js";

export const createDailyCallPlan = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("DailyCallPlan");
    const data = repo.create(req.body);
    const result = await repo.save(data);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllDailyCallPlans = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("DailyCallPlan");
    const data = await repo.find();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
