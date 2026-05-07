import { Router } from 'express';
import { ArticulosController } from './articulos.controller';
import { ComentariosArticuloController } from '../comentarios-articulo';
import { authMiddleware } from '../../middleware/auth.middleware';
import { isAdmin } from '../../middleware/admin.middleware';

export function createArticulosRouter(
  articulosController: ArticulosController,
  comentariosArticuloController: ComentariosArticuloController
): Router {
  const router = Router();

  router.get('/mas-leidos', articulosController.obtenerMasLeidos);

  // Endpoints de moderación — sin auth por ahora (login mock no genera token)
  router.get('/pendientes', articulosController.obtenerPendientes);
  router.get('/eliminados', articulosController.obtenerEliminados);
  router.put('/:id/restaurar', articulosController.restaurarArticulo);
  router.put('/:id/aprobar', articulosController.aprobarArticulo);
  router.put('/:id/rechazar', articulosController.rechazarArticulo);

  // Creación: no requiere autenticación (el estado se asigna según si hay token o no)
  router.post('/', articulosController.crearArticulo);

  // Lectura pública (el controlador filtra por estado según el rol)
  router.get('/', articulosController.obtenerArticulos);
  router.get('/:id', articulosController.obtenerArticuloPorId);

  // Actualización y eliminación — requiere autenticación
  router.put('/:id', authMiddleware, articulosController.actualizarArticulo);

  router.patch('/:id/estado', authMiddleware, isAdmin, articulosController.cambiarEstado);
  router.patch('/:id/tiempo-lectura', authMiddleware, articulosController.actualizarTiempoLectura);
  router.patch('/:id/tiempo-lectura/incrementar', authMiddleware, articulosController.incrementarTiempoLectura);

  router.delete('/:id', articulosController.ocultarArticulo);
  router.delete('/:id/permanente', articulosController.eliminarArticuloPermanentemente);

  // Comentarios de artículos
  router.get('/:articulo_id/comentarios/count', comentariosArticuloController.contarComentariosArticulo);
  router.post('/:articulo_id/comentarios', comentariosArticuloController.crearComentarioArticulo);
  router.get('/:articulo_id/comentarios', comentariosArticuloController.obtenerComentariosArticulo);
  router.get('/:articulo_id/comentarios/:comentario_id', comentariosArticuloController.obtenerComentarioArticuloPorId);
  router.put('/:articulo_id/comentarios/:comentario_id', comentariosArticuloController.actualizarComentarioArticulo);
  router.patch('/:articulo_id/comentarios/:comentario_id/estado', comentariosArticuloController.cambiarEstadoComentarioArticulo);
  router.delete('/:articulo_id/comentarios/:comentario_id', comentariosArticuloController.ocultarComentarioArticulo);
  router.delete(
    '/:articulo_id/comentarios/:comentario_id/permanente',
    comentariosArticuloController.eliminarComentarioArticuloPermanentemente
  );

  return router;
}
