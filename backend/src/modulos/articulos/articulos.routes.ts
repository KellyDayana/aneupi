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

  // Endpoints de moderación — solo admin
  router.get('/pendientes', authMiddleware, isAdmin, articulosController.obtenerPendientes);
  router.put('/:id/aprobar', authMiddleware, isAdmin, articulosController.aprobarArticulo);
  router.put('/:id/rechazar', authMiddleware, isAdmin, articulosController.rechazarArticulo);

  // Creación: requiere autenticación
  router.post('/', authMiddleware, articulosController.crearArticulo);

  // Lectura pública (el controlador filtra por estado según el rol)
  router.get('/', articulosController.obtenerArticulos);
  router.get('/:id', articulosController.obtenerArticuloPorId);

  // Actualización y eliminación — requiere autenticación
  router.put('/:id', authMiddleware, articulosController.actualizarArticulo);

  router.patch('/:id/estado', authMiddleware, isAdmin, articulosController.cambiarEstado);
  router.patch('/:id/tiempo-lectura', authMiddleware, articulosController.actualizarTiempoLectura);
  router.patch('/:id/tiempo-lectura/incrementar', authMiddleware, articulosController.incrementarTiempoLectura);

  router.delete('/:id', authMiddleware, articulosController.ocultarArticulo);
  router.delete('/:id/permanente', authMiddleware, isAdmin, articulosController.eliminarArticuloPermanentemente);

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
