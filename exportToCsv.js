// exportToCsv.js
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs"); // Import the file system module
const { format, subDays } = require("date-fns");

async function exportToCsv(data, filePath) {
  const today = new Date();
  // const yesterday = subDays(today, 1); // Calculate yesterday's date
  const yesterday = subDays(today, 1);
  yesterday.setHours(0, 0, 0, 0);

  console.log("YESTERDAY: " + yesterday);

  // Delete the file if it already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file
    console.log(`Existing file ${filePath} deleted.`);
  }

  // Dynamically generate headers from the keys of the first row
  //   const headers = Object.keys(data[0]).map((key) => ({
  //     id: key,
  //     title: key.toUpperCase(), // Optional: Format header titles
  //   }));

  //   const csvWriter = createCsvWriter({
  //     path: filePath,
  //     header: headers,
  //   });

  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: "so_order_no", title: "Order Number" },
      { id: "so_purchase_order_no", title: "Purchase Order Number" },
      { id: "so_customer_name", title: "Customer Name" },
      { id: "so_order_status", title: "Order Status" },
      { id: "so_pack_slip_date", title: "Packing Slip Date" },
      { id: "so_order_date", title: "Order Date" },
      { id: "so_invoice_date", title: "Invoice Date" },
      { id: "so_ship_date", title: "Ship Date" },
      { id: "so_net_amount", title: "Net Amount" },
      //   { id: "material_count", title: "Material Count" },
      { id: "products", title: "Products" }, // Combined products column
      { id: "totalQty", title: "Total Qty" }, // Combined products column
    ],
  });

  // Flatten the data for CSV
  //   const flattenedData = data.map((order) => ({
  //     ...order,
  //     products: order.products
  //       .map((product) => `${product.product_name} (${product.quantity})`)
  //       .join(", "), // Combine products into a single string
  //   }));

  const flattenedData = data.map((order) => {
    // Count occurrences of each product and calculate total quantity
    let totalQty = 0;
    const productCount = order.products.reduce((acc, product) => {
      acc[product.product_name] = (acc[product.product_name] || 0) + 1;
      totalQty += 1; // Assuming each entry represents 1 quantity
      return acc;
    }, {});

    // Convert to a formatted string
    const formattedProducts = Object.entries(productCount)
      .map(([name, count]) => `${name}-${count}${count > 1 ? "PCS" : "PC"}`)
      .join(", ");

    return {
      ...order,
      products: formattedProducts,
      totalQty: totalQty, // Add total quantity column
    };
  });

  // Write records to CSV
  await csvWriter.writeRecords(flattenedData);

  // Calculate the sum of a specific column (e.g., 'column1')
  const columnToSum = "so_net_amount"; // Replace with the column you want to sum
  const sumPacking = data
    .filter((row) => row.so_order_status === "Packing Slip") // Filter rows with status "Packing"
    .reduce((acc, row) => acc + parseFloat(row[columnToSum] || 0), 0);

  // Calculate the sum of the same column for rows with status "In Process"
  const sumInProcess = data
    .filter((row) => row.so_order_status === "Under Process") // Filter rows with status "In Process"
    .reduce((acc, row) => acc + parseFloat(row[columnToSum] || 0), 0);

  // Calculate the sum of the same column for rows with status "In Process"
  // const sumInvoiced = data
  //   .filter((row) => row.so_order_status === "Invoiced") // Filter rows with status "In Process"
  //   .reduce((acc, row) => acc + parseFloat(row[columnToSum] || 0), 0);

  // Calculate the sum of the same column for rows with status "In Process"
  // const sameDayInvoiced = data
  //   .filter(
  //     (row) =>
  //       row.so_pack_slip_date === row.so_invoice_date &&
  //       row.so_order_status == "Invoiced"
  //   ) // Filter rows with status "In Process"
  //   .reduce((acc, row) => acc + parseFloat(row[columnToSum] || 0), 0);

  // Append the first footer row for "Packing"
  const footerPacking = {
    [columnToSum]: `Total (Packing Slip): $${sumPacking.toFixed(2)}`,
  };
  fs.appendFileSync(filePath, `\n${Object.values(footerPacking).join(",")}`);

  // Append the second footer row for "In Process"
  const footerInProcess = {
    [columnToSum]: `Total (Under Process): $${sumInProcess.toFixed(2)}`,
  };
  fs.appendFileSync(filePath, `\n${Object.values(footerInProcess).join(",")}`);

  // Append the third footer row for "Invoiced"
  // if (sumInvoiced > 0) {
  //   const footerInvoiced = {
  //     [columnToSum]: `Total (Invoiced): $${sumInvoiced.toFixed(2)}`,
  //   };
  //   fs.appendFileSync(filePath, `\n${Object.values(footerInvoiced).join(",")}`);
  // }

  // Append the fourth footer row for "Invoiced"
  // if (sameDayInvoiced > 0) {
  //   const packSlipInvoicedSum = sumPacking + sameDayInvoiced;
  //   const footerSameDayInvoiced = {
  //     [columnToSum]: `Total (Pack Slip + Invoiced): $${packSlipInvoicedSum.toFixed(
  //       2
  //     )}`,
  //   };
  //   fs.appendFileSync(
  //     filePath,
  //     `\n${Object.values(footerSameDayInvoiced).join(",")}`
  //   );
  // }

  // const footerSameDayInvoiced2 = {
  //   [columnToSum]: `Total (Same Day Invoiced): $${sameDayInvoiced.toFixed(2)}`,
  // };

  // fs.appendFileSync(
  //   filePath,
  //   `\n${Object.values(footerSameDayInvoiced2).join(",")}`
  // );

  // Append the footer to the CSV file
  //   fs.appendFileSync(
  //     filePath,
  //     `\n${Object.values(footer).join(",")}` // Add the footer row
  //   );

  console.log(`CSV file written successfully at ${filePath}`);
}

async function exportProductsToCsv(data, filePath) {
  const today = new Date();
  // const yesterday = subDays(today, 1); // Calculate yesterday's date
  const yesterday = subDays(today, 1);
  yesterday.setHours(0, 0, 0, 0);

  console.log("YESTERDAY: " + yesterday);

  // Delete the file if it already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file
    console.log(`Existing file ${filePath} deleted.`);
  }

  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: "so_customer_name", title: "Customer Name" },
      { id: "so_order_date", title: "Order Date" },
      { id: "so_order_no", title: "Order Number" },
      // { id: "so_invoice_date", title: "Invoice Date" },
      // { id: "so_ship_date", title: "Ship Date" },
      // { id: "so_pack_slip_date", title: "Packing Slip Date" },
      // { id: "so_purchase_order_no", title: "Purchase Order Number" },
      // { id: "so_order_status", title: "Order Status" },
      // { id: "so_net_amount", title: "Net Amount" },
      { id: "so_part_no", title: "Product Name" },
      { id: "so_part_description", title: "Product Description" },
      { id: "so_item_qty", title: "Quantity" },
      { id: "so_item_sale_price", title: "Unit Price" },
      { id: "so_item_total_amount", title: "Total Price" },
    ],
  });

  // Write records to CSV
  await csvWriter.writeRecords(data);

  console.log(`CSV file written successfully at ${filePath}`);
}

module.exports = { exportToCsv, exportProductsToCsv };
