import { Request, Response } from 'express';
import { ComentariosNoticiaService } from './comentarios-noticia.service';
import { io } from '../../index';

export class ComentariosNoticiaController {
  constructor(private service: ComentariosNoticiaService) { }

  crearComentarioNoticia = async (req: Request, res: Response) => {
    try {
      const noticiaId = Number(req.params.noticia_id); // Se mantiene porque viene de la URL
      const comentario = await this.service.crearComentarioNoticia({
        mensaje: req.body.mensaje,
        usuarioId: req.body.usuarioId,
        noticiaId: noticiaId,
        respuestaAId: req.body.respuestaAId
      });
      res.status(201).json({
        success: true,
        data: comentario,
        message: 'Comentario de noticia creado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear el comentario de noticia',
      });
    }
  };

  obtenerComentariosNoticia = async (req: Request, res: Response) => {
    try {
      const noticia_id = Number(req.params.noticia_id);
      const incluirOcultos = req.query.incluir_ocultos === 'true';

      const comentarios = await this.service.obtenerComentariosDeNoticia(noticia_id, incluirOcultos);

      res.status(200).json({
        success: true,
        data: comentarios,
        count: comentarios.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener los comentarios de noticia',
      });
    }
  };

  obtenerComentarioNoticiaPorId = async (req: Request, res: Response) => {
    try {
      const comentario_id = Number(req.params.comentario_id);
      const comentario = await this.service.obtenerComentarioNoticiaPorId(comentario_id);

      res.status(200).json({
        success: true,
        data: comentario,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Comentario de noticia no encontrado',
      });
    }
  };

  actualizarComentarioNoticia = async (req: Request, res: Response) => {
    try {
      const comentario_id = Number(req.params.comentario_id);
      const comentario = await this.service.actualizarComentarioNoticia(comentario_id, req.body);

      res.status(200).json({
        success: true,
        data: comentario,
        message: 'Comentario de noticia actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar el comentario de noticia',
      });
    }
  };

  cambiarEstadoComentarioNoticia = async (req: Request, res: Response) => {
    try {
      const comentario_id = Number(req.params.comentario_id);
      const comentario = await this.service.cambiarEstadoComentarioNoticia(comentario_id, req.body);

      res.status(200).json({
        success: true,
        data: comentario,
        message: 'Estado del comentario de noticia actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al cambiar el estado del comentario de noticia',
      });
    }
  };

  ocultarComentarioNoticia = async (req: Request, res: Response) => {
    try {
      const comentario_id = Number(req.params.comentario_id);
      const comentario = await this.service.ocultarComentarioNoticia(comentario_id);

      res.status(200).json({
        success: true,
        data: comentario,
        message: 'Comentario de noticia ocultado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al ocultar el comentario de noticia',
      });
    }
  };

  eliminarComentarioNoticiaPermanentemente = async (req: Request, res: Response) => {
    try {
      const comentario_id = Number(req.params.comentario_id);
      await this.service.eliminarComentarioNoticiaFisicamente(comentario_id);

      res.status(200).json({
        success: true,
        message: 'Comentario de noticia eliminado permanentemente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar el comentario de noticia',
      });
    }
  };

  contarComentariosNoticia = async (req: Request, res: Response) => {
    try {
      const noticia_id = Number(req.params.noticia_id);
      const count = await this.service.contarComentariosVisiblesPorNoticia(noticia_id);

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al contar comentarios de noticia',
      });
    }
  };
}
