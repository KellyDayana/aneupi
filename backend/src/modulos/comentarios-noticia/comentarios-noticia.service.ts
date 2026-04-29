import { ComentariosNoticiaRepository } from './comentarios-noticia.repository';
import { NoticiasRepository } from '../noticias/noticias.repository';
import {
  CrearComentarioNoticiaDTO,
  ActualizarComentarioNoticiaDTO,
  CambiarEstadoComentarioNoticiaDTO,
} from './comentarios-noticia.types';

export class ComentariosNoticiaService {
  constructor(
    private comentariosRepository: ComentariosNoticiaRepository,
    private noticiasRepository: NoticiasRepository
  ) { }

  async crearComentarioNoticia(data: CrearComentarioNoticiaDTO) {
    if (!data.mensaje || data.mensaje.trim().length === 0) {
      throw new Error('El mensaje del comentario es requerido');
    }

    if (data.mensaje.trim().length < 3) {
      throw new Error('El comentario debe tener al menos 3 caracteres');
    }

    if (data.mensaje.length > 2000) {
      throw new Error('El comentario no puede exceder los 2000 caracteres');
    }

    const noticia = await this.noticiasRepository.obtenerPorId(data.noticiaId);
    if (!noticia) {
      throw new Error(`Noticia con ID ${data.noticiaId} no encontrada`);
    }

    if (data.respuestaAId) {
      const comentarioPadre = await this.comentariosRepository.obtenerPorId(data.respuestaAId);
      if (!comentarioPadre) {
        throw new Error(`Comentario con ID ${data.respuestaAId} no encontrado`);
      }

      if (comentarioPadre.noticiaId !== data.noticiaId) {
        throw new Error('El comentario padre no pertenece a esta noticia');
      }
    }

    return await this.comentariosRepository.crear(data);
  }

  async obtenerComentarioNoticiaPorId(comentario_id: number) {
    const comentario = await this.comentariosRepository.obtenerPorId(comentario_id);

    if (!comentario) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    return comentario;
  }

  async obtenerComentariosDeNoticia(noticia_id: number, incluirOcultos = false) {
    const noticia = await this.noticiasRepository.obtenerPorId(noticia_id);
    if (!noticia) {
      throw new Error(`Noticia con ID ${noticia_id} no encontrada`);
    }

    return await this.comentariosRepository.obtenerPorNoticia(noticia_id, incluirOcultos);
  }

  async actualizarComentarioNoticia(comentario_id: number, data: ActualizarComentarioNoticiaDTO) {
    const comentarioExistente = await this.comentariosRepository.obtenerPorId(comentario_id);
    if (!comentarioExistente) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    if (data.mensaje !== undefined) {
      if (data.mensaje.trim().length === 0) {
        throw new Error('El mensaje del comentario no puede estar vacío');
      }

      if (data.mensaje.trim().length < 3) {
        throw new Error('El comentario debe tener al menos 3 caracteres');
      }

      if (data.mensaje.length > 2000) {
        throw new Error('El comentario no puede exceder los 2000 caracteres');
      }
    }

    return await this.comentariosRepository.actualizar(comentario_id, data);
  }

  async cambiarEstadoComentarioNoticia(
    comentario_id: number,
    data: CambiarEstadoComentarioNoticiaDTO
  ) {
    const comentarioExistente = await this.comentariosRepository.obtenerPorId(comentario_id);
    if (!comentarioExistente) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    return await this.comentariosRepository.cambiarEstado(comentario_id, data.estado);
  }

  async ocultarComentarioNoticia(comentario_id: number) {
    return await this.comentariosRepository.cambiarEstado(comentario_id, 'OCULTO' as any);
  }

  async eliminarComentarioNoticiaFisicamente(comentario_id: number) {
    const comentarioExistente = await this.comentariosRepository.obtenerPorId(comentario_id);
    if (!comentarioExistente) {
      throw new Error(`Comentario con ID ${comentario_id} no encontrado`);
    }

    return await this.comentariosRepository.eliminarFisicamente(comentario_id);
  }

  async contarComentariosVisiblesPorNoticia(noticia_id: number) {
    return await this.comentariosRepository.contarPorNoticia(noticia_id);
  }
}
