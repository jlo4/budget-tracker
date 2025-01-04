"use server";

import config from "@/config";
import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

const getClient = async (): Promise<MongoClient> => {
    if (!client) {
        client = new MongoClient(config.mongoDbUri);
        await client.connect();
    }
    return client;
};

const getCollection = async (collection: string) => {
    try {
        const client = await getClient();
        return client.db(config.mongoDbName).collection(collection);
    } catch (error: Error | unknown) {
        console.error("MongoDB error: ", error);
    }
};

export {
    getClient,
    getCollection,
}
