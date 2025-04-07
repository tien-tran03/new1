import { APIGatewayProxyHandler } from "aws-lambda";
import { checkPermission } from "@kis/wb-api-services/dist/check-permission";
import { UserEntity, UserRole } from "@kis/wb-data/dist/entities";

export const restoreUser: APIGatewayProxyHandler = async (event) => {
  try {
    const { appDataSource } = await checkPermission(event, [UserRole.ADMIN]);

    const userId = event.pathParameters?.userId;
    if (!userId || isNaN(Number(userId))) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid User ID" }) };
    }

    const userRepo = appDataSource.getRepository(UserEntity);

    // Tìm kiếm người dùng kể cả khi bị vô hiệu hóa (soft delete)
    const targetUser = await userRepo.findOne({
      where: { id: Number(userId) },
    });

    if (!targetUser) {
      return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
    }

    if (!targetUser.deletedAt) {
      // Nếu deletedAt là null, tài khoản đang hoạt động
      return { statusCode: 400, body: JSON.stringify({ error: "User is already active" }) };
    }

    targetUser.deletedAt = null;

    await userRepo.save(targetUser);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User restored successfully" }),
    };
  } catch (error: any) {
    console.error("Error restoring user:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || "Could not restore user" }) };
  }
};