const redisClient = require("./redis");

const clearProductCache = async () => {
  try {
    await redisClient.del("allProducts");
  } catch (error) {
    console.error("error clearing cache:", error);
  }
};

module.exports = {
  clearProductCache,
};
