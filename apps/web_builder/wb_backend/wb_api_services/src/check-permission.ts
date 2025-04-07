import { UserEntity, UserRole } from "@kis/wb-data/dist/entities";
import { verifyUserAndInitializeDB } from "./verify-user-and-initialize-db";

export const checkPermission = async (event: any, allowedRoles: UserRole[]) => {
    const { decoded, appDataSource } = await verifyUserAndInitializeDB(event);

    const user = await appDataSource.manager.findOne(UserEntity, {
        where: { id: decoded.userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === UserRole.ADMIN) {
        return { user, appDataSource };
    }

    if (!allowedRoles.includes(user.role)) {
        throw new Error("Access denied");
    }

    return { user, appDataSource };
};
