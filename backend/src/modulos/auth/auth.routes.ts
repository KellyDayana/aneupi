import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';
const validate = (schema: any) => (req: Request, res: Response, next: Function) => {
  try { schema.parse(req.body); next(); } catch (error) { res.status(400).json({ success: false, error: (error as any).errors }); }
};
export function createAuthRouter(service: AuthService) {
  const router = Router();
  router.post('/register', validate(registerSchema), async (req, res) => {
    try { const user = await service.register(req.body); res.status(201).json({ success: true, data: user }); } 
    catch (error) { res.status(400).json({ success: false, error: (error as Error).message }); }
  });
  router.post('/login', validate(loginSchema), async (req, res) => {
    try { const result = await service.login(req.body); res.status(200).json({ success: true, data: result }); } 
    catch (error) { res.status(400).json({ success: false, error: (error as Error).message }); }
  });
  return router;
}