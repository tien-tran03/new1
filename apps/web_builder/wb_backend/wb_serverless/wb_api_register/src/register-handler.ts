import { register } from './register';

export const registerHandler = async (req: any, res: any) => {
  const { username, password } = req.body;

  const result = await register({ username, password });

  return res.status(result.responseCode).json(result.data);
};