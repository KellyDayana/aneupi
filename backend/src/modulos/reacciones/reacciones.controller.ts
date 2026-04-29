import { Request, Response } from 'express';
import { ReaccionesService } from './reacciones.service';
import { TipoReaccion, TipoEntidad, ManejarReaccionDTO } from './reacciones.types';

function normalizarTipoEntidad(input: string | TipoEntidad | undefined): TipoEntidad {
  if (!input) {
    throw new Error('tipoReaccion es requerido');
  }

  const upper = input.toString().toUpperCase();

  // Manejo de plurales y variaciones
  const normalizaciones: { [key: string]: TipoEntidad } = {
    'NOTICIA': TipoEntidad.NOTICIA,
    'NOTICIAS': TipoEntidad.NOTICIA,
    'ARTICULO': TipoEntidad.ARTICULO,
    'ARTICULOS': TipoEntidad.ARTICULO,
    'COMENTARIO': TipoEntidad.COMENTARIO_NOTICIA, // Por defecto comentario de noticia
    'COMENTARIOS': TipoEntidad.COMENTARIO_NOTICIA,
    'COMENTARIO_NOTICIA': TipoEntidad.COMENTARIO_NOTICIA,
    'COMENTARIOS_NOTICIA': TipoEntidad.COMENTARIO_NOTICIA,
    'COMENTARIO_NOTICIAS': TipoEntidad.COMENTARIO_NOTICIA,
    'COMENTARIONOTICIA': TipoEntidad.COMENTARIO_NOTICIA,
    'COMENTARIO_ARTICULO': TipoEntidad.COMENTARIO_ARTICULO,
    'COMENTARIOS_ARTICULO': TipoEntidad.COMENTARIO_ARTICULO,
    'COMENTARIO_ARTICULOS': TipoEntidad.COMENTARIO_ARTICULO,
    'COMENTARIOARTICULO': TipoEntidad.COMENTARIO_ARTICULO,
  };

  if (normalizaciones[upper]) {
    return normalizaciones[upper];
  }

  // Si es un valor válido directo del enum
  if (Object.values(TipoEntidad).includes(upper as TipoEntidad)) {
    return upper as TipoEntidad;
  }

  throw new Error(`Tipo de entidad inválido: ${input}`);
}

function normalizarTipoReaccion(input: string | TipoReaccion | undefined): TipoReaccion {
  if (!input) {
    throw new Error('tipo_reaccion es requerido');
  }

  const upper = input.toString().toUpperCase();

  if (Object.values(TipoReaccion).includes(upper as TipoReaccion)) {
    return upper as TipoReaccion;
  }

  throw new Error(`Tipo de reacción inválido: ${input}`);
}

function statusDesdeError(error: unknown, defaultStatus = 500) {
  if (error instanceof Error) {
    const mensaje = error.message.toLowerCase();
    if (mensaje.includes('inválido') || mensaje.includes('requerido')) {
      return 400;
    }
  }
  return defaultStatus;
}

export class ReaccionesController {
  constructor(private service: ReaccionesService) { }

  /**
   * POST /api/reacciones
   * Maneja una reacción (crear, actualizar o eliminar)
   */
  manejarReaccion = async (req: Request, res: Response) => {
    try {
      // Los nombres aquí son camelCase porque los adaptamos en el DTO
      const { usuarioId, tipoEntidad, entidadId, tipoReaccion } = req.body;

      if (!usuarioId || !tipoEntidad || !entidadId || !tipoReaccion) {
        return res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: usuarioId, tipoEntidad, entidadId, tipoReaccion',
        });
      }

      const tipoEntidadNormalizado = normalizarTipoEntidad(tipoEntidad);
      const tipoReaccionNormalizado = normalizarTipoReaccion(tipoReaccion);

      // CORRECCIÓN: Estabas pasando la entidad en lugar de la reacción
      const resultado = await this.service.manejarReaccion({
        usuarioId,
        tipoEntidad: tipoEntidadNormalizado,
        entidadId,
        tipoReaccion: tipoReaccionNormalizado, // <-- ESTA ES LA LÍNEA CORREGIDA
      });

      res.status(200).json({
        success: true,
        data: resultado,
        message: `Reacción ${resultado.accion} exitosamente`,
      });
    } catch (error) {
      const status = statusDesdeError(error, 400);
      res.status(status).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al manejar la reacción',
      });
    }
  };

  /**
   * GET /api/reacciones/:tipoReaccion/:entidadId
   * Obtiene el detalle de reacciones de una entidad
   */
  // obtenerDetalleReacciones = async (req: Request, res: Response) => {
  //   try {
  //     const { tipoReaccion, entidadId } = req.params;
  //     const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;

  //     const detalle = await this.service.obtenerDetalleReacciones(
  //       normalizarTipoEntidad(tipoReaccion),
  //       Number(entidadId),
  //       usuarioId
  //     );

  //     res.status(200).json({
  //       success: true,
  //       data: detalle,
  //     });
  //   } catch (error) {
  //     const status = statusDesdeError(error, 500);
  //     res.status(status).json({
  //       success: false,
  //       error: error instanceof Error ? error.message : 'Error al obtener reacciones',
  //     });
  //   }
  // };

  /**
   * GET /api/reacciones/:tipoReaccion/:entidadId/conteo
   * Obtiene solo el conteo de reacciones
   */
  obtenerConteo = async (req: Request, res: Response) => {
    try {
      const { tipoReaccion, entidadId } = req.params;

      const conteo = await this.service.obtenerConteoReacciones(
        normalizarTipoEntidad(tipoReaccion),
        Number(entidadId)
      );

      res.status(200).json({
        success: true,
        data: conteo,
      });
    } catch (error) {
      const status = statusDesdeError(error, 500);
      res.status(status).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener conteo',
      });
    }
  };

  /**
   * GET /api/reacciones/:tipoReaccion/:entidadId/lista
   * Obtiene todas las reacciones con detalles de usuarios
   */
  obtenerLista = async (req: Request, res: Response) => {
    try {
      const { tipoReaccion, entidadId } = req.params;

      const reacciones = await this.service.obtenerReaccionesPorEntidad(
        normalizarTipoEntidad(tipoReaccion),
        Number(entidadId)
      );

      res.status(200).json({
        success: true,
        data: reacciones,
        count: reacciones.length,
      });
    } catch (error) {
      const status = statusDesdeError(error, 500);
      res.status(status).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener lista de reacciones',
      });
    }
  };

  /**
   * GET /api/reacciones/usuario/:usuarioId/:tipoReaccion/:entidadId
   * Obtiene la reacción de un usuario específico
   */
  obtenerReaccionUsuario = async (req: Request, res: Response) => {
    try {
      const { usuarioId, tipoReaccion, entidadId } = req.params;

      const reaccion = await this.service.obtenerReaccionUsuario(
        Number(usuarioId),
        normalizarTipoEntidad(tipoReaccion),
        Number(entidadId)
      );

      res.status(200).json({
        success: true,
        data: reaccion,
      });
    } catch (error) {
      const status = statusDesdeError(error, 500);
      res.status(status).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener reacción del usuario',
      });
    }
  };
}
