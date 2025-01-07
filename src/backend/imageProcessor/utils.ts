"use server";
import { Transaction } from "@/lib/types/Transaction";
import { getClient } from "./client";
import { DocumentField } from "@azure/ai-form-recognizer";

type DocumentFieldWithValue = DocumentField & {
    value?: string | number | null;
}

const formDataToBuffer = async (formData: FormData): Promise<Buffer | null> => {
    const file = formData.get("file");
    if (!file) {
      throw new Error("No file found in form data.");
    }
    const imageAsString = formData?.get("file")?.toString().split(",")[1];
    if (!imageAsString) {
        throw new Error("No image in form data.");
    }
    const buffer = Buffer.from(imageAsString, "base64");
    return Buffer.from(buffer);
}

const analyzeDocument = async (imageBuffer: Buffer): Promise<{ [field: string]: DocumentField } | null> => {
    const client = await getClient();

    const poller = await client.beginAnalyzeDocument(
        "prebuilt-receipt", // Use the prebuilt receipt model
        imageBuffer
    );

    const pollerResult = await poller.pollUntilDone();
    if (!pollerResult || !pollerResult.documents || pollerResult.documents.length === 0) {
        console.log("No poller result.");
        return null;
    }

    const receiptDocument = pollerResult.documents[0];
    const receipt = receiptDocument.fields;

    if (typeof receipt === "undefined") {
        console.log("No receipt found.");
        return null;
    }

    // TODO: Handle category
    // console.log("Receipt data:", pollerResult.documents[0].docType);

    if (!receipt.Items) {
        console.log("No items found.");
        return null;
    }

    return receipt;
};

const uploadImage = async (formData: FormData): Promise<Partial<Transaction> | null> => {
    try {
      if (!formData) {
        console.log("No form data.");
        return null;
      }
      const imageBuffer = await formDataToBuffer(formData);
      if (!imageBuffer) {
        console.log("No image buffer found.");
        return null;
      }
      
      const receipt = await analyzeDocument(imageBuffer);
      
      return {
        type: "expense",
        payee: (receipt?.MerchantName as DocumentFieldWithValue)?.value?.toString() ?? undefined,
        date: (receipt?.TransactionDate as DocumentFieldWithValue)?.value?.toString() ?? undefined,
        amount: Number((receipt?.Total as DocumentFieldWithValue)?.value) ?? Number((receipt?.SubTotal as DocumentFieldWithValue)?.value) ?? null,
      };
      
    } catch (error) {
      console.error(error);
      return null;
    }
};

  export {
    uploadImage
  }