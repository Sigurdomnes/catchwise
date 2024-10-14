import { MongoClient } from "mongodb";

let uri = process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB;

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
    if (cachedClient) {
        return { client: cachedClient };
    }

    const client = new MongoClient(uri!);
    await client.connect();
    cachedClient = client;

    return { client };
}
