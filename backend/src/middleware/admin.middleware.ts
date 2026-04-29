import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user && user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};