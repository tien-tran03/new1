import { refresh } from './refresh';

export const refreshHandler = async (req: any, res: any) => {
  const { refreshToken } = req.body;

  const result = await refresh({ refreshToken });

  return res.status(result.responseCode).json(result.data);
};