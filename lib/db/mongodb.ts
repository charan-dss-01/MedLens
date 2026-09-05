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

  if (process.env.MONGODB_URI) {
    console.log('[MongoDB] MONGODB_URI configured. Connecting to MongoDB database...');
  } else {
    console.warn('[MongoDB] MONGODB_URI environment variable not set. Falling back to local/in-memory store mode.');
  }

  try {
    client = new MongoClient(uri, options);
    await client.connect();
    // Test connectivity
    await client.db().command({ ping: 1 });
    isConnected = true;
    console.log('[MongoDB] Successfully connected to MongoDB database.');
    return client;
  } catch (err: unknown) {
    isConnected = false;
    client = null;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[MongoDB] Could not connect to MongoDB database at ${uri}: ${msg}. Operating in dual in-memory fallback mode.`);
    return null;
  }
}
