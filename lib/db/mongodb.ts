import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medlens';
const options = {
  connectTimeoutMS: 1000,
  serverSelectionTimeoutMS: 1000,
};

let client: MongoClient | null = null;
let isConnected = false;

export async function getMongoClient(): Promise<MongoClient | null> {
  if (isConnected && client) {
    return client;
  }

  try {
    client = new MongoClient(uri, options);
    await client.connect();
    // Test connectivity
    await client.db().command({ ping: 1 });
    isConnected = true;
    return client;
  } catch {
    isConnected = false;
    client = null;
    return null;
  }
}
