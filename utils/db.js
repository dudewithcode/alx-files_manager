import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) {
        console.log(err);
      }
      this.db = this.client.db(db);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  getCollection(name) {
    const collection = this.db.collection(name);
    return collection;
  }

  async nbUsers() {
    const collection = this.getCollection('users');
    const count = await collection.countDocuments();
    return count;
  }

  async nbFiles() {
    const files = this.getCollection('files');
    const count = await files.countDocuments();
    return count;
  }
}
const dbClient = new DBClient();
export default dbClient;
