import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { usuarioId: number; rol: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'tu_secreto_por_defecto_muy_seguro';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded as { usuarioId: number; rol: string };
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token inválido.' });
  }
};