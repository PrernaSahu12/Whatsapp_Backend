const Redis = require("ioredis");

const cacheClient = new Redis(process.env.REDIS_URL, {
  lazyConnect: true,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

cacheClient.on("connect", () => console.log("ioredis connected successfully"));
cacheClient.on("error", (err) => console.error("Redis error:", err.message));

module.exports = cacheClient;
