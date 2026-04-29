import { PrismaClient } from '@prisma/client';
import { ArticulosRepository } from './articulos.repository';
import { ArticulosService } from './articulos.service';
import { ArticulosController } from './articulos.controller';
import { ReaccionesService } from '../reacciones/reacciones.service';

export function createArticulosModule(prisma: PrismaClient, reaccionesService?: ReaccionesService) {
  const articulosRepository = new ArticulosRepository(prisma);
  const articulosService = new ArticulosService(articulosRepository, reaccionesService);
  const articulosController = new ArticulosController(articulosService);

  return {
    repositories: {
      articulos: articulosRepository,
    },
    services: {
      articulos: articulosService,
    },
    controllers: {
      articulos: articulosController,
    },
  };
}