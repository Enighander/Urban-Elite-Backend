const cron = require("node-cron");
const { resetMonthlySold } = require("../../controller/product");

cron.schedule('0 0 1 * *', resetMonthlySold)

