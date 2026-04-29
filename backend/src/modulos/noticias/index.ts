import { PrismaClient } from '@prisma/client';
import { NoticiasRepository } from './noticias.repository';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { ReaccionesService } from '../reacciones/reacciones.service';

// Factory pattern para crear el módulo completo
export function createNoticiasModule(prisma: PrismaClient, reaccionesService?: ReaccionesService) {
  // Repositorios
  const noticiasRepository = new NoticiasRepository(prisma);

  // Servicios
  const noticiasService = new NoticiasService(noticiasRepository, reaccionesService);

  // Controladores
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

export * from './noticias.types';
export * from './noticias.repository';
export * from './noticias.service';
export * from './noticias.controller';
export * from './noticias.routes';
