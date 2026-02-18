const cron = require("node-cron");
const axios = require("axios");

const scheduleCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const PORT = process.env.PORT || 5000;
      const response = await axios.get(`http://localhost:${PORT}/`);
      console.log(`Cron job executed successfully: ${response.data}`);
    } catch (error) {
      console.error("Error in cron job:", error.message);
    }
  });

  console.log("Cron job scheduled to run every 5 minutes.");
};

module.exports = scheduleCronJob;
