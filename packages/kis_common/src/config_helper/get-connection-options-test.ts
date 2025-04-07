import { getEnvConfig } from "../utils";

export function getConnectionOptionsTest() {
    const envConfig = getEnvConfig();
    const connectionOptions = {
      host: envConfig.DB_HOST,
      port: Number(envConfig.DB_PORT_TEST),
      username: envConfig.DB_USER,
      password: envConfig.DB_PASSWORD,
      database: envConfig.DB_NAME,
    };
    return connectionOptions;
  }
