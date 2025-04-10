// fetchData.js
const pool = require("./db");
const { format } = require("date-fns");

async function fetchDailyReport(date) {
  const formattedDate = format(date, "yyyy-MM-dd");
  const [rows] = await pool.query(
    `SELECT so.so_order_no, so.so_purchase_order_no, so.so_customer_name, so.so_ship_date, so.so_order_date, so.so_invoice_date, so.so_order_status, so.so_pack_slip_date, so.so_net_amount, m.so_part_no FROM sales_order_master so LEFT JOIN sales_order_details m ON so.so_order_no = m.so_order_no WHERE (DATE(so.so_order_date) = ? AND so.so_order_status = "Under Process") OR (DATE(so.so_pack_slip_date) = ? AND so.so_order_status = "Packing Slip") OR DATE(so.so_invoice_date) = ?`,
    [formattedDate, formattedDate, formattedDate]
  );

  // const [rows] = await pool.query(
  //   `SELECT so.so_order_no, so.so_purchase_order_no, so.so_customer_name, so.so_ship_date, so.so_order_date, so.so_invoice_date, so.so_order_status, so.so_pack_slip_date, so.so_net_amount, m.so_part_no FROM sales_order_master so LEFT JOIN sales_order_details m ON so.so_order_no = m.so_order_no WHERE DATE(so.so_invoice_date) = ?`,
  //   [formattedDate]
  // );

  // Group products by order
  const ordersMap = new Map();
  rows.forEach((row) => {
    const orderKey = row.so_order_no; // Use order_no as the unique key
    if (!ordersMap.has(orderKey)) {
      ordersMap.set(orderKey, {
        so_order_no: row.so_order_no,
        so_purchase_order_no: row.so_purchase_order_no,
        so_customer_name: row.so_customer_name,
        so_ship_date: row.so_ship_date,
        so_order_date: row.so_order_date,
        so_invoice_date: row.so_invoice_date,
        so_order_status: row.so_order_status,
        so_pack_slip_date: row.so_pack_slip_date,
        so_net_amount: row.so_net_amount,
        products: [], // Array to store products
      });
    }
    if (row.so_part_no) {
      ordersMap.get(orderKey).products.push({
        product_name: row.so_part_no,
        // quantity: row.so_item_qty,
      });
    }
  });

  return Array.from(ordersMap.values()); // Convert Map to array

  //   return rows;
}

module.exports = fetchDailyReport;
