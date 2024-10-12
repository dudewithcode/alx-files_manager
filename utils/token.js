import { v4 as uuidv4 } from 'uuid';
import redisClient from './redis';

class Token {
  static createToken() {
    const uuid = uuidv4();
    return uuid;
  }

  static async saveToken(user, token, duration) {
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), duration);
  }

  static async retrieveUser(token) {
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    return userId;
  }

  static async delToken(token) {
    const key = `auth_${token}`;
    await redisClient.del(key);
  }
}
module.exports = Token;
