// en src/modulos/noticias/noticias.service.ts (CORREGIDO)

import { NoticiasRepository } from './noticias.repository';
import { CrearNoticiaDTO, ActualizarNoticiaDTO, FiltrosNoticia, CambiarEstadoNoticiaDTO, EstadoNoticia } from './noticias.types';
import { ReaccionesService } from '../reacciones/reacciones.service';
import { TipoEntidad } from '../reacciones/reacciones.types';

export class NoticiasService {
  constructor(
    private repository: NoticiasRepository,
    private reaccionesService?: ReaccionesService
  ) { }

  // CORRECCIÓN 1: La función ahora espera un objeto con 'noticiaId'
  private adjuntarReacciones<T extends { noticiaId: number }>(
    noticia: T,
    conteo?: Record<string, number>
  ) {
    const total = Object.values(conteo || {}).reduce((sum, count) => sum + count, 0);
    const reacciones = { ...(conteo || {}), total };
    return { ...noticia, reacciones };
  }

  async crearNoticia(data: CrearNoticiaDTO) {
    if (!data.titulo?.trim()) throw new Error('El título es requerido');
    if (!data.extracto?.trim()) throw new Error('El extracto es requerido');
    if (!data.contenido_noticia?.trim()) throw new Error('El contenido es requerido');
    return await this.repository.crear(data);
  }

  async obtenerNoticias(filtros: FiltrosNoticia) {
    const noticias = await this.repository.obtenerTodas(filtros);
    if (noticias.length === 0) return [];

    if (!this.reaccionesService) {
      return noticias.map((noticia) => this.adjuntarReacciones(noticia));
    }

    // CORRECCIÓN 2: Usar 'noticiaId' para obtener los IDs
    const noticiaIds = noticias.map((n) => n.noticiaId);
    const conteos = await this.reaccionesService.obtenerConteoMultiple(TipoEntidad.NOTICIA, noticiaIds);

    return noticias.map((noticia) =>
      // CORRECCIÓN 3: Usar 'noticiaId' para buscar en el mapa de conteos
      this.adjuntarReacciones(noticia, conteos[noticia.noticiaId])
    );
  }

  async obtenerNoticiaPorId(id: number) {
    const noticia = await this.repository.obtenerPorId(id);
    if (!noticia) throw new Error(`Noticia con ID ${id} no encontrada`);

    await this.repository.incrementarVistas(id);

    if (!this.reaccionesService) {
      return this.adjuntarReacciones(noticia);
    }

    const reacciones = await this.reaccionesService.obtenerConteoReacciones(TipoEntidad.NOTICIA, id);
    return { ...noticia, reacciones };
  }

  async actualizarNoticia(id: number, data: ActualizarNoticiaDTO) {
    await this.obtenerNoticiaPorId(id); // Valida que exista
    return await this.repository.actualizar(id, data);
  }

  async ocultarNoticia(id: number) {
    await this.obtenerNoticiaPorId(id); // Valida que exista
    return await this.repository.ocultarNoticia(id);
  }

  async eliminarNoticiaFisicamente(id: number) {
    const noticiaExistente = await this.repository.obtenerPorId(id);
    if (!noticiaExistente) throw new Error(`Noticia con ID ${id} no encontrada`);
    if (this.reaccionesService) {
      await this.reaccionesService.eliminarReaccionesPorEntidad(TipoEntidad.NOTICIA, id);
    }
    return await this.repository.eliminar(id);
  }

  async cambiarEstadoNoticia(id: number, data: CambiarEstadoNoticiaDTO) {
    const noticiaExistente = await this.repository.obtenerPorId(id);
    if (!noticiaExistente) throw new Error(`Noticia con ID ${id} no encontrada`);
    this.validarTransicionEstado(noticiaExistente.estado, data.estado);
    return await this.repository.cambiarEstado(id, data.estado);
  }

  private validarTransicionEstado(estadoActual: EstadoNoticia, nuevoEstado: EstadoNoticia) {
    if (estadoActual === EstadoNoticia.RECHAZADO && nuevoEstado !== EstadoNoticia.PENDIENTE_APROBACION) {
      throw new Error('Una noticia rechazada solo puede volver a estado PENDIENTE_APROBACION');
    }
    if (estadoActual === EstadoNoticia.PUBLICADO && (nuevoEstado === EstadoNoticia.PENDIENTE_APROBACION || nuevoEstado === EstadoNoticia.APROBADO)) {
      throw new Error('Una noticia publicada no puede volver a estado PENDIENTE_APROBACION o APROBADO');
    }
  }

  async obtenerNoticiasMasVistas(limit: number = 10) {
    const noticias = await this.repository.obtenerMasVistas(limit);
    if (noticias.length === 0) return [];

    if (!this.reaccionesService) {
      return noticias.map((noticia) => this.adjuntarReacciones(noticia));
    }

    const noticiaIds = noticias.map((n) => n.noticiaId);
    const conteos = await this.reaccionesService.obtenerConteoMultiple(TipoEntidad.NOTICIA, noticiaIds);

    return noticias.map((noticia) =>
      this.adjuntarReacciones(noticia, conteos[noticia.noticiaId])
    );
  }
}