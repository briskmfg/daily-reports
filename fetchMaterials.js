// fetchMaterials.js
const pool = require("./db");
const { format } = require("date-fns");

async function fetchMaterials(date) {
  const formattedDate = format(date, "yyyy-MM-dd"); // Format as 'YYYY-MM-DD'
  const [rows] = await pool.query(
    `SELECT * FROM sales_order_details WHERE status = 'Under Process' AND DATE(so_order_date) = ?`, // Fetch rows with status "Completed"
    [formattedDate]
  );
  return rows;
}

module.exports = fetchMaterials;
