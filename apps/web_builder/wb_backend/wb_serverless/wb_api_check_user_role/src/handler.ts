import { APIGatewayProxyHandler } from "aws-lambda";
import { UserEntity } from "@kis/wb-data/dist/entities";
import { verifyUserAndInitializeDB } from "@kis/wb-api-services/dist/verify-user-and-initialize-db";

export const checkUserRole: APIGatewayProxyHandler = async (event) => {
    try {
        // Verify user and initialize DB connection
        const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);

        // Get user repository
        const userRepo = appDataSource.getRepository(UserEntity);
        const user = await userRepo.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "User not found" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                userId: user.id,
                role: user.role,
            }),
        };
    } catch (error: any) {
        console.error("Error checking user role:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not retrieve user role" }),
        };
    }
};
