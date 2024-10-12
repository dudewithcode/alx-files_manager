import dbClient from './db';
import Password from './hash_password';

class UsersCollection {
  static async getUser(query) {
    const coll = dbClient.getCollection('users');
    const user = await coll.findOne(query);
    return user;
  }

  static async createUser(email, password) {
    const newUser = { email, password: Password.hashPassword(password) };
    const result = await dbClient.getCollection('users').insertOne(newUser);
    return result.insertedId;
  }
}

module.exports = UsersCollection;
