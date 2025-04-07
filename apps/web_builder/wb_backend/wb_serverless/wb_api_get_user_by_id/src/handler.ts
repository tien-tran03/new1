import { APIGatewayProxyHandler } from "aws-lambda";
import { UserEntity } from "@kis/wb-data/dist/entities";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const getUserById: APIGatewayProxyHandler = async (event) => {

  try {
    const { appDataSource } = await verifyUserAndInitializeDB(event);

    const userId = event.pathParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User ID is required" }),
      };
    }

    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid User ID" }),
      };
    }

    const user = await appDataSource.manager.findOne(UserEntity, {
      where: { id: userIdNumber },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: user.id,
        username: user.username,
        message: "User details retrieved successfully",
      }),
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not retrieve user information",
      }),
    };
  }
};
