import { Request, Response } from 'express';
import { NoticiasService } from './noticias.service';
import { FiltrosNoticia } from './noticias.types';

export class NoticiasController {
  constructor(private service: NoticiasService) { }

  // POST /api/noticias - Crear una nueva noticia
  crearNoticia = async (req: Request, res: Response) => {
    try {
      const noticia = await this.service.crearNoticia(req.body);
      res.status(201).json({
        success: true,
        data: noticia,
        message: 'Noticia creada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear la noticia',
      });
    }
  };

  // GET /api/noticias - Obtener todas las noticias (incluye conteo de reacciones automáticamente)
  obtenerNoticias = async (req: Request, res: Response) => {
    try {
      const filtros: FiltrosNoticia = {
        categoriaId: req.query.categoria_id ? Number(req.query.categoria_id) : undefined,
        autorId: req.query.autor_id ? Number(req.query.autor_id) : undefined,
        estado: req.query.estado as any, // EstadoNoticia desde query
        search: req.query.search as string,
        skip: req.query.skip ? Number(req.query.skip) : 0,
        take: req.query.take ? Number(req.query.take) : 10,
        orderBy: (req.query.orderBy as 'asc' | 'desc') || 'desc',
      };

      const noticias = await this.service.obtenerNoticias(filtros);

      res.status(200).json({
        success: true,
        data: noticias,
        count: noticias.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener las noticias',
      });
    }
  };

  // GET /api/noticias/:id - Obtener una noticia por ID (incluye conteo de reacciones automáticamente)
  obtenerNoticiaPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const noticia = await this.service.obtenerNoticiaPorId(id);

      res.status(200).json({
        success: true,
        data: noticia,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Noticia no encontrada',
      });
    }
  };

  // PUT /api/noticias/:id - Actualizar una noticia
  actualizarNoticia = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const noticia = await this.service.actualizarNoticia(id, req.body);
      res.status(200).json({
        success: true,
        data: noticia,
        message: 'Noticia actualizada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar la noticia',
      });
    }
  };

  // DELETE /api/noticias/:id - Ocultar noticia (eliminación lógica)
  ocultarNoticia = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const noticia = await this.service.ocultarNoticia(id);
      res.status(200).json({
        success: true,
        data: noticia,
        message: 'Noticia ocultada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al ocultar la noticia',
      });
    }
  };

  // DELETE /api/noticias/:id/permanente - Eliminar noticia físicamente
  eliminarNoticiaPermanentemente = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.eliminarNoticiaFisicamente(id);
      res.status(200).json({
        success: true,
        message: 'Noticia eliminada permanentemente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar la noticia permanentemente',
      });
    }
  };

  // PATCH /api/noticias/:id/estado - Cambiar estado de una noticia
  cambiarEstado = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const noticia = await this.service.cambiarEstadoNoticia(id, req.body);
      res.status(200).json({
        success: true,
        data: noticia,
        message: 'Estado de la noticia actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al cambiar el estado de la noticia',
      });
    }
  };

  // // POST /api/noticias/:id/reaccion - Manejar reacción (DEPRECADO - usar /api/reacciones)
  // // Mantener por compatibilidad pero redirigir al nuevo sistema
  // darLike = async (req: Request, res: Response) => {
  //   res.status(410).json({
  //     success: false,
  //     message: 'Este endpoint está deprecado. Usa POST /api/reacciones',
  //     nuevo_endpoint: {
  //       url: '/api/reacciones',
  //       metodo: 'POST',
  //       body: {
  //         usuario_id: 'number',
  //         tipo_entidad: 'NOTICIA',
  //         entidad_id: 'number',
  //         tipo_reaccion: 'LIKE',
  //       },
  //     },
  //   });
  // };

  // darDislike = async (req: Request, res: Response) => {
  //   res.status(410).json({
  //     success: false,
  //     message: 'Este endpoint está deprecado. Usa POST /api/reacciones',
  //     nuevo_endpoint: {
  //       url: '/api/reacciones',
  //       metodo: 'POST',
  //       body: {
  //         usuario_id: 'number',
  //         tipo_entidad: 'NOTICIA',
  //         entidad_id: 'number',
  //         tipo_reaccion: 'DISLIKE',
  //       },
  //     },
  //   });
  // };

  // GET /api/noticias/mas-vistas - Obtener noticias más vistas
  obtenerMasVistas = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const noticias = await this.service.obtenerNoticiasMasVistas(limit);
      res.status(200).json({
        success: true,
        data: noticias,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener noticias',
      });
    }
  };

  // GET /api/noticias/categoria/:categoriaId - Obtener noticias por categoría
  // obtenerPorCategoria = async (req: Request, res: Response) => {
  //   try {
  //     const categoriaId = Number(req.params.categoriaId);
  //     const limit = req.query.limit ? Number(req.query.limit) : 10;
  //     const noticias = await this.service.obtenerNoticiasPorCategoria(categoriaId, limit);
  //     res.status(200).json({
  //       success: true,
  //       data: noticias,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error instanceof Error ? error.message : 'Error al obtener noticias',
  //     });
  //   }
  // };
}
