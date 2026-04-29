import { Router } from 'express';
import { ArticulosController } from './articulos.controller';
import { ComentariosArticuloController } from '../comentarios-articulo';

export function createArticulosRouter(
  articulosController: ArticulosController,
  comentariosArticuloController: ComentariosArticuloController
): Router {
  const router = Router();

  router.get('/mas-leidos', articulosController.obtenerMasLeidos);

  router.post('/', articulosController.crearArticulo);
 
  router.get('/', articulosController.obtenerArticulos);
  router.get('/:id', articulosController.obtenerArticuloPorId);

  router.put('/:id', articulosController.actualizarArticulo);


  router.patch('/:id/estado', articulosController.cambiarEstado);
  router.patch('/:id/tiempo-lectura', articulosController.actualizarTiempoLectura);
  router.patch('/:id/tiempo-lectura/incrementar', articulosController.incrementarTiempoLectura);

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
