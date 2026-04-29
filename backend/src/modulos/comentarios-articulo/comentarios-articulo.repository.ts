// en src/modulos/comentarios-articulo/comentarios-articulo.repository.ts (CORREGIDO)
import { PrismaClient, EstadoComentario } from '@prisma/client';
import {
  CrearComentarioArticuloDTO,
  ActualizarComentarioArticuloDTO,
} from './comentarios-articulo.types';

export class ComentariosArticuloRepository {
  constructor(private prisma: PrismaClient) { }

  async crear(data: CrearComentarioArticuloDTO) {
    return this.prisma.comentarioArticulo.create({
      data: {
        mensaje: data.mensaje,
        usuarioId: data.usuarioId,
        articuloId: data.articuloId,
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
    return this.prisma.comentarioArticulo.findUnique({
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

  async obtenerPorArticulo(articuloId: number, incluirOcultos = false) {
    return this.prisma.comentarioArticulo.findMany({
      where: {
        articuloId,
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

  async actualizar(comentarioId: number, data: ActualizarComentarioArticuloDTO) {
    return this.prisma.comentarioArticulo.update({
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
    return this.prisma.comentarioArticulo.update({
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
    return this.prisma.comentarioArticulo.delete({
      where: { comentarioId },
    });
  }

  async contarPorArticulo(articuloId: number) {
    return this.prisma.comentarioArticulo.count({
      where: {
        articuloId,
        estado: EstadoComentario.VISIBLE,
      },
    });
  }
}