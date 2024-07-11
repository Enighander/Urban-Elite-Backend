const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Handle connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

// Connect to Redis server
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis: ", err);
  }
})();

module.exports = redisClient;
