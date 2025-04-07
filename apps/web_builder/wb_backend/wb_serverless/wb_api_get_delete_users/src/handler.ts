import { APIGatewayProxyHandler } from "aws-lambda";
import { UserEntity, UserRole } from "@kis/wb-data/dist/entities";
import { checkPermission } from "@kis/wb-api-services/dist/check-permission";
import { Not, IsNull } from "typeorm";

export const getDeleteUsers: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource } = await checkPermission(event, [UserRole.ADMIN]);

    const users = await appDataSource.manager.find(UserEntity, {
      where: [
        {deletedAt: Not(IsNull()) },
      ],
    });

    if (users.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No deactivated users found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        users: users.map(user => ({
          id: user.id,
          username: user.username,
          deletedAt: user.deletedAt,
        })),
        message: "Deactivated users retrieved successfully",
      }),
    };
  } catch (error: any) {
    console.error("Error fetching deactivated users:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Could not retrieve deactivated users",
      }),
    };
  }
};
