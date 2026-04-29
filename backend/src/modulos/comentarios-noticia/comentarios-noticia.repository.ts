// en src/modulos/comentarios-noticia/comentarios-noticia.repository.ts (CORREGIDO)
import { PrismaClient, EstadoComentario } from '@prisma/client';
import {
  CrearComentarioNoticiaDTO,
  ActualizarComentarioNoticiaDTO,
} from './comentarios-noticia.types';

export class ComentariosNoticiaRepository {
  constructor(private prisma: PrismaClient) { }

  async crear(data: CrearComentarioNoticiaDTO) {
    return this.prisma.comentarioNoticia.create({
      data: {
        mensaje: data.mensaje,
        usuarioId: data.usuarioId,
        noticiaId: data.noticiaId,
        respuestaAId: data.respuestaAId,
      },
      include: {
        usuario: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
          },
        },
        respuesta_a: {
          select: {
            comentarioId: true,
            mensaje: true,
            usuario: {
              select: {
                usuarioId: true,
                nombre_completo: true,
              },
            },
          },
        },
      },
    });
  }

  async obtenerPorId(comentarioId: number) {
    return this.prisma.comentarioNoticia.findUnique({
      where: { comentarioId },
      include: {
        usuario: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
          },
        },
        respuesta_a: {
          select: {
            comentarioId: true,
            mensaje: true,
            usuario: {
              select: {
                usuarioId: true,
                nombre_completo: true,
              },
            },
          },
        },
        respuestas: {
          where: { estado: EstadoComentario.VISIBLE },
          include: {
            usuario: {
              select: {
                usuarioId: true,
                nombre_completo: true,
              },
            },
          },
          orderBy: { fecha_hora: 'asc' },
        },
      },
    });
  }

  async obtenerPorNoticia(noticiaId: number, incluirOcultos = false) {
    return this.prisma.comentarioNoticia.findMany({
      where: {
        noticiaId,
        respuestaAId: null,
        ...(incluirOcultos ? {} : { estado: EstadoComentario.VISIBLE }),
      },
      include: {
        usuario: {
          select: {
            usuarioId: true,
            nombre_completo: true,
          },
        },
        respuestas: {
          where: { estado: EstadoComentario.VISIBLE },
          include: {
            usuario: {
              select: {
                usuarioId: true,
                nombre_completo: true,
              },
            },
          },
          orderBy: { fecha_hora: 'asc' },
        },
      },
      orderBy: { fecha_hora: 'desc' },
    });
  }

  async actualizar(comentarioId: number, data: ActualizarComentarioNoticiaDTO) {
    return this.prisma.comentarioNoticia.update({
      where: { comentarioId },
      data,
      include: {
        usuario: {
          select: {
            usuarioId: true,
            nombre_completo: true,
          },
        },
      },
    });
  }

  async cambiarEstado(comentarioId: number, estado: EstadoComentario) {
    return this.prisma.comentarioNoticia.update({
      where: { comentarioId },
      data: { estado },
      include: {
        usuario: {
          select: {
            usuarioId: true,
            nombre_completo: true,
          },
        },
      },
    });
  }

  async eliminarFisicamente(comentarioId: number) {
    return this.prisma.comentarioNoticia.delete({
      where: { comentarioId },
    });
  }

  async contarPorNoticia(noticiaId: number) {
    return this.prisma.comentarioNoticia.count({
      where: {
        noticiaId,
        estado: EstadoComentario.VISIBLE,
      },
    });
  }
}