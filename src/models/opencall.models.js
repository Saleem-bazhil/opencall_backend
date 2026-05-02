import { pool } from "../db/db.js";

// ── Upload Source Types: "FLEX_WIP" | "RENDERWAYS" | "CALL_PLAN" ──
// ── Daily Call Plan Segments: "PC" | "Print" | "Install" | "" ──

const createDailyCallPlanTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS daily_call_plan (
      id SERIAL PRIMARY KEY,
      serial_no INTEGER NOT NULL,
      ticket_id VARCHAR(100) NOT NULL,
      case_id VARCHAR(100) NOT NULL,
      case_created_time TIMESTAMP,
      wip_aging VARCHAR(100),
      rtpl_status VARCHAR(100) NOT NULL,
      segment VARCHAR(20) NOT NULL CHECK (segment IN ('PC','Print','Install','')),
      engineer VARCHAR(255),
      product VARCHAR(255),
      flex_status VARCHAR(100),
      hp_owner_status VARCHAR(100),
      wo_otc_code VARCHAR(100),
      account_name VARCHAR(255),
      customer_name VARCHAR(255),
      location VARCHAR(255),
      contact VARCHAR(255),
      part VARCHAR(255),
      wip_aging_category VARCHAR(100),
      tat VARCHAR(100),
      customer_mail VARCHAR(255),
      rca TEXT,
      upload_source VARCHAR(20) NOT NULL CHECK (upload_source IN ('FIELDEZ','WIP_REPORT,CALL_PLAN')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("daily_call_plan table created/verified");
};

// ── CRUD Helpers ──

const insertCallPlanRow = async (row) => {
  const query = `
    INSERT INTO daily_call_plan (
      serial_no, ticket_id, case_id, case_created_time, wip_aging,
      rtpl_status, segment, engineer, product, flex_status,
      hp_owner_status, wo_otc_code, account_name, customer_name,
      location, contact, part, wip_aging_category, tat,
      customer_mail, rca, upload_source
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18, $19,
      $20, $21, $22
    ) RETURNING *;
  `;
  const values = [
    row.serialNo,
    row.ticketId,
    row.caseId,
    row.caseCreatedTime || null,
    row.wipAging || null,
    row.rtplStatus,
    row.segment || "",
    row.engineer || null,
    row.product || null,
    row.flexStatus || null,
    row.hpOwnerStatus || null,
    row.woOtcCode || null,
    row.accountName || null,
    row.customerName || null,
    row.location || null,
    row.contact || null,
    row.part || null,
    row.wipAgingCategory || null,
    row.tat || null,
    row.customerMail || null,
    row.rca || null,
    row.uploadSource || "CALL_PLAN",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const bulkInsertCallPlanRows = async (rows) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inserted = [];
    for (const row of rows) {
      const result = await insertCallPlanRow(row);
      inserted.push(result);
    }
    await client.query("COMMIT");
    return inserted;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getAllCallPlanRows = async () => {
  const result = await pool.query(
    "SELECT * FROM daily_call_plan ORDER BY serial_no ASC"
  );
  return result.rows;
};

const getCallPlanRowById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM daily_call_plan WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

const deleteCallPlanRowById = async (id) => {
  const result = await pool.query(
    "DELETE FROM daily_call_plan WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export {
  createDailyCallPlanTable,
  insertCallPlanRow,
  bulkInsertCallPlanRows,
  getAllCallPlanRows,
  getCallPlanRowById,
  deleteCallPlanRowById,
};
