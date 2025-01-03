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
}

const config: ApplicationConfig = {
    applicationName: "Budget tracker",
    deploymentEnv: (process.env.DEPLOYMENT_ENV || "development") as DeploymentEnvironment,
};

export default config;