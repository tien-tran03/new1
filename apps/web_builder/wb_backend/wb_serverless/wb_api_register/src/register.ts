import { getAppDataSource } from '@kis/wb-data/dist/app-data-source';
import { UserEntity } from '@kis/wb-data/dist/entities';
import bcrypt from 'bcryptjs';
import { getConnectionOptions } from '@kis/common';
import * as yup from 'yup';
import { RegisterDAO } from './types';

const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(6).required(),
});

export const register = async (registerDAO: RegisterDAO) => {
    try {
        // Validate input
        await schema.validate(registerDAO, { abortEarly: false });  // Collect all errors
        
        const { username, password } = registerDAO;
        const appDataSource = getAppDataSource(getConnectionOptions());

        if (!appDataSource.isInitialized) {
            await appDataSource.initialize();
        }

        const existingUser = await appDataSource.getRepository(UserEntity).findOne({
            where: { username },
        });

        if (existingUser) {
            return {
                responseCode: 400,
                data: { error: 'Username already exists. Please choose another.' },
            };
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new UserEntity();
        user.username = username;
        user.password_hash = passwordHash;

        await appDataSource.manager.save(user);

        return {
            responseCode: 201,
            data: { newUserId: user.id, newUsername: user.username },
        };
    } catch (error: any) {
        // Check if error is from validation failure
        if (error.name === 'ValidationError') {
            return {
                responseCode: 400,
                data: { error: error.errors.join(', ') },  // Return the validation error message
            };
        }

        console.error('Error:', error);
        return {
            responseCode: 500,
            data: {
                error: 'Internal server error',
            },
        };
    }
};