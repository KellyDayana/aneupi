import { PrismaClient } from '@prisma/client';
import { ComentariosRepository, ComentariosService, ComentariosController, createComentariosRouter } from '.';
export function createComentariosModule(prisma: PrismaClient) {
    const repository = new ComentariosRepository(prisma);
    const service = new ComentariosService(repository);
    const controller = new ComentariosController(service);
    const router = createComentariosRouter(controller);
    return { repository, service, controller, router };
}
export * from './comentarios.repository'; export * from './comentarios.service'; export * from './comentarios.controller'; export * from './comentarios.routes'; export * from './comentarios.types';