import multer from "multer";
import * as XLSX from "xlsx";
import {
  createDailyCallPlanTable,
  insertCallPlanRow,
  getAllCallPlanRows,
} from "../models/opencall.models.js";

// ── Multer: store files in memory ──
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware: accept 2 files — flexWip & callPlan
export const uploadFiles = upload.fields([
  { name: "flexWip", maxCount: 1 },
  { name: "callPlan", maxCount: 1 },
]);

// ── Parse Excel buffer → array of objects ──
function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

// ── Upload & Process ──
export const processUpload = async (req, res) => {
  try {
    const flexWipFile = req.files?.flexWip?.[0];
    const callPlanFile = req.files?.callPlan?.[0];

    if (!flexWipFile || !callPlanFile) {
      return res.status(400).json({
        success: false,
        message: "Both Flex WIP and Call Plan files are required.",
      });
    }

    // Ensure table exists
    await createDailyCallPlanTable();

    const flexData = parseExcel(flexWipFile.buffer);
    const callPlanData = parseExcel(callPlanFile.buffer);

    const results = { inserted: 0, errors: [] };

    // Process Call Plan rows
    for (let i = 0; i < callPlanData.length; i++) {
      try {
        const raw = callPlanData[i];
        const row = {
          serialNo: raw["S.No"] || raw["Serial No"] || raw["serialNo"] || i + 1,
          ticketId: raw["Ticket ID"] || raw["ticketId"] || "",
          caseId: raw["Case ID"] || raw["caseId"] || "",
          caseCreatedTime: raw["Case Created Time"] || raw["caseCreatedTime"] || null,
          wipAging: raw["WIP Aging"] || raw["wipAging"] || null,
          rtplStatus: raw["RTPL Status"] || raw["rtplStatus"] || "",
          segment: raw["Segment"] || raw["segment"] || "",
          engineer: raw["Engineer"] || raw["engineer"] || null,
          product: raw["Product"] || raw["product"] || null,
          flexStatus: raw["Flex Status"] || raw["flexStatus"] || null,
          hpOwnerStatus: raw["HP Owner Status"] || raw["hpOwnerStatus"] || null,
          woOtcCode: raw["WO OTC Code"] || raw["woOtcCode"] || null,
          accountName: raw["Account Name"] || raw["accountName"] || null,
          customerName: raw["Customer Name"] || raw["customerName"] || null,
          location: raw["Location"] || raw["location"] || null,
          contact: raw["Contact"] || raw["contact"] || null,
          part: raw["Part"] || raw["part"] || null,
          wipAgingCategory: raw["WIP Aging Category"] || raw["wipAgingCategory"] || null,
          tat: raw["TAT"] || raw["tat"] || null,
          customerMail: raw["Customer Mail"] || raw["customerMail"] || null,
          rca: raw["RCA"] || raw["rca"] || null,
          uploadSource: "CALL_PLAN",
        };

        await insertCallPlanRow(row);
        results.inserted++;
      } catch (err) {
        results.errors.push({ row: i + 1, error: err.message });
      }
    }

    // Process Flex WIP rows
    for (let i = 0; i < flexData.length; i++) {
      try {
        const raw = flexData[i];
        const row = {
          serialNo: raw["S.No"] || raw["Serial No"] || raw["serialNo"] || i + 1,
          ticketId: raw["Ticket ID"] || raw["ticketId"] || "",
          caseId: raw["Case ID"] || raw["caseId"] || "",
          caseCreatedTime: raw["Case Created Time"] || raw["caseCreatedTime"] || null,
          wipAging: raw["WIP Aging"] || raw["wipAging"] || null,
          rtplStatus: raw["RTPL Status"] || raw["rtplStatus"] || "",
          segment: raw["Segment"] || raw["segment"] || "",
          engineer: raw["Engineer"] || raw["engineer"] || null,
          product: raw["Product"] || raw["product"] || null,
          flexStatus: raw["Flex Status"] || raw["flexStatus"] || null,
          hpOwnerStatus: raw["HP Owner Status"] || raw["hpOwnerStatus"] || null,
          woOtcCode: raw["WO OTC Code"] || raw["woOtcCode"] || null,
          accountName: raw["Account Name"] || raw["accountName"] || null,
          customerName: raw["Customer Name"] || raw["customerName"] || null,
          location: raw["Location"] || raw["location"] || null,
          contact: raw["Contact"] || raw["contact"] || null,
          part: raw["Part"] || raw["part"] || null,
          wipAgingCategory: raw["WIP Aging Category"] || raw["wipAgingCategory"] || null,
          tat: raw["TAT"] || raw["tat"] || null,
          customerMail: raw["Customer Mail"] || raw["customerMail"] || null,
          rca: raw["RCA"] || raw["rca"] || null,
          uploadSource: "FLEX_WIP",
        };

        await insertCallPlanRow(row);
        results.inserted++;
      } catch (err) {
        results.errors.push({ row: i + 1, error: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Uploaded successfully. ${results.inserted} rows inserted.`,
      flexWipRows: flexData.length,
      callPlanRows: callPlanData.length,
      totalInserted: results.inserted,
      errors: results.errors,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── Get All Rows ──
export const getCallPlanData = async (req, res) => {
  try {
    const rows = await getAllCallPlanRows();
    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
