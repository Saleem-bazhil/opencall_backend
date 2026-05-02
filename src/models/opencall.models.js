// src/entity/DailyCallPlan.js
import { EntitySchema } from "typeorm";

export const DailyCallPlan = new EntitySchema({
  name: "DailyCallPlan",
  tableName: "daily_call_plan",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    serialNo: {
      type: "int",
    },
    ticketId: {
      type: "varchar",
      length: 100,
    },
    caseId: {
      type: "varchar",
      length: 100,
    },
    caseCreatedTime: {
      type: "timestamp",
      nullable: true,
    },
    wipAging: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    rtplStatus: {
      type: "varchar",
      length: 100,
    },
    segment: {
      type: "enum",
      enum: ["PC", "Print", "Install", ""],
      default: "",
    },
    engineer: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    product: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    flexStatus: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    hpOwnerStatus: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    woOtcCode: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    accountName: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    customerName: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    location: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    contact: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    part: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    wipAgingCategory: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    tat: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    customerMail: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    rca: {
      type: "text",
      nullable: true,
    },
    uploadSource: {
      type: "enum",
      enum: ["FIELDEZ", "WIP_REPORT", "CALL_PLAN"],
      default: "CALL_PLAN",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
});