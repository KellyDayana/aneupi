import { EstadoNoticia } from '@prisma/client';
import { ArticulosRepository } from './articulos.repository';
import {
  CrearArticuloDTO,
  ActualizarArticuloDTO,
  FiltrosArticulo,
  CambiarEstadoArticuloDTO,
  ActualizarTiempoLecturaDTO,
  IncrementarTiempoLecturaDTO,
  EstadoArticulo,
} from './articulos.types';
import { ReaccionesService } from '../reacciones/reacciones.service';
import { TipoEntidad } from '../reacciones/reacciones.types';

export class ArticulosService {
  constructor(
    private repository: ArticulosRepository,
    private reaccionesService?: ReaccionesService
  ) { }

  private calcularReacciones(conteo: Record<string, number> = {}) {
    const total = Object.values(conteo).reduce((sum, count) => sum + count, 0);
    return {
      ...conteo,
      total,
    };
  }

  private adjuntarReacciones<T extends { articuloId: number }>(
    articulo: T,
    conteo?: Record<string, number>
  ) {
    const total = Object.values(conteo || {}).reduce((sum, count) => sum + count, 0);
    const reacciones = { ...(conteo || {}), total };
    return { ...articulo, reacciones };
  }

  async crearArticulo(data: CrearArticuloDTO, esAdmin: boolean = false) {
    this.validarCamposObligatorios(data);
    this.validarTiempoLectura(data.tiempo_lectura);

    // Si el body ya trae estado PUBLICADO, respetarlo (admin desde frontend)
    // Si no es admin y no trae estado PUBLICADO, forzar PENDIENTE_APROBACION
    if (!esAdmin && data.estado !== EstadoNoticia.PUBLICADO) {
      data.estado = EstadoNoticia.PENDIENTE_APROBACION;
    }

    // Si no viene ningún estado, asignar según rol
    if (!data.estado) {
      data.estado = esAdmin ? EstadoNoticia.PUBLICADO : EstadoNoticia.PENDIENTE_APROBACION;
    }

    return await this.repository.crear(data);
  }

  async obtenerArticulos(filtros: FiltrosArticulo, soloPublicados: boolean = false) {
    // Si soloPublicados=true (vista pública), forzar filtro PUBLICADO
    if (soloPublicados) {
      filtros.estado = EstadoNoticia.PUBLICADO;
    }

    const articulos = await this.repository.obtenerTodos(filtros);
    if (articulos.length === 0) return [];

    if (!this.reaccionesService) {
      return articulos.map((articulo) => this.adjuntarReacciones(articulo));
    }

    // CORRECCIÓN 2: Usar 'articuloId' para obtener los IDs
    const articuloIds = articulos.map((a) => a.articuloId);
    const conteos = await this.reaccionesService.obtenerConteoMultiple(TipoEntidad.ARTICULO, articuloIds);

    return articulos.map((articulo) =>
      // CORRECCIÓN 3: Usar 'articuloId' para buscar en el mapa de conteos
      this.adjuntarReacciones(articulo, conteos[articulo.articuloId])
    );
  }

  async obtenerArticuloPorId(id: number) {
    const articulo = await this.repository.obtenerPorId(id);
    if (!articulo) throw new Error(`Artículo con ID ${id} no encontrado`);
    await this.repository.incrementarVistas(id);

    if (!this.reaccionesService) {
      return this.adjuntarReacciones(articulo);
    }

    const reacciones = await this.reaccionesService.obtenerConteoReacciones(TipoEntidad.ARTICULO, id);
    return { ...articulo, reacciones };
  }


  async actualizarArticulo(id: number, data: ActualizarArticuloDTO) {
    const articuloExistente = await this.repository.obtenerPorId(id);

    if (!articuloExistente) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    if (data.tiempo_lectura !== undefined) {
      this.validarTiempoLectura(data.tiempo_lectura);
    }

    return await this.repository.actualizar(id, data);
  }

  async eliminarArticulo(id: number) {
    const articuloExistente = await this.repository.obtenerPorId(id);

    if (!articuloExistente) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    if (this.reaccionesService) {
      await this.reaccionesService.eliminarReaccionesPorEntidad(
        TipoEntidad.ARTICULO,
        id
      );
    }

    return await this.repository.eliminar(id);
  }

  async ocultarArticulo(id: number) {
    const articuloExistente = await this.repository.obtenerPorId(id);

    if (!articuloExistente) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    return await this.repository.ocultarArticulo(id);
  }

  async eliminarArticuloFisicamente(id: number) {
    // Mantener compatibilidad con el módulo de noticias
    return await this.eliminarArticulo(id);
  }

  async cambiarEstadoArticulo(id: number, data: CambiarEstadoArticuloDTO) {
    const articuloExistente = await this.repository.obtenerPorId(id);

    if (!articuloExistente) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    this.validarTransicionEstado(articuloExistente.estado as EstadoArticulo, data.estado);

    return await this.repository.cambiarEstado(id, data.estado, data.motivo_rechazo);
  }

  async aprobarArticulo(id: number) {
    const articuloExistente = await this.repository.obtenerPorId(id);
    if (!articuloExistente) throw new Error(`Artículo con ID ${id} no encontrado`);
    return await this.repository.cambiarEstado(id, EstadoNoticia.PUBLICADO, undefined);
  }

  async rechazarArticulo(id: number, motivo_rechazo?: string) {
    const articuloExistente = await this.repository.obtenerPorId(id);
    if (!articuloExistente) throw new Error(`Artículo con ID ${id} no encontrado`);
    return await this.repository.cambiarEstado(id, EstadoNoticia.RECHAZADO, motivo_rechazo);
  }

  async obtenerArticulosPendientes() {
    return await this.repository.obtenerPendientes();
  }

  async obtenerArticulosEliminados() {
    return await this.repository.obtenerEliminados();
  }

  async restaurarArticulo(id: number) {
    const articulo = await this.repository.obtenerPorId(id);
    if (!articulo) throw new Error(`Artículo con ID ${id} no encontrado`);
    return await this.repository.restaurar(id);
  }

  async actualizarTiempoLectura(id: number, data: ActualizarTiempoLecturaDTO) {
    const articuloExistente = await this.repository.obtenerPorId(id);

    if (!articuloExistente) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    this.validarTiempoLectura(data.tiempo_lectura);

    return await this.repository.actualizarTiempoLectura(id, data);
  }

  async incrementarTiempoLectura(id: number, data: IncrementarTiempoLecturaDTO) {
    const articuloExistente = await this.repository.obtenerPorId(id);

    if (!articuloExistente) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    this.validarIncrementoTiempoLectura(data.incremento);

    return await this.repository.incrementarTiempoLectura(id, data.incremento);
  }

  async obtenerArticulosMasLeidos(limit: number = 10) {
    const articulos = await this.repository.obtenerMasLeidos(limit);

    if (articulos.length === 0) {
      return [];
    }

    if (!this.reaccionesService) {
      return articulos.map((articulo) => this.adjuntarReacciones(articulo));
    }

    const articuloIds = articulos.map((a) => a.articuloId);
    const conteos = await this.reaccionesService.obtenerConteoMultiple(
      TipoEntidad.ARTICULO,
      articuloIds
    );

    return articulos.map((articulo) =>
      this.adjuntarReacciones(articulo, conteos[articulo.articuloId])
    );
  }

  private validarCamposObligatorios(data: CrearArticuloDTO) {
    if (!data.titulo || data.titulo.trim().length === 0) {
      throw new Error('El título es requerido');
    }

    if (!data.descripcion || data.descripcion.trim().length === 0) {
      throw new Error('La descripción es requerida');
    }

    if (!data.contenido || data.contenido.trim().length === 0) {
      throw new Error('El contenido es requerido');
    }
  }

  private validarTiempoLectura(valor: number) {
    if (!Number.isInteger(valor) || valor <= 0) {
      throw new Error('El tiempo de lectura debe ser un entero mayor a 0');
    }
  }

  private validarIncrementoTiempoLectura(valor: number) {
    if (!Number.isInteger(valor) || valor <= 0) {
      throw new Error('El incremento de tiempo de lectura debe ser un entero mayor a 0');
    }
  }

  private validarTransicionEstado(
    estadoActual: EstadoArticulo,
    nuevoEstado: EstadoArticulo
  ) {
    if (
      estadoActual === EstadoNoticia.RECHAZADO &&
      nuevoEstado !== EstadoNoticia.PENDIENTE_APROBACION
    ) {
      throw new Error(
        'Un artículo rechazado solo puede volver a estado PENDIENTE_APROBACION'
      );
    }

    if (
      estadoActual === EstadoNoticia.PUBLICADO &&
      (nuevoEstado === EstadoNoticia.PENDIENTE_APROBACION || nuevoEstado === EstadoNoticia.APROBADO)
    ) {
      throw new Error(
        'Un artículo publicado no puede volver a estado PENDIENTE_APROBACION o APROBADO'
      );
    }
  }
}
