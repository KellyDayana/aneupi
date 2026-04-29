import { PrismaClient } from '@prisma/client';
import { NoticiasRepository } from './noticias.repository';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { ReaccionesService } from '../reacciones/reacciones.service';

export function createNoticiasModule(prisma: PrismaClient, reaccionesService?: ReaccionesService) {
  const noticiasRepository = new NoticiasRepository(prisma);
  const noticiasService = new NoticiasService(noticiasRepository, reaccionesService);
  const noticiasController = new NoticiasController(noticiasService);

  return {
    repositories: {
      noticias: noticiasRepository,
    },
    services: {
      noticias: noticiasService,
    },
    controllers: {
      noticias: noticiasController,
    },
  };
}