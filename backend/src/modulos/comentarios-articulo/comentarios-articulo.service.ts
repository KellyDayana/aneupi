import { EstadoComentario } from '@prisma/client';
import { ComentariosArticuloRepository } from './comentarios-articulo.repository';
import { ArticulosRepository } from '../articulos/articulos.repository';
import {
  CrearComentarioArticuloDTO,
  ActualizarComentarioArticuloDTO,
  CambiarEstadoComentarioArticuloDTO,
} from './comentarios-articulo.types';

export class ComentariosArticuloService {
  constructor(
    private comentariosRepository: ComentariosArticuloRepository,
    private articulosRepository: ArticulosRepository
  ) { }

  async crearComentarioArticulo(data: CrearComentarioArticuloDTO) {
    this.validarMensaje(data.mensaje);

    const articulo = await this.articulosRepository.obtenerPorId(data.articuloId);
    if (!articulo) {
      throw new Error(`Artículo con ID ${data.articuloId} no encontrado`);
    }

    if (data.respuestaAId) {
      const comentarioPadre = await this.comentariosRepository.obtenerPorId(data.respuestaAId);
      if (!comentarioPadre) {
        throw new Error(`Comentario con ID ${data.respuestaAId} no encontrado`);
      }

      if (comentarioPadre.articuloId !== data.articuloId) {
        throw new Error('El comentario padre no pertenece a este artículo');
      }
    }

    return await this.comentariosRepository.crear(data);
  }

  async obtenerComentarioArticuloPorId(comentario_id: number) {
    const comentario = await this.comentariosRepository.obtenerPorId(comentario_id);

    if (!comentario) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    return comentario;
  }

  async obtenerComentariosDeArticulo(articuloId: number, incluirOcultos = false) {
    const articulo = await this.articulosRepository.obtenerPorId(articuloId);
    if (!articulo) {
      throw new Error(`Artículo con ID ${articuloId} no encontrado`);
    }

    return await this.comentariosRepository.obtenerPorArticulo(articuloId, incluirOcultos);
  }

  async actualizarComentarioArticulo(
    comentario_id: number,
    data: ActualizarComentarioArticuloDTO
  ) {
    const comentarioExistente = await this.comentariosRepository.obtenerPorId(comentario_id);
    if (!comentarioExistente) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    if (data.mensaje !== undefined) {
      this.validarMensaje(data.mensaje);
    }

    return await this.comentariosRepository.actualizar(comentario_id, data);
  }

  async cambiarEstadoComentarioArticulo(
    comentario_id: number,
    data: CambiarEstadoComentarioArticuloDTO
  ) {
    const comentarioExistente = await this.comentariosRepository.obtenerPorId(comentario_id);
    if (!comentarioExistente) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    return await this.comentariosRepository.cambiarEstado(comentario_id, data.estado);
  }

  async ocultarComentarioArticulo(comentario_id: number) {
    return await this.comentariosRepository.cambiarEstado(comentario_id, EstadoComentario.OCULTO);
  }

  async eliminarComentarioArticuloFisicamente(comentario_id: number) {
    const comentarioExistente = await this.comentariosRepository.obtenerPorId(comentario_id);
    if (!comentarioExistente) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    return await this.comentariosRepository.eliminarFisicamente(comentario_id);
  }

  async contarComentariosVisiblesPorArticulo(articuloId: number) {
    return await this.comentariosRepository.contarPorArticulo(articuloId);
  }

  private validarMensaje(mensaje: string) {
    if (!mensaje || mensaje.trim().length === 0) {
      throw new Error('El mensaje del comentario es requerido');
    }

    if (mensaje.trim().length < 3) {
      throw new Error('El comentario debe tener al menos 3 caracteres');
    }

    if (mensaje.length > 2000) {
      throw new Error('El comentario no puede exceder los 2000 caracteres');
    }
  }
}
