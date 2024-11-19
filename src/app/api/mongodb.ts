import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ESG";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient | null>;

try {
    if (!client) {
        client = new MongoClient(uri);
        clientPromise = client.connect().then(() => client as MongoClient);
    } else {
        clientPromise = Promise.resolve(client);
    }
} catch (error) {
    clientPromise = Promise.resolve(null)
    console.log(error);
}

export async function getCollection<T extends Document>(collection: string) {
    const client = await clientPromise;
    if (client === null) return NextResponse.json({ message: "Connection error to DB" }, { status: 502 });
    const database = client.db("ESG");
    return database.collection<T>(collection);
}