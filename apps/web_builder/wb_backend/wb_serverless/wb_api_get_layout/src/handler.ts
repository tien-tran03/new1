import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";
import { LayoutEntity } from "@kis/wb-data/dist/entities";

export const getAllLayouts: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);
    
    const layouts = await appDataSource.getRepository(LayoutEntity).find({
    });

    if (!layouts || layouts.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          error: "No layouts found" 
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "List of all layouts",
        layouts: layouts,
        total: layouts.length,
      }),
    };
  } catch (error: any) {
    console.error("Error fetching layouts:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to fetch layout data",
      }),
    };
  }
};