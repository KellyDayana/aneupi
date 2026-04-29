import { PrismaClient } from '@prisma/client';
import { ComentariosArticuloRepository } from './comentarios-articulo.repository';
import { ComentariosArticuloService } from './comentarios-articulo.service';
import { ComentariosArticuloController } from './comentarios-articulo.controller';
import { ArticulosRepository } from '../articulos/articulos.repository';

export function createComentariosArticuloModule(
  prisma: PrismaClient,
  articulosRepository: ArticulosRepository
) {
  const comentariosRepository = new ComentariosArticuloRepository(prisma);
  const comentariosService = new ComentariosArticuloService(
    comentariosRepository,
    articulosRepository
  );
  const comentariosController = new ComentariosArticuloController(comentariosService);

  return {
    repository: comentariosRepository,
    service: comentariosService,
    controller: comentariosController,
  };
}

export * from './comentarios-articulo.types';
export * from './comentarios-articulo.repository';
export * from './comentarios-articulo.service';
export * from './comentarios-articulo.controller';
