import redisClient from './utils/redis'; // Assuming this is where your RedisClient class is defined

// Checking if Redis client is alive
console.log(redisClient.isAlive()); // Should log true or false

// Setting a value in Redis
redisClient.set('myKey', 'myValue', 3600); // Set 'myKey' with value 'myValue' and expiration 1 hour (3600 seconds)

// Getting a value from Redis
redisClient.get('myKey').then((result) => {
  console.log(result); // Logs the value stored at 'myKey'
});
