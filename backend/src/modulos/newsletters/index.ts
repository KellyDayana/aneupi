
import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { NewslettersRepository } from './newsletters.repository';
import { suscribirSchema } from './newsletters.validation'; // Importamos del archivo que creamos arriba

// Middleware de validación
const validate = (schema: any) => (req: Request, res: Response, next: Function) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ success: false, error: (error as any).errors });
  }
};

export function createNewslettersModule(prisma: PrismaClient) {
  const repository = new NewslettersRepository(prisma);
  const router = Router();

  // GET /api/newsletters
  router.get('/', async (req, res) => {
    try {
      const newsletters = await repository.obtenerTodos();
      res.status(200).json({ success: true, data: newsletters });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al obtener los newsletters' });
    }
  });

  // POST /api/newsletters/suscribir
  router.post('/suscribir', validate(suscribirSchema), async (req, res) => {
    try {
      const { email, newsletterIds } = req.body;
      await repository.suscribir(email, newsletterIds);
      res.status(200).json({ success: true, message: `El email ${email} ha sido suscrito.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al procesar la suscripción' });
    }
  });

  return { repository, router };
}