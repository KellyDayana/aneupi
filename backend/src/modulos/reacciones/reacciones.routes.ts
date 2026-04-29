import { Router } from 'express';
import { ReaccionesController } from './reacciones.controller';

export function createReaccionesRouter(controller: ReaccionesController): Router {
  const router = Router();

  // Manejar reacción (crear, actualizar o eliminar)
  router.post('/', controller.manejarReaccion);

  // Obtener detalle completo de reacciones
  // router.get('/:tipoEntidad/:entidadId', controller.obtenerDetalleReacciones);

  // Obtener solo conteo
  router.get('/:tipoEntidad/:entidadId/conteo', controller.obtenerConteo);

  // Obtener lista con usuarios
  router.get('/:tipoEntidad/:entidadId/lista', controller.obtenerLista);

  // Obtener reacción de un usuario específico
  router.get('/usuario/:usuarioId/:tipoEntidad/:entidadId', controller.obtenerReaccionUsuario);

  return router;
}
