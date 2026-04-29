import { PrismaClient } from '@prisma/client';
import { ComentariosNoticiaRepository } from './comentarios-noticia.repository';
import { ComentariosNoticiaService } from './comentarios-noticia.service';
import { ComentariosNoticiaController } from './comentarios-noticia.controller';
import { NoticiasRepository } from '../noticias/noticias.repository';

export function createComentariosNoticiaModule(
  prisma: PrismaClient,
  noticiasRepository: NoticiasRepository
) {
  const comentariosRepository = new ComentariosNoticiaRepository(prisma);
  const comentariosService = new ComentariosNoticiaService(
    comentariosRepository,
    noticiasRepository
  );
  const comentariosController = new ComentariosNoticiaController(comentariosService);

  return {
    repository: comentariosRepository,
    service: comentariosService,
    controller: comentariosController,
  };
}