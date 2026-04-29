// en src/modulos/comentarios-articulo/comentarios-articulo.controller.ts (CORREGIDO)
import { Request, Response } from 'express';
import { ComentariosArticuloService } from './comentarios-articulo.service';
import { CrearComentarioArticuloDTO } from './comentarios-articulo.types';

export class ComentariosArticuloController {
  constructor(private service: ComentariosArticuloService) { }

  crearComentarioArticulo = async (req: Request, res: Response) => {
    try {
      // Leemos el ID de la URL
      const articuloIdFromParams = Number(req.params.articulo_id);

      // Creamos el DTO usando camelCase
      const dto: CrearComentarioArticuloDTO = {
        mensaje: req.body.mensaje,
        usuarioId: req.body.usuarioId, // Asumiendo que el body viene en camelCase
        articuloId: articuloIdFromParams,
        respuestaAId: req.body.respuestaAId
      };

      const comentario = await this.service.crearComentarioArticulo(dto);

      res.status(201).json({
        success: true,
        data: comentario,
        message: 'Comentario de artículo creado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear el comentario de artículo',
      });
    }
  };

  obtenerComentariosArticulo = async (req: Request, res: Response) => {
    try {
      const articuloId = Number(req.params.articulo_id);
      const incluirOcultos = req.query.incluir_ocultos === 'true';

      const comentarios = await this.service.obtenerComentariosDeArticulo(articuloId, incluirOcultos);

      res.status(200).json({
        success: true,
        data: comentarios,
        count: comentarios.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener los comentarios de artículo',
      });
    }
  };

  obtenerComentarioArticuloPorId = async (req: Request, res: Response) => {
    try {
      const comentarioId = Number(req.params.comentario_id);
      const comentario = await this.service.obtenerComentarioArticuloPorId(comentarioId);
      res.status(200).json({ success: true, data: comentario });
    } catch (error) {
      res.status(404).json({ success: false, error: (error as Error).message });
    }
  };

  actualizarComentarioArticulo = async (req: Request, res: Response) => {
    try {
      const comentarioId = Number(req.params.comentario_id);
      const comentario = await this.service.actualizarComentarioArticulo(comentarioId, req.body);
      res.status(200).json({ success: true, data: comentario, message: 'Comentario actualizado' });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  cambiarEstadoComentarioArticulo = async (req: Request, res: Response) => {
    try {
      const comentarioId = Number(req.params.comentario_id);
      const comentario = await this.service.cambiarEstadoComentarioArticulo(comentarioId, req.body);
      res.status(200).json({ success: true, data: comentario, message: 'Estado actualizado' });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  ocultarComentarioArticulo = async (req: Request, res: Response) => {
    try {
      const comentarioId = Number(req.params.comentario_id);
      const comentario = await this.service.ocultarComentarioArticulo(comentarioId);
      res.status(200).json({ success: true, data: comentario, message: 'Comentario ocultado' });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  eliminarComentarioArticuloPermanentemente = async (req: Request, res: Response) => {
    try {
      const comentarioId = Number(req.params.comentario_id);
      await this.service.eliminarComentarioArticuloFisicamente(comentarioId);
      res.status(200).json({ success: true, message: 'Comentario eliminado permanentemente' });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  contarComentariosArticulo = async (req: Request, res: Response) => {
    try {
      const articuloId = Number(req.params.articulo_id);
      const count = await this.service.contarComentariosVisiblesPorArticulo(articuloId);
      res.status(200).json({ success: true, data: { count } });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };
}