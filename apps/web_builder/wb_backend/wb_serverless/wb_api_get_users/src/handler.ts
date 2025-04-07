import { APIGatewayProxyHandler } from "aws-lambda";
import { UserEntity, UserRole } from "@kis/wb-data/dist/entities";
import { checkPermission } from "@kis/wb-api-services/dist/check-permission";

export const getUsers: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource, user } = await checkPermission(event, [UserRole.ADMIN]);

    const users = await appDataSource.manager.find(UserEntity);

    if (users.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No active users found" }),
      };
    }

    const filteredUsers = users.filter(userRecord => userRecord.id !== user.id);

    const totalUsers = filteredUsers.length;

    return {
      statusCode: 200,
      body: JSON.stringify({
        users: filteredUsers.map(user => ({
          id: user.id,
          username: user.username,
          role: user.role,
          deletedAt: user.deletedAt,
        })),
        totalUsers,
        message: "Users retrieved successfully",
      }),
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "Could not retrieve users",
      }),
    };
  }
};
