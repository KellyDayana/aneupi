// en src/modulos/articulos/articulos.repository.ts (CORREGIDO)
import { PrismaClient, Prisma, EstadoNoticia } from '@prisma/client';
import {
  CrearArticuloDTO,
  ActualizarArticuloDTO,
  FiltrosArticulo,
  ActualizarTiempoLecturaDTO,
} from './articulos.types';

export class ArticulosRepository {
  constructor(private prisma: PrismaClient) { }

  async crear(data: CrearArticuloDTO) {
    return this.prisma.articulo.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        contenido: data.contenido,
        url_imagen: data.url_imagen,
        url_preview_imagen: data.url_preview_imagen,
        tiempo_lectura: data.tiempo_lectura,
        estado: data.estado,
        nombre_autor: data.nombre_autor ?? null,
        autor: {
          connect: {
            usuarioId: data.autorId
          }
        },
        categoria: {
          connect: {
            categoriaId: data.categoriaId
          }
        }
      },
      include: {
        autor: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }
  
  async obtenerTodos(filtros: FiltrosArticulo) {
    const where: Prisma.ArticuloWhereInput = {};

    if (filtros.categoriaId) where.categoriaId = filtros.categoriaId; // Corregido
    if (filtros.autorId) where.autorId = filtros.autorId; // Corregido
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.search) {
      where.OR = [
        { titulo: { contains: filtros.search, mode: 'insensitive' } },
        { descripcion: { contains: filtros.search, mode: 'insensitive' } },
        { contenido: { contains: filtros.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.articulo.findMany({
      where,
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
        _count: {
          select: {
            comentarios: true,
          },
        },
      },
      skip: filtros.skip || 0,
      take: filtros.take || 10,
      orderBy: {
        fechaPublicacion: filtros.orderBy || 'desc', // Corregido
      },
    });
  }

  async obtenerPorId(id: number) {
    return this.prisma.articulo.findUnique({
      where: { articuloId: id }, // Corregido
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
            rol: true,
          },
        },
        categoria: true,
      },
    });
  }

  async actualizar(id: number, data: ActualizarArticuloDTO) {
    return this.prisma.articulo.update({
      where: { articuloId: id }, // Corregido
      data,
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }

  async eliminar(id: number) {
    return this.prisma.articulo.delete({
      where: { articuloId: id }, // Corregido
    });
  }

  async ocultarArticulo(id: number) {
    return this.prisma.articulo.update({
      where: { articuloId: id }, // Corregido
      data: { estado: EstadoNoticia.OCULTO },
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }

  async incrementarVistas(id: number) {
    return this.prisma.articulo.update({
      where: { articuloId: id }, // Corregido
      data: { vistas: { increment: 1 } },
    });
  }

  async cambiarEstado(id: number, estado: EstadoNoticia, motivo_rechazo?: string) {
    return this.prisma.articulo.update({
      where: { articuloId: id }, // Corregido
      data: {
        estado,
        motivo_rechazo: motivo_rechazo ?? null,
      },
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }

  async obtenerMasLeidos(limit: number = 10) {
    return this.prisma.articulo.findMany({
      take: limit,
      orderBy: { vistas: 'desc' },
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
          },
        },
        categoria: true,
      },
    });
  }

  async actualizarTiempoLectura(id: number, data: ActualizarTiempoLecturaDTO) {
    return this.prisma.articulo.update({
      where: { articuloId: id }, // Corregido
      data: { tiempo_lectura: data.tiempo_lectura },
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }

  async incrementarTiempoLectura(id: number, incremento: number) {
    return this.prisma.articulo.update({
      where: { articuloId: id }, // Corregido
      data: { tiempo_lectura: { increment: incremento } },
      include: {
        autor: {
          select: {
            usuarioId: true, // Corregido
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
    });
  }

  async obtenerPendientes() {
    return this.prisma.articulo.findMany({
      where: { estado: EstadoNoticia.PENDIENTE_APROBACION },
      include: {
        autor: {
          select: {
            usuarioId: true,
            nombre_completo: true,
            email: true,
          },
        },
        categoria: true,
      },
      orderBy: { fechaPublicacion: 'asc' },
    });
  }
}