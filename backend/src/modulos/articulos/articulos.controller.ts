import { Request, Response } from 'express';
import { ArticulosService } from './articulos.service';
import { FiltrosArticulo } from './articulos.types';

export class ArticulosController {
  constructor(private service: ArticulosService) { }

  crearArticulo = async (req: Request, res: Response) => {
    try {
      const esAdmin = req.user?.rol === 'admin';
      const articulo = await this.service.crearArticulo(req.body, esAdmin);
      res.status(201).json({
        success: true,
        data: articulo,
        message: esAdmin
          ? 'Artículo creado exitosamente'
          : 'Artículo enviado para revisión. Será publicado una vez aprobado.',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear el artículo',
      });
    }
  };

  obtenerArticulos = async (req: Request, res: Response) => {
    try {
      const filtros: FiltrosArticulo = {
        categoriaId: req.query.categoria_id ? Number(req.query.categoria_id) : undefined,
        autorId: req.query.autor_id ? Number(req.query.autor_id) : undefined,
        estado: req.query.estado as any,
        search: req.query.search as string,
        skip: req.query.skip ? Number(req.query.skip) : 0,
        take: req.query.take ? Number(req.query.take) : 10,
        orderBy: (req.query.orderBy as 'asc' | 'desc') || 'desc',
      };

      // Si el usuario es admin puede ver todos los estados; si no, solo publicados
      const esAdmin = req.user?.rol === 'admin';
      const soloPublicados = !esAdmin && !filtros.estado;

      const articulos = await this.service.obtenerArticulos(filtros, soloPublicados);

      res.status(200).json({
        success: true,
        data: articulos,
        count: articulos.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener los artículos',
      });
    }
  };

  obtenerArticuloPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.obtenerArticuloPorId(id);

      res.status(200).json({
        success: true,
        data: articulo,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error instanceof Error ? error.message : 'Artículo no encontrado',
      });
    }
  };

  actualizarArticulo = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.actualizarArticulo(id, req.body);

      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Artículo actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar el artículo',
      });
    }
  };

  ocultarArticulo = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.ocultarArticulo(id);

      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Artículo ocultado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al ocultar el artículo',
      });
    }
  };

  eliminarArticuloPermanentemente = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.service.eliminarArticuloFisicamente(id);

      res.status(200).json({
        success: true,
        message: 'Artículo eliminado permanentemente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar el artículo permanentemente',
      });
    }
  };

  cambiarEstado = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.cambiarEstadoArticulo(id, req.body);

      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Estado del artículo actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al cambiar el estado del artículo',
      });
    }
  };

  actualizarTiempoLectura = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.actualizarTiempoLectura(id, req.body);

      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Tiempo de lectura actualizado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar el tiempo de lectura',
      });
    }
  };

  incrementarTiempoLectura = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.incrementarTiempoLectura(id, req.body);

      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Tiempo de lectura incrementado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al incrementar el tiempo de lectura',
      });
    }
  };

  obtenerMasLeidos = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const articulos = await this.service.obtenerArticulosMasLeidos(limit);

      res.status(200).json({
        success: true,
        data: articulos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener artículos',
      });
    }
  };

  obtenerPendientes = async (req: Request, res: Response) => {
    try {
      const articulos = await this.service.obtenerArticulosPendientes();
      res.status(200).json({
        success: true,
        data: articulos,
        count: articulos.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener artículos pendientes',
      });
    }
  };

  aprobarArticulo = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const articulo = await this.service.aprobarArticulo(id);
      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Artículo aprobado y publicado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al aprobar el artículo',
      });
    }
  };

  rechazarArticulo = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { motivo_rechazo } = req.body;
      const articulo = await this.service.rechazarArticulo(id, motivo_rechazo);
      res.status(200).json({
        success: true,
        data: articulo,
        message: 'Artículo rechazado',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al rechazar el artículo',
      });
    }
  };
}
