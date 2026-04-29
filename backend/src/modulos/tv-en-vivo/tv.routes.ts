import { Router } from 'express';
import { TvController } from './tv.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';


export function createTvRouter(controller: TvController): Router {
    const router = Router();
    router.get('/directos', controller.obtenerDirectos);
    router.get('/programas/:programaId/programacion', controller.obtenerProgramacion); router.post('/', authMiddleware, isAdmin, controller.crearVideo); router.post('/:videoId/like', /* authMiddleware, */ controller.darLike);
    router.get('/programas/:programaId/programacion', controller.obtenerProgramacion);
    router.post('/', controller.crearVideo);
    router.post('/:videoId/like', controller.darLike);
    router.post('/:videoId/dislike', controller.darDislike);
    router.get('/programas', controller.obtenerProgramas);
    router.get('/destacados', controller.obtenerDestacados);
    router.get('/programacion/:programaId', controller.obtenerProgramacion);
    return router;
}