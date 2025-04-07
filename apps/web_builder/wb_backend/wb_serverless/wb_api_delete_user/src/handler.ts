import { APIGatewayProxyHandler } from "aws-lambda";
import { checkPermission } from "@kis/wb-api-services/dist/check-permission";
import { UserEntity, UserRole } from "@kis/wb-data/dist/entities";

export const deleteUser: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource } = await checkPermission(event, [UserRole.ADMIN]);

    const userId = event.pathParameters?.userId;
    if (!userId) {
      return { statusCode: 400, body: JSON.stringify({ error: "User ID is required" }) };
    }

    const userRepo = appDataSource.getRepository(UserEntity);
    const targetUser = await userRepo.findOne({ where: { id: parseInt(userId, 10) } });

    if (!targetUser) {
      return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
    }

    targetUser.deletedAt = new Date();
    await userRepo.save(targetUser);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deactivated successfully" }),
    };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
