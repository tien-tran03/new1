import { login } from './login';

export const loginHandler = async (req: any, res: any) => {
  const { username, password } = req.body;

  const result = await login({ username, password })

  return res.status(result.responseCode).json(result.data);
};