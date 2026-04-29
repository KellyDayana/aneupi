import { Router } from 'express';
import { NoticiasController } from './noticias.controller';
import { ComentariosNoticiaController } from '../comentarios-noticia';

export function createNoticiasRouter(
  noticiasController: NoticiasController,
  comentariosNoticiaController: ComentariosNoticiaController
): Router {
  const router = Router();

  // Rutas especiales (deben ir antes de /:id)
  router.get('/mas-vistas', noticiasController.obtenerMasVistas);

  // CRUD Noticias
  router.post('/', noticiasController.crearNoticia);
  router.get('/', noticiasController.obtenerNoticias);
  router.get('/:id', noticiasController.obtenerNoticiaPorId);
  router.put('/:id', noticiasController.actualizarNoticia);

  // Cambiar estado de noticia
  router.patch('/:id/estado', noticiasController.cambiarEstado);

  // Eliminación lógica (cambia estado a OCULTO)
  router.delete('/:id', noticiasController.ocultarNoticia);

  // Eliminación física (solo para admins - usar con precaución)
  router.delete('/:id/permanente', noticiasController.eliminarNoticiaPermanentemente);

  // === Rutas de Comentarios De NOTICIAS ===
  // ============================

  // Ruta especial para contar comentarios (debe ir antes de /:comentario_id)
  router.get('/:noticia_id/comentarios/count', comentariosNoticiaController.contarComentariosNoticia);

  // CRUD Comentarios
  router.post('/:noticia_id/comentarios', comentariosNoticiaController.crearComentarioNoticia);
  router.get('/:noticia_id/comentarios', comentariosNoticiaController.obtenerComentariosNoticia);
  router.get('/:noticia_id/comentarios/:comentario_id', comentariosNoticiaController.obtenerComentarioNoticiaPorId);
  router.put('/:noticia_id/comentarios/:comentario_id', comentariosNoticiaController.actualizarComentarioNoticia);

  // Cambiar estado del comentario (eliminación lógica)
  router.patch('/:noticia_id/comentarios/:comentario_id/estado', comentariosNoticiaController.cambiarEstadoComentarioNoticia);
  router.delete('/:noticia_id/comentarios/:comentario_id', comentariosNoticiaController.ocultarComentarioNoticia);

  // Eliminación física (solo para admins - usar con precaución)
  router.delete('/:noticia_id/comentarios/:comentario_id/permanente', comentariosNoticiaController.eliminarComentarioNoticiaPermanentemente);

  return router;
}
