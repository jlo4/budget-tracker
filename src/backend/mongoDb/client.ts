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

export {
    getClient
}
