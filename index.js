const fetchDailyReport = require("./fetchData");
const fetchProductReport = require("./fetchProductData");
const fetchMaterials = require("./fetchMaterials");
const exportToCsv = require("./exportToCsv");
const { format, subDays } = require("date-fns");
const sendEmail = require("./sendEmail");
const cron = require("node-cron");
require('dotenv').config();


async function generateDailyReport() {
  try {
    const today = new Date();
    // const yesterday = subDays(today, 1); // Calculate yesterday's date
    // const yesterday = subDays(today, 1);

    // Generate the first CSV file (original query)
    const data = await fetchDailyReport(today);
    if (data.length > 0) {
      const filename = `sales_order_report_${format(today, "yyyy-MM-dd")}.csv`;
      const filePath = `sales_order_report_${format(today, "yyyy-MM-dd")}.csv`;
      await exportToCsv.exportToCsv(data, filePath);
      console.log(`Report generated successfully at ${filePath}`);

      // Send the report via email
      await sendEmail(filePath, filename);
      process.exit(1);
    } else {
      console.log(
        "No data found for yesterday in the first query. Exiting program."
      );
      process.exit(0);
    }

    // Generate the second CSV file (new query for "Completed" status)
    // const materialsData = await fetchMaterials(yesterday);
    // if (materialsData.length > 0) {
    //   const materialsDataPath = `materials_${format(
    //     yesterday,
    //     "yyyy-MM-dd"
    //   )}.csv`;
    //   await exportToCsv(materialsData, materialsDataPath);
    //   console.log(
    //     `Second CSV file written successfully at ${materialsDataPath}`
    //   );
    // } else {
    //   console.log("No data found for yesterday in the second query.");
    // }
  } catch (error) {
    console.error("Error generating reports:", error);
    process.exit(1);
  }
}

async function generateProductReport() {
  try {
    const today = new Date();
    const yesterday = subDays(today, 1);

    // Generate the first CSV file (original query)
    const data = await fetchProductReport(yesterday);
    if (data.length > 0) {
      const filename = `product_report_${format(yesterday, "yyyy-MM-dd")}.csv`;
      const filePath = `product_report_${format(yesterday, "yyyy-MM-dd")}.csv`;
      await exportToCsv.exportProductsToCsv(data, filePath);
      console.log(`Product report generated successfully at ${filePath}`);

      // Send the report via email
      // await sendEmail(filePath, filename);
      process.exit(1);
    } else {
      console.log(
        "No data found for yesterday in the first query. Exiting program."
      );
      process.exit(0);
    }
  } catch (error) {
    console.error("Error generating reports:", error);
    process.exit(1);
  }
}

// generateProductReport();

// generateDailyReport();

// Schedule the task to run every day at 12:00 AM EST
cron.schedule(
  "05 16 * * *",
  () => {
    console.log(
      "Running daily report generation and email sending at 4:05 PM..."
    );
    generateDailyReport();
  },
  {
    timezone: "America/New_York", // Set the timezone to EST
  }
);

console.log("Scheduler started. Waiting for 04:05 PM EST...");
