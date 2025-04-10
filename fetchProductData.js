// fetchData.js
const pool = require("./db");
const { format } = require("date-fns");

async function fetchProductReport(date) {
  const formattedDate = format(date, "yyyy-MM-dd");
//   const [rows] = await pool.query(
//     `SELECT so.so_order_no, so.so_purchase_order_no, so.so_customer_name, so.so_ship_date, so.so_order_date, so.so_invoice_date, so.so_order_status, so.so_pack_slip_date, so.so_net_amount, m.so_part_no, m.so_part_description, m.so_item_qty, m.so_item_total_amount, m.so_item_sale_price FROM sales_order_master so RIGHT JOIN sales_order_details m ON so.so_order_no = m.so_order_no WHERE DATE(so.so_order_date) = ? OR DATE(so.so_pack_slip_date) = ? OR DATE(so.so_invoice_date) = ?`,
//     [formattedDate, formattedDate, formattedDate]
//   );

    const [rows] = await pool.query(
      `SELECT so.so_order_no, so.so_purchase_order_no, so.so_customer_name, so.so_ship_date, so.so_order_date, so.so_invoice_date, so.so_order_status, so.so_pack_slip_date, so.so_net_amount, m.so_part_no, m.so_part_description, m.so_item_qty, m.so_item_total_amount, m.so_item_sale_price FROM sales_order_master so RIGHT JOIN sales_order_details m ON so.so_order_no = m.so_order_no`
    );

  // Group products by order
  const ordersMap = new Map();
  rows.forEach((row) => {
    const orderKey = row.so_order_no; // Use order_no as the unique key
    if (!ordersMap.has(orderKey)) {
      ordersMap.set(orderKey, {
        so_order_no: row.so_order_no,
        // so_purchase_order_no: row.so_purchase_order_no,
        so_customer_name: row.so_customer_name,
        // so_ship_date: row.so_ship_date,
        // so_order_date: row.so_order_date,
        // so_invoice_date: row.so_invoice_date,
        // so_order_status: row.so_order_status,
        // so_pack_slip_date: row.so_pack_slip_date,
        // so_net_amount: row.so_net_amount,
        so_part_no: row.so_part_no,
        so_part_description: row.so_part_description,
        so_item_qty: row.so_item_qty,
        so_item_total_amount: row.so_item_total_amount,
        so_item_sale_price: row.so_item_sale_price,
      });
    }
  });

  return rows;
}

module.exports = fetchProductReport;
