import { 
  getConnectionOptions, 
  getEnvConfig, 
  loadEnvConfig, 
  verifyToken 
} from "@kis/common";
import { getAppDataSource } from "@kis/wb-data/dist/app-data-source";
import { JwtPayload } from "jsonwebtoken";

export const verifyUserAndInitializeDB = async (event: any) => {
    
  loadEnvConfig();
  
  const token = (event.headers.Authorization ?? event.headers.authorization)?.split(" ")[1];

  if (!token) {
    console.log("Token not found in header.");
    throw new Error("Token required");
  }

  const decoded = await verifyToken(token, getEnvConfig().JWT_SECRET ?? "") as JwtPayload;

  if (!decoded || !decoded.userId) {
    console.log("Invalid token.");
    throw new Error("Invalid token");
  }

  const appDataSource = getAppDataSource(getConnectionOptions());
  if (!appDataSource.isInitialized) {
    console.log("Initializing data source...");
    await appDataSource.initialize();
    console.log("Connected to MySQL successfully.");
  }

  return { decoded, appDataSource };
};