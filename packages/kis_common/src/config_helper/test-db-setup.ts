import { DataSource } from "typeorm";
import { getAppDataSource } from "@kis/wb-data/dist/app-data-source";
import { loadEnvConfig } from "../utils";
import { getConnectionOptionsTest } from "./get-connection-options-test";

loadEnvConfig();

let appDataSourceTest: DataSource;

export const setupTestDB = async () => {

  try {
    appDataSourceTest = getAppDataSource(getConnectionOptionsTest());
    await appDataSourceTest.initialize();
    console.log("✅ Test database connected successfully");
  } catch (error) {
    console.error("❌ Test database connection failed", error);
    process.exit(1); // Exit if DB fails
  }
};

export const resetTestDB = async () => {
  if (appDataSourceTest && appDataSourceTest.isInitialized) {
    await appDataSourceTest.synchronize(true); // Reset database before each test
  }
};

export const closeTestDB = async () => {
  if (appDataSourceTest && appDataSourceTest.isInitialized) {
    await appDataSourceTest.destroy();
  }
};

export const getTestDB = () => appDataSourceTest;