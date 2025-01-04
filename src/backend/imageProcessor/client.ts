"use server";
import config from "@/config";
import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";

// Azure Form Recognizer client
const client = null;

const getClient = async () => {
    if (!client) {
        return new DocumentAnalysisClient(
            config.azureFormRecognizerEndpoint,
            new AzureKeyCredential(config.azureFormRecognizerKey)
          );
    }
    return client;
}

export {
    getClient
}
