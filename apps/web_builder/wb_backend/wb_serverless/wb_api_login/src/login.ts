import { getEnvConfig } from '@kis/common/src/utils/config';
import { generateTokens } from '@kis/common/src/utils/auth';
import { getAppDataSource } from '@kis/wb-data/dist/app-data-source';
import { UserEntity } from '@kis/wb-data/dist/entities';
import bcrypt from 'bcryptjs';
import { getConnectionOptions } from '@kis/common';
import { LoginDAO } from './types';

export const login = async (loginDAO: LoginDAO) => {
  const { username, password } = loginDAO;

  try {
    const appDataSource = getAppDataSource(
      getConnectionOptions()
    );
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
    }

    const user = await appDataSource.getRepository(UserEntity).findOne({
      where: { username },
      withDeleted: false,
    });

    if (!user) {
      return {
        responseCode: 404,
        data: { error: 'User not found!' }
      }
    }

    if (!user || user.deletedAt) {
      return {
        responseCode: 403,
        data: { error: "User is deactivated" },
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        responseCode: 400,
        data: { error: 'Username or password is invalid!' }
      }
    }

    const envConfig = getEnvConfig();

    const { accessToken, refreshToken } = generateTokens(
      user.id,
      envConfig.JWT_SECRET ?? '',
      envConfig.REFRESH_SECRET ?? ''
    );

    return {
      responseCode: 200,
      data: {
        accessToken,
        refreshToken,
        userId: user.id,
        username: user.username,
      }
    }
  } catch (error: any) {
    console.error('Lỗi:', error);
    return {
      responseCode: 500,
      data: {
        error: 'Internal server error'
      }
    }
  }
};