import { Router } from 'express';
import { ComentariosController } from './comentarios.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
export function createComentariosRouter(controller: ComentariosController): Router {
    const router = Router();
    router.post('/', authMiddleware, controller.crearComentario);
    router.post('/:comentarioId/respuestas', authMiddleware, controller.crearRespuesta);
    router.get('/:entidadTipo/:entidadId', controller.obtenerComentarios);
    return router;
}