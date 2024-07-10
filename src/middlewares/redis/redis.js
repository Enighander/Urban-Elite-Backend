const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379 
});

// Handle connection events
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

// Connect to Redis server
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Error connecting to Redis: ', err);
  }
})();

module.exports = redisClient;