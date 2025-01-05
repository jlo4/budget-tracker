import dotenv from "dotenv";
dotenv.config();

enum DeploymentEnvironment {
    development = "development",
    staging = "staging",
    production = "production",
}

interface ApplicationConfig {
    applicationName: string;
    azureFormRecognizerEndpoint: string;
    azureFormRecognizerKey: string;
    deploymentEnv: DeploymentEnvironment;
    mongoDbName: string;
    mongoDbUri: string;
}

const config: ApplicationConfig = {
    applicationName: "Budget tracker",
    azureFormRecognizerEndpoint: process.env.AZURE_FORM_RECOGNIZER_ENDPOINT || "",
    azureFormRecognizerKey: process.env.AZURE_FORM_RECOGNIZER_API_KEY || "",
    deploymentEnv: (process.env.DEPLOYMENT_ENV || "development") as DeploymentEnvironment,
    mongoDbName: process.env.MONGODB_DB_NAME || "",
    mongoDbUri: process.env.MONGODB_URI || "",
};

export default config;