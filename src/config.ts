import dotenv from "dotenv";
dotenv.config();

enum DeploymentEnvironment {
    development = "development",
    staging = "staging",
    production = "production",
}

interface ApplicationConfig {
    applicationName: string;
    deploymentEnv: DeploymentEnvironment;
    mongoDbName: string;
    mongoDbUri: string;
}

const config: ApplicationConfig = {
    applicationName: "Budget tracker",
    deploymentEnv: (process.env.DEPLOYMENT_ENV || "development") as DeploymentEnvironment,
    mongoDbName: process.env.MONGODB_DB_NAME || "",
    mongoDbUri: process.env.MONGODB_URI || "",
};

export default config;