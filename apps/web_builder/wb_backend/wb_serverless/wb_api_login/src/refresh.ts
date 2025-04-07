import { getEnvConfig } from "@kis/common/src/utils/config";
import { verifyRefreshToken, generateTokens } from "@kis/common/src/utils/auth";
import { UserEntity } from '@kis/wb-data/dist/entities';
import { getAppDataSource } from '@kis/wb-data/dist/app-data-source';
import { getConnectionOptions } from "@kis/common";

export const refresh = async (refreshDAO: { refreshToken: string }) => {
  const { refreshToken } = refreshDAO;

  try {
    // Validate refresh token
    if (!refreshToken) {
      return {
        responseCode: 400,
        data: { error: "Refresh Token required" }
      };
    }

    // Get environment config
    const envConfig = getEnvConfig();

    // Verify the refresh token
    const decoded: any = await verifyRefreshToken(refreshToken, envConfig.REFRESH_SECRET ?? '');

    // Check if the user exists in the database
    const appDataSource = getAppDataSource(getConnectionOptions());
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    const user = await appDataSource.getRepository(UserEntity).findOne({
      where: { id: decoded.userId }
    });

    if (!user) {
      return {
        responseCode: 404,
        data: { error: "User not found!" }
      };
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      envConfig.JWT_SECRET ?? '',
      envConfig.REFRESH_SECRET ?? ''
    );

    return {
      responseCode: 200,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    };
  } catch (err: any) {
    console.error('Error refreshing token:', err);
    return {
      responseCode: 403,
      data: { error: "Invalid refresh token" }
    };
  }
};