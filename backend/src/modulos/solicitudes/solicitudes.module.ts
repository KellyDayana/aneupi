import { PrismaClient } from '@prisma/client';
import { SolicitudesRepository } from './solicitudes.repository';
import { SolicitudesService } from './solicitudes.service';

// Importamos Router y el resto desde aquí para que el módulo sea autocontenido
import { Router, Request, Response } from 'express';
import { crearSolicitudSchema } from './solicitudes.validation';

const validate = (schema: any) => (req: Request, res: Response, next: Function) => {
  try { schema.parse(req.body); next(); } catch (error) { res.status(400).json({ success: false, error: (error as any).errors }); }
};

export function createSolicitudesModule(prisma: PrismaClient) {
  const repository = new SolicitudesRepository(prisma);
  const service = new SolicitudesService(repository);
  const router = Router();

  router.post('/', validate(crearSolicitudSchema), async (req: Request, res: Response) => {
    try {
      const usuarioId = req.user?.usuarioId;
      const solicitud = await service.crearSolicitud(req.body, usuarioId);
      res.status(201).json({ success: true, data: solicitud });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error al procesar la solicitud' });
    }
  });
  
  return { repository, service, router };
}