import { APIGatewayProxyHandler } from "aws-lambda";
import { UserEntity } from "@kis/wb-data/dist/entities";
import bcrypt from "bcryptjs";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const updateUser: APIGatewayProxyHandler = async (event) => {
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

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Request body is missing" }),
      };
    }

    const { oldPassword, newPassword, confirmNewPassword } = JSON.parse(event.body);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required (oldPassword, newPassword, confirmNewPassword)" }),
      };
    }

    if (newPassword !== confirmNewPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "New passwords do not match" }),
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

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Old password is incorrect" }),
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password_hash = hashedPassword;
    await appDataSource.manager.save(user);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password updated successfully" }),
    };
  } catch (error: any) {
    console.error("Error updating password:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Could not update password",
      }),
    };
  }
};
